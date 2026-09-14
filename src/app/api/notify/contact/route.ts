import { NextRequest, NextResponse } from "next/server";
import { sendNotification, type NotifyRow } from "@/lib/notify";
import { splitName } from "@/lib/smd2026";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Site-wide contact form notification.
 *
 * Fires three things in one request (best-effort — none block the others):
 *
 *  1. German notification email to info@sh-wachstum.de + info@tylotech.de
 *     via Resend (existing behavior).
 *  2. HubSpot: upsert the contact by email (firstname/lastname split from
 *     Name, phone if provided), tag it as origin "Website" / lead_magnet
 *     "Kontaktformular", write betreff + nachricht into `message`, and
 *     add it to the Kontaktformular segment list (env
 *     KONTAKT_HUBSPOT_LIST_ID — create the list in HubSpot then set the id
 *     in Vercel; without it, the contact is still upserted, just not
 *     added to a list).
 *  3. Google Sheet: append a row to the shared "Meta Ads Leads"
 *     spreadsheet via the Apps Script webhook, tagged `formType:
 *     "kontakt"` so the router lands it on the Kontakt tab.
 *
 * Requires env: RESEND_API_KEY (email).
 * Optional env: HUBSPOT_TOKEN, KONTAKT_HUBSPOT_LIST_ID, GOOGLE_SHEET_WEBHOOK_URL.
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;
const KONTAKT_LIST_ID = process.env.KONTAKT_HUBSPOT_LIST_ID;
const SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL ?? "";

/** HubSpot: upsert by email + add to the Kontaktformular list. Fire-and-log. */
async function pushHubspot(input: {
  name: string;
  email: string;
  telefon: string;
  betreff: string;
  nachricht: string;
}): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const { firstName, lastName } = splitName(input.name);
  const properties: Record<string, string> = {
    email: input.email,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Two-level origin tagging — matches ebook / whitepaper / leitfaden.
    lead_source: "Website",
    lead_magnet: "Kontaktformular",
    // Free-text body so the sales team sees what was asked without opening
    // the email. Kept single-field because HubSpot has no dedicated
    // "betreff" / "nachricht" properties in this portal.
    message: [
      "Kontaktformular auf der Website",
      input.betreff ? `Betreff: ${input.betreff}` : "",
      `Nachricht: ${input.nachricht}`,
    ]
      .filter(Boolean)
      .join(" · "),
  };
  if (firstName) properties.firstname = firstName;
  if (lastName) properties.lastname = lastName;
  if (input.telefon) properties.phone = input.telefon;

  // Try create; on 409 (already exists) patch by email. If the portal
  // hasn't got lead_source / lead_magnet yet, strip them and retry once —
  // same guard used everywhere else in this codebase.
  const attempt = async (
    props: Record<string, string>,
  ): Promise<{ status: number; text: string; contactId?: string }> => {
    const c = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ properties: props }),
    });
    if (c.ok) {
      const j = (await c.json()) as { id: string };
      return { status: c.status, text: "", contactId: j.id };
    }
    if (c.status === 409) {
      const p = await fetch(
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(input.email)}?idProperty=email`,
        { method: "PATCH", headers, body: JSON.stringify({ properties: props }) },
      );
      if (p.ok) {
        const j = (await p.json()) as { id: string };
        return { status: p.status, text: "", contactId: j.id };
      }
      return { status: p.status, text: await p.text() };
    }
    return { status: c.status, text: await c.text() };
  };

  const first = await attempt(properties);
  let contactId = first.contactId;
  if (!contactId) {
    if (first.status === 400 && /lead_source|lead_magnet/i.test(first.text)) {
      console.warn(
        "[notify/contact] hubspot rejected lead_source/lead_magnet — retrying without them; create these two custom contact properties in HubSpot to enable two-level tagging.",
      );
      const { lead_source: _s, lead_magnet: _m, ...rest } = properties;
      void _s;
      void _m;
      const retry = await attempt(rest);
      if (!retry.contactId) {
        return {
          ok: false,
          reason: `hubspot retry: ${retry.status} ${retry.text}`,
        };
      }
      contactId = retry.contactId;
    } else {
      return { ok: false, reason: `hubspot: ${first.status} ${first.text}` };
    }
  }

  if (contactId && KONTAKT_LIST_ID) {
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${KONTAKT_LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn(
        "[notify/contact] list add failed:",
        add.status,
        await add.text(),
      );
    }
  } else if (contactId && !KONTAKT_LIST_ID) {
    console.warn(
      "[notify/contact] KONTAKT_HUBSPOT_LIST_ID not set — contact upserted but not added to a segment list; create a 'Kontaktformular' list in HubSpot and set the id in Vercel.",
    );
  }
  return { ok: true, contactId };
}

/**
 * Append the row to the shared "Meta Ads Leads" sheet via the Apps Script
 * webhook. `formType: "kontakt"` tells the router (scripts/leitfaden-sheet.gs)
 * to write to the Kontakt tab (Sheet3). The '+ prefix keeps Sheets from
 * turning +49… into a formula.
 */
async function appendToSheet(row: {
  name: string;
  email: string;
  telefon: string;
  betreff: string;
  nachricht: string;
  pageUrl: string;
}): Promise<void> {
  if (!SHEET_URL) {
    console.warn(
      "[notify/contact] no sheet webhook configured — set GOOGLE_SHEET_WEBHOOK_URL",
    );
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "kontakt",
        name: row.name,
        phone: row.telefon ? `'${row.telefon}` : "",
        email: row.email,
        betreff: row.betreff,
        nachricht: row.nachricht,
        landingPage: "Kontaktformular",
        pageUrl: row.pageUrl,
      }),
    });
  } catch (err) {
    console.error(
      "[notify/contact] sheet append failed:",
      (err as Error).message,
    );
  }
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    telefon?: string;
    betreff?: string;
    nachricht?: string;
    pageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid-json" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const telefon = body.telefon?.trim() ?? "";
  const betreff = body.betreff?.trim() ?? "";
  const nachricht = body.nachricht?.trim() ?? "";
  const pageUrl = body.pageUrl?.trim() ?? "";

  if (!name || !email || !nachricht) {
    return NextResponse.json(
      { ok: false, reason: "name, email and nachricht are required" },
      { status: 400 },
    );
  }

  // Kick off HubSpot and Sheets in parallel with the email. All three are
  // best-effort — if HubSpot / Sheets fail, the sales team still gets the
  // email, and vice versa.
  const hsPromise = pushHubspot({ name, email, telefon, betreff, nachricht })
    .catch((err) => ({ ok: false as const, reason: (err as Error).message }));
  void appendToSheet({ name, email, telefon, betreff, nachricht, pageUrl });

  const rows: NotifyRow[] = [
    { label: "Name", value: name },
    { label: "E-Mail", value: email },
  ];
  if (telefon) rows.push({ label: "Telefon", value: telefon });
  if (betreff) rows.push({ label: "Betreff", value: betreff });
  rows.push({ label: "Nachricht", value: nachricht });

  try {
    const result = await sendNotification({
      subject: `Neue Kontaktanfrage von ${name}${betreff ? ` — ${betreff}` : ""}`,
      intro: `Über das Kontaktformular auf der Website ist eine neue Nachricht eingegangen. Antworte einfach auf diese E-Mail, um direkt an ${name} zu schreiben.`,
      rows,
      replyTo: email,
    });

    const hs = await hsPromise;
    if (!hs.ok) console.warn("[notify/contact] hubspot failed:", hs.reason);

    if (!result.ok) {
      console.error("[notify/contact] send failed:", result.reason);
      return NextResponse.json(
        {
          ...result,
          hubspotContactId: hs.ok ? hs.contactId : null,
        },
        { status: 200 },
      );
    }
    return NextResponse.json({
      ...result,
      hubspotContactId: hs.ok ? hs.contactId : null,
    });
  } catch (err) {
    console.error("[notify/contact] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
