import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { LEITFADEN } from "@/lib/leitfaden";
import { checkVerificationCode, normalizeE164 } from "@/lib/twilio";
import { buildVerifiedCookie, readVerifiedPhone } from "@/lib/phoneVerify";
import {
  magnetFrom,
  magnetReplyTo,
  renderMagnetEmailHtml,
  renderMagnetEmailText,
} from "@/lib/email-branding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead-magnet subscription: /api/leitfaden/subscribe
 *   POST { name, phone, email, turnstileToken, pageUrl }
 *
 * Fires four things in one request (all failures are logged, none block
 * each other):
 *  1. Cloudflare Turnstile bot check.
 *  2. Upsert the contact in HubSpot with email + firstname + phone, then
 *     add them to list 793
 *     ("Lead Magnet - Rollenspiel Handwerks VS Agentur").
 *  3. Send the subscriber a German confirmation e-mail from Resend with
 *     the PDF attached (falls back to a signed download link if the PDF
 *     is missing from disk). Internal team is BCCed.
 *  4. Append the row to the shared Google Sheet via the Apps Script
 *     webhook so the sales team sees every download in one place.
 *
 * Requires env: HUBSPOT_TOKEN, RESEND_API_KEY.
 * Optional env:
 *   LEITFADEN_LIST_ID          (default: 793)
 *   NOTIFY_FROM                (default: Sales Mastery Days <noreply@sh-wachstum.de>)
 *   NOTIFY_TO                  (default: info@sh-wachstum.de,info@tylotech.de)
 *   LEITFADEN_SHEET_WEBHOOK_URL  Apps Script /exec URL for the leitfaden sheet
 *   GOOGLE_SHEET_WEBHOOK_URL     Fallback (the existing potenzialanalyse sheet)
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;
const LIST_ID = process.env.LEITFADEN_LIST_ID ?? "793";

const RESEND_KEY = process.env.RESEND_API_KEY;
/** Sender name = "Selmir Suljkanovic · Leitfaden" so the inbox row
 *  identifies which form the visitor filled. */
const FROM = magnetFrom("leitfaden");
const CC_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Google Sheet Apps Script webhook. Prefer a leitfaden-specific one if
// set; otherwise fall back to the shared potenzialanalyse webhook so the
// row still lands somewhere the sales team can see it.
const SHEET_URL =
  process.env.LEITFADEN_SHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "";

/** User-side confirmation email — shared branded template. Copy stays
 *  inline here since it's not shared with any other route. */
function buildUserEmail(firstName: string, downloadUrl: string) {
  const content = {
    firstName,
    subject: "Dein Rollenspiel-Leitfaden",
    heading: "Dein Rollenspiel-Leitfaden ist da.",
    intro:
      "danke für dein Interesse — anbei der komplette Rollenspiel-Leitfaden als PDF. 10 Seiten, 6 Kapitel: Begrüßung, die richtigen Fragen, Einwandbehandlung und Abschluss. Alles direkt aus dem Rollenspiel-Video.",
    closingNote:
      "Lies den Leitfaden in 20 Minuten, markier dir die Formulierungen und probier sie im nächsten Termin. Wenn du sie einmal spürst, wirst du sie nicht mehr weglegen.",
    buttonLabel: "PDF direkt herunterladen",
    downloadUrl,
    attachmentHint:
      "Falls der Anhang bei dir gefiltert wurde, kannst du den Leitfaden auch hier laden:",
  };
  return {
    subject: content.subject,
    html: renderMagnetEmailHtml("leitfaden", content),
    text: renderMagnetEmailText(content),
  };
}

/** Try to read the PDF from disk; return base64 (or null on failure). */
async function loadPdfBase64(): Promise<string | null> {
  try {
    const abs = path.join(process.cwd(), LEITFADEN.pdfPath);
    const buf = await readFile(abs);
    return buf.toString("base64");
  } catch (err) {
    console.warn("[leitfaden] PDF not readable:", (err as Error).message);
    return null;
  }
}

/** HubSpot: upsert by email, then add to the lead-magnet list. */
async function pushHubspot({
  firstName,
  phone,
  email,
}: {
  firstName: string;
  phone: string;
  email: string;
}): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };
  // NOTE: hs_analytics_source_* is read-only in HubSpot — writing to it
  // rejects the entire create with a 400 (which silently killed every
  // lead-magnet submission before this fix). The list membership itself
  // (list 793) is now the source-tag: it's the same segment we filter on.
  const properties: Record<string, string> = {
    email,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Two-level origin tagging (custom contact properties). See the
    // matching block in src/app/api/ebook/subscribe/route.ts for why.
    lead_source: "Website",
    lead_magnet: "Rollenspiel Leitfaden",
  };
  if (firstName) properties.firstname = firstName;
  if (phone) properties.phone = phone;

  // Try create; on 409 (already exists) fall through to patch by email.
  // If HubSpot rejects with 400 because lead_source / lead_magnet don't
  // exist as portal properties yet, the tags are stripped and the write
  // is retried once — so lead capture keeps flowing while the two
  // properties are being created in HubSpot Settings → Properties.
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
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
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
        "[leitfaden] hubspot rejected lead_source/lead_magnet — retrying without them; create these two custom contact properties in HubSpot to enable two-level tagging.",
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
      return {
        ok: false,
        reason: `hubspot: ${first.status} ${first.text}`,
      };
    }
  }

  if (contactId) {
    // Add to the lead-magnet list (fire-and-log; don't fail the subscribe)
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn(
        "[leitfaden] list add failed:",
        add.status,
        await add.text(),
      );
    }
  }
  return { ok: true, contactId };
}

/**
 * Append the lead to the shared "Meta Ads Leads" spreadsheet via the
 * Apps Script webhook. The router in scripts/leitfaden-sheet.gs sees the
 * `formType: "leitfaden"` and writes the row to Sheet2 (potenzialanalyse
 * submissions still land in Sheet1). Best-effort — sheet errors never
 * block the PDF delivery. The '  prefix keeps Sheets from turning
 * +49… into a formula.
 */
async function appendToSheet(row: {
  name: string;
  phone: string;
  email: string;
  pageUrl: string;
  landingPage: string;
}): Promise<void> {
  if (!SHEET_URL) {
    console.warn(
      "[leitfaden] no sheet webhook configured — set GOOGLE_SHEET_WEBHOOK_URL",
    );
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "leitfaden",
        name: row.name,
        phone: row.phone ? `'${row.phone}` : "",
        email: row.email,
        landingPage: row.landingPage,
        pageUrl: row.pageUrl,
      }),
    });
  } catch (err) {
    console.error("[leitfaden] sheet append failed:", (err as Error).message);
  }
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    phone?: string;
    email?: string;
    code?: string;
    pageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }
  const firstName = (body.name ?? "").trim();
  const rawPhone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").trim();
  const pageUrl = (body.pageUrl ?? "").trim();
  // All three visible fields are required. Return the first offender so
  // the client can show a targeted error.
  if (!firstName) {
    return NextResponse.json(
      { ok: false, reason: "name is required" },
      { status: 400 },
    );
  }
  if (!rawPhone) {
    return NextResponse.json(
      { ok: false, reason: "phone is required" },
      { status: 400 },
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, reason: "email is required" },
      { status: 400 },
    );
  }

  // Phone verification path A — a valid `sh_pv` cookie from a prior
  // successful verify lets us skip Twilio entirely. Server re-computes
  // the HMAC on every request so a tampered cookie is rejected.
  const cookieHeader = req.headers.get("cookie");
  const cookiePhone = readVerifiedPhone(cookieHeader);
  const normalizedFromInput = normalizeE164(rawPhone);
  const canUseCookie =
    !!cookiePhone &&
    !!normalizedFromInput &&
    cookiePhone === normalizedFromInput;

  let phone: string;
  if (canUseCookie) {
    phone = cookiePhone;
  } else {
    // Phone verification path B — fresh Twilio Verify check.
    if (!code) {
      return NextResponse.json(
        {
          ok: false,
          reason:
            "Bitte gib den SMS-Code ein, den wir an deine Nummer geschickt haben.",
        },
        { status: 400 },
      );
    }
    const twilio = await checkVerificationCode(rawPhone, code);
    if (!twilio.ok) {
      console.warn("[leitfaden] twilio check failed:", twilio.reason);
      return NextResponse.json(
        { ok: false, reason: twilio.reason },
        { status: 400 },
      );
    }
    phone = twilio.phone;
  }

  const origin =
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "www.selmir-suljkanovic.de"}`;
  const downloadUrl = `${origin.replace(/\/$/, "")}${LEITFADEN.pdfUrl}`;

  // 1. HubSpot — never blocks e-mail delivery.
  const hs = await pushHubspot({ firstName, phone, email }).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  if (!hs.ok) console.warn("[leitfaden] hubspot failed:", hs.reason);

  // 2. Google Sheet — fire-and-forget; never blocks anything.
  void appendToSheet({
    name: firstName,
    phone,
    email,
    pageUrl,
    landingPage: "Leitfaden Rollenspiel",
  });

  // 3. Send the PDF e-mail via Resend.
  if (!RESEND_KEY) {
    return NextResponse.json(
      { ok: false, reason: "RESEND_API_KEY not set" },
      { status: 200 },
    );
  }
  const pdfBase64 = await loadPdfBase64();
  const resend = new Resend(RESEND_KEY);
  const { subject, html, text } = buildUserEmail(firstName, downloadUrl);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      bcc: CC_TO,
      subject,
      html,
      text,
      replyTo: magnetReplyTo(),
      attachments: pdfBase64
        ? [
            {
              filename: LEITFADEN.pdfFilename,
              content: pdfBase64,
            },
          ]
        : undefined,
    });
    if (error) throw new Error(error.message ?? JSON.stringify(error));

    // Issue the "verified phone" cookie so the same browser skips the SMS
    // step on future visits. Refreshes the 30-day expiry whether we used
    // the fresh Twilio check or the existing cookie.
    const cookie = buildVerifiedCookie(phone);
    const res = NextResponse.json({
      ok: true,
      messageId: data?.id ?? null,
      hubspotContactId: hs.ok ? hs.contactId : null,
      attached: !!pdfBase64,
      verifiedPhone: phone,
    });
    if (cookie) res.headers.set("Set-Cookie", cookie.header);
    return res;
  } catch (err) {
    console.error("[leitfaden] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
