import { NextRequest, NextResponse } from "next/server";
import { sendNotification, type NotifyRow } from "@/lib/notify";
import type { LeadAttribution } from "@/lib/attribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Handwerker-Painpoints Kampagne — dedicated lead intake.
 *
 * POST { vorname, nachname, telefon, email, pageUrl?, attribution? }
 *
 * Fans out to three places, all best-effort:
 *   1. HubSpot: upsert the contact by email with firstname / lastname /
 *      phone, tag it as origin "Website" / lead_magnet
 *      "Handwerk Erstgespräch – Potenzialanalyse", write attribution to
 *      the `lp_*` properties, and add it to the campaign's own segment
 *      list (env `HANDWERKER_PAINPOINTS_LIST_ID` — create the list in
 *      HubSpot then set the id in Vercel; without it the contact is
 *      still upserted, just not added to the segment).
 *   2. Sales notification email to info@sh-wachstum.de + info@tylotech.de
 *      via Resend. Same format as /api/notify/lead — reply-to is the
 *      lead's email so the sales team can hit reply.
 *   3. Meta CAPI Lead event (env-gated on `META_CAPI_ACCESS_TOKEN` +
 *      `META_PIXEL_ID`). Sends the hashed email + phone so Ads reporting
 *      matches the pixel-side event even if the browser dropped it.
 *
 * The client-side Meta Pixel `Lead` event still fires in the form
 * component, so the pixel path works with or without a CAPI token set.
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;
const SEGMENT_LIST_ID = process.env.HANDWERKER_PAINPOINTS_LIST_ID;

const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_PIXEL_ID = process.env.META_PIXEL_ID ?? "1677666316641507";

// Google Sheet Apps Script webhook — same public endpoint the other LP
// forms use. `formType: "painpoints"` tells the router
// (scripts/leitfaden-sheet.gs) to write to the Handwerker-Painpoints tab.
const SHEET_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "https://script.google.com/macros/s/AKfycbzyCReYrLxFN95sNd5hmHtHl8Uk4XVpPzwR5g4CJgj6y673LtsKKFe2lzRQwaM_QtM2/exec";

interface PainpointsSubmit {
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  pageUrl?: string;
  attribution?: LeadAttribution;
}

/** SHA-256 hex — Meta CAPI's expected format for hashed user data. */
async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HubSpot: upsert by email + add to the Painpoints segment list. */
async function pushHubspot(
  b: PainpointsSubmit,
): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const properties: Record<string, string> = {
    email: b.email,
    firstname: b.vorname,
    lastname: b.nachname,
    phone: b.telefon,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Two-level origin tagging — matches the other lead magnets.
    lead_source: "Website",
    lead_magnet: "Handwerk Erstgespräch – Potenzialanalyse",
    // Landingpage properties (same group the /api/lead route writes to).
    lp_landing_page: "Handwerker-Painpoints",
    lp_submitted_at: new Date().toISOString(),
  };

  // Ad attribution — only write non-empty values so a later direct visit
  // can't blank out the original campaign source.
  const a = b.attribution ?? {};
  const attributionProps: Record<string, string | undefined> = {
    lp_utm_source: a.utmSource,
    lp_utm_medium: a.utmMedium,
    lp_utm_campaign: a.utmCampaign,
    lp_utm_content: a.utmContent,
    lp_utm_term: a.utmTerm,
    lp_campaign_id: a.campaignId,
    lp_adset_id: a.adsetId,
    lp_ad_id: a.adId,
    lp_fbclid: a.fbclid,
    lp_landing_page_url: a.landingPageUrl,
    lp_referrer: a.referrer,
  };
  for (const [key, value] of Object.entries(attributionProps)) {
    if (value) properties[key] = value;
  }

  // Try create; 409 → PATCH by email. If the portal hasn't got
  // lead_source / lead_magnet yet, strip them and retry once — same
  // guard as the ebook / leitfaden / kontakt routes.
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
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(b.email)}?idProperty=email`,
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
        "[lp/handwerker-painpoints] hubspot rejected lead_source/lead_magnet — retrying without them.",
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

  if (contactId && SEGMENT_LIST_ID) {
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${SEGMENT_LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn(
        "[lp/handwerker-painpoints] list add failed:",
        add.status,
        await add.text(),
      );
    }
  } else if (contactId && !SEGMENT_LIST_ID) {
    console.warn(
      "[lp/handwerker-painpoints] HANDWERKER_PAINPOINTS_LIST_ID not set — contact upserted but not added to the campaign segment; create the list in HubSpot and set the id in Vercel.",
    );
  }
  return { ok: true, contactId };
}

/**
 * Append the lead as a row to the shared "Meta Ads Leads" sheet via the
 * Apps Script webhook. `formType: "painpoints"` tells the router to
 * write to the Handwerker-Painpoints tab. The '+ prefix keeps Sheets
 * from turning +49… into a formula. Fire-and-forget — sheet errors
 * never block HubSpot or the email.
 */
async function appendToSheet(b: PainpointsSubmit): Promise<void> {
  if (!SHEET_URL) {
    console.warn(
      "[lp/handwerker-painpoints] no sheet webhook configured — set GOOGLE_SHEET_WEBHOOK_URL",
    );
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "painpoints",
        vorname: b.vorname,
        nachname: b.nachname,
        phone: b.telefon ? `'${b.telefon}` : "",
        email: b.email,
        landingPage: "Handwerker-Painpoints",
        pageUrl: b.pageUrl || "",
        utmSource: b.attribution?.utmSource || "",
        utmCampaign: b.attribution?.utmCampaign || "",
      }),
    });
  } catch (err) {
    console.error(
      "[lp/handwerker-painpoints] sheet append failed:",
      (err as Error).message,
    );
  }
}

/** Server-side Meta CAPI Lead event — no-op if env not configured. */
async function pushMetaCapi(
  b: PainpointsSubmit,
  req: NextRequest,
): Promise<void> {
  if (!META_CAPI_TOKEN) return;
  try {
    const emailHash = await sha256Hex(b.email);
    // Meta expects phone digits only (no leading + and no spaces).
    const phoneDigits = b.telefon.replace(/[^0-9]/g, "");
    const phoneHash = phoneDigits ? await sha256Hex(phoneDigits) : undefined;
    const firstHash = b.vorname ? await sha256Hex(b.vorname) : undefined;
    const lastHash = b.nachname ? await sha256Hex(b.nachname) : undefined;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const userData: Record<string, string | undefined> = {
      em: emailHash,
      ph: phoneHash,
      fn: firstHash,
      ln: lastHash,
      client_ip_address: ip,
      client_user_agent: userAgent,
      fbc: b.attribution?.fbclid
        ? `fb.1.${Date.now()}.${b.attribution.fbclid}`
        : undefined,
    };
    for (const k of Object.keys(userData)) {
      if (userData[k] === undefined) delete userData[k];
    }

    const res = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Lead",
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: b.pageUrl || b.attribution?.landingPageUrl,
              action_source: "website",
              user_data: userData,
              custom_data: {
                content_name: "Handwerk Erstgespräch – Potenzialanalyse",
                content_category: "Landingpage",
              },
            },
          ],
        }),
      },
    );
    if (!res.ok) {
      console.warn(
        "[lp/handwerker-painpoints] Meta CAPI Lead failed:",
        res.status,
        await res.text(),
      );
    }
  } catch (err) {
    console.warn(
      "[lp/handwerker-painpoints] Meta CAPI Lead error:",
      (err as Error).message,
    );
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<PainpointsSubmit>;
  try {
    body = (await req.json()) as Partial<PainpointsSubmit>;
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }

  const vorname = body.vorname?.trim() ?? "";
  const nachname = body.nachname?.trim() ?? "";
  const telefon = body.telefon?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const pageUrl = body.pageUrl?.trim() ?? "";
  const attribution = body.attribution;

  if (!vorname || !nachname || !telefon || !email) {
    return NextResponse.json(
      { ok: false, reason: "vorname, nachname, telefon and email are required" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, reason: "email is invalid" },
      { status: 400 },
    );
  }

  const submit: PainpointsSubmit = {
    vorname,
    nachname,
    telefon,
    email,
    pageUrl,
    attribution,
  };

  // Fan out in parallel — none blocks the others.
  const hsPromise = pushHubspot(submit).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  void pushMetaCapi(submit, req);
  void appendToSheet(submit);

  const rows: NotifyRow[] = [
    { label: "Vorname", value: vorname },
    { label: "Nachname", value: nachname },
    { label: "Telefonnummer", value: telefon },
    { label: "E-Mail", value: email },
    { label: "Kampagne", value: "Handwerk Erstgespräch – Potenzialanalyse" },
    { label: "Landingpage", value: "/lp/handwerker-painpoints" },
  ];
  if (pageUrl) rows.push({ label: "Seiten-URL", value: pageUrl });

  try {
    const result = await sendNotification({
      subject: `Neue Potenzialanalyse-Anfrage von ${vorname} ${nachname}`,
      intro: `Über die Landingpage "Handwerker-Painpoints" ist eine neue Anfrage für die kostenlose Potenzialanalyse eingegangen. Antworte einfach auf diese E-Mail, um direkt an ${vorname} zu schreiben.`,
      rows,
      replyTo: email,
    });

    const hs = await hsPromise;
    if (!hs.ok) console.warn("[lp/handwerker-painpoints] hubspot failed:", hs.reason);

    return NextResponse.json({
      ok: result.ok,
      reason: result.ok ? undefined : result.reason,
      hubspotContactId: hs.ok ? hs.contactId : null,
    });
  } catch (err) {
    console.error(
      "[lp/handwerker-painpoints] resend error:",
      (err as Error).message,
    );
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
