import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { checkVerificationCode, normalizeE164 } from "@/lib/twilio";
import { buildVerifiedCookie, readVerifiedPhone } from "@/lib/phoneVerify";
import {
  EBOOK_EMAIL,
  EBOOK_HUBSPOT_LIST_ID,
  EBOOK_PDF_FILENAME,
  EBOOK_PDF_PATH,
  EBOOK_PDF_URL,
  EBOOK_SOURCE_LABEL,
  HERO as EBOOK_HERO,
} from "@/lib/ebook";
import {
  magnetFrom,
  magnetReplyTo,
  renderMagnetEmailHtml,
  renderMagnetEmailText,
} from "@/lib/email-branding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * E-book lead-magnet subscription: /api/ebook/subscribe
 *   POST { name, phone, email, turnstileToken, pageUrl }
 *
 * Simpler than the leitfaden endpoint — no SMS verify layer, just:
 *   1. Cloudflare Turnstile bot check
 *   2. HubSpot upsert + push to list "E-Book – Führungskräfte" (816)
 *   3. Google Sheet row (Sheet2, tagged Landingpage="E-Book Führungskräfte")
 *   4. Resend delivers the PDF immediately (fallback until Ili sets up
 *      the HubSpot workflow that will send it from Selmir's inbox)
 *
 * The Meta Pixel "Lead" event fires client-side (see EbookForm.tsx).
 * Server-side CAPI is not wired here yet — needs META_CAPI_ACCESS_TOKEN
 * env var and the Meta Pixel's associated dataset ID; add a
 * capiSendLead() helper here when Ili provides those.
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;

const RESEND_KEY = process.env.RESEND_API_KEY;
/** Sender name = "Selmir Suljkanovic · E-Book" so the inbox row
 *  identifies the form. Address stays on the verified domain. */
const FROM = magnetFrom("ebook");
const CC_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const SHEET_URL =
  process.env.EBOOK_SHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "";

/** User-side confirmation email — shared branded template with the
 *  E-Book copy from src/lib/ebook.ts. */
function buildUserEmail(firstName: string, downloadUrl: string) {
  const content = {
    firstName,
    subject: EBOOK_EMAIL.subject,
    heading: EBOOK_EMAIL.heading,
    intro: EBOOK_EMAIL.intro,
    closingNote: EBOOK_EMAIL.closingNote,
    buttonLabel: EBOOK_EMAIL.buttonLabel,
    downloadUrl,
    attachmentHint:
      "Falls der Anhang bei dir gefiltert wurde, kannst du das E-Book auch hier laden:",
  };
  return {
    html: renderMagnetEmailHtml("ebook", content),
    text: renderMagnetEmailText(content),
  };
}

async function loadPdfBase64(): Promise<string | null> {
  try {
    const abs = path.join(process.cwd(), EBOOK_PDF_PATH);
    const buf = await readFile(abs);
    return buf.toString("base64");
  } catch (err) {
    console.warn("[ebook] PDF not readable:", (err as Error).message);
    return null;
  }
}

/**
 * Best-effort HubSpot upsert.
 *
 * Tries the write with the full property set; if HubSpot rejects with a
 * 400 that mentions `lead_source` / `lead_magnet` (i.e. the two-level
 * tagging properties haven't been created in the portal yet), the
 * problematic keys are stripped and the write is retried. Lead capture
 * keeps flowing while the portal admin creates the properties.
 *
 * We do NOT retry on generic 400s — only when a missing custom property
 * is the culprit — so real validation errors still surface.
 */
async function hsCreateOrUpdate({
  email,
  properties,
  headers,
}: {
  email: string;
  properties: Record<string, string>;
  headers: Record<string, string>;
}): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  const attempt = async (
    props: Record<string, string>,
  ): Promise<{
    status: number;
    text: string;
    contactId?: string;
  }> => {
    const create = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ properties: props }),
    });
    if (create.ok) {
      const j = (await create.json()) as { id: string };
      return { status: create.status, text: "", contactId: j.id };
    }
    if (create.status === 409) {
      const patch = await fetch(
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        { method: "PATCH", headers, body: JSON.stringify({ properties: props }) },
      );
      if (patch.ok) {
        const j = (await patch.json()) as { id: string };
        return { status: patch.status, text: "", contactId: j.id };
      }
      return { status: patch.status, text: await patch.text() };
    }
    return { status: create.status, text: await create.text() };
  };

  const first = await attempt(properties);
  if (first.contactId) return { ok: true, contactId: first.contactId };

  const missingProp = first.status === 400 && /lead_source|lead_magnet/i.test(first.text);
  if (missingProp) {
    console.warn(
      "[ebook] hubspot rejected lead_source/lead_magnet — retrying without them; create these two custom contact properties in HubSpot to enable two-level tagging.",
    );
    const { lead_source: _s, lead_magnet: _m, ...rest } = properties;
    void _s;
    void _m;
    const retry = await attempt(rest);
    if (retry.contactId) return { ok: true, contactId: retry.contactId };
    return { ok: false, reason: `hubspot retry: ${retry.status} ${retry.text}` };
  }

  return { ok: false, reason: `hubspot: ${first.status} ${first.text}` };
}

/**
 * HubSpot: upsert by email, then add to the E-Book list. Tags the contact
 * with a custom source string so Selmir can filter these leads in HubSpot
 * separately from the Rollenspiel-Leitfaden batch.
 */
async function pushHubspot({
  firstName,
  lastName,
  phone,
  email,
}: {
  firstName: string;
  /** Optional — the form field is not required; empty strings are skipped. */
  lastName: string;
  phone: string;
  email: string;
}): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };
  // See src/app/api/leitfaden/subscribe/route.ts for why we don't touch
  // hs_analytics_source_* here — the list membership itself is the source.
  const properties: Record<string, string> = {
    email,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Two-level origin tagging (custom contact properties created in
    // HubSpot Settings → Properties). Broad `lead_source` says WHERE
    // the lead came from; specific `lead_magnet` says WHAT they
    // downloaded. Together they replace the mis-tag on
    // `Record source detail` that used to leak the service-key name.
    // These are stripped on the retry below if HubSpot rejects them
    // (400), so lead capture keeps working while the properties are
    // still being created in the portal.
    lead_source: "Website",
    lead_magnet: "Fuehrungskraefte E-Book",
  };
  if (firstName) properties.firstname = firstName;
  if (lastName) properties.lastname = lastName;
  if (phone) properties.phone = phone;

  let contactId: string | undefined;
  const create = await hsCreateOrUpdate({ email, properties, headers });
  if (!create.ok) return { ok: false, reason: create.reason };
  contactId = create.contactId;

  if (contactId) {
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${EBOOK_HUBSPOT_LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn("[ebook] list add failed:", add.status, await add.text());
    }
  }
  return { ok: true, contactId };
}

/**
 * Append the lead to the shared "Meta Ads Leads" spreadsheet via the
 * same Apps Script router that serves the Rollenspiel-Leitfaden. The
 * script routes leads by `landingPage` — E-Book rows land in Sheet2
 * alongside the Rollenspiel rows, easy to filter by column F.
 */
async function appendToSheet(row: {
  name: string;
  phone: string;
  email: string;
  pageUrl: string;
}): Promise<void> {
  if (!SHEET_URL) return;
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "ebook", // → E-Book tab
        name: row.name,
        phone: row.phone ? `'${row.phone}` : "",
        email: row.email,
        landingPage: EBOOK_SOURCE_LABEL,
        pageUrl: row.pageUrl,
      }),
    });
  } catch (err) {
    console.error("[ebook] sheet append failed:", (err as Error).message);
  }
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    lastName?: string;
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
  const lastName = (body.lastName ?? "").trim();
  const rawPhone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").trim();
  const pageUrl = (body.pageUrl ?? "").trim();

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
  // successful verify (any form) skips Twilio entirely. Server re-checks
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
    // Path B — fresh Twilio Verify check on the 6-digit code that
    // /api/leitfaden/phone/send-code just sent to the user's phone.
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
      console.warn("[ebook] twilio check failed:", twilio.reason);
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
  const downloadUrl = `${origin.replace(/\/$/, "")}${EBOOK_PDF_URL}`;

  const hs = await pushHubspot({ firstName, lastName, phone, email }).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  if (!hs.ok) console.warn("[ebook] hubspot failed:", hs.reason);

  void appendToSheet({
    // Display first + last together in the sheet's "Name" column when the
    // optional Nachname is present; otherwise fall back to Vorname alone.
    name: lastName ? `${firstName} ${lastName}` : firstName,
    phone,
    email,
    pageUrl,
  });

  if (!RESEND_KEY) {
    // No mail credentials — return ok anyway so the client shows success.
    // HubSpot workflow can pick up delivery once Ili configures it.
    return NextResponse.json(
      { ok: true, mailSkipped: "RESEND_API_KEY not set" },
      { status: 200 },
    );
  }
  const pdfBase64 = await loadPdfBase64();
  const resend = new Resend(RESEND_KEY);

  try {
    const { html, text } = buildUserEmail(firstName, downloadUrl);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      bcc: CC_TO,
      subject: EBOOK_EMAIL.subject,
      html,
      text,
      replyTo: magnetReplyTo(),
      attachments: pdfBase64
        ? [{ filename: EBOOK_PDF_FILENAME, content: pdfBase64 }]
        : undefined,
    });
    if (error) throw new Error(error.message ?? JSON.stringify(error));

    // Issue the "verified phone" cookie so this browser skips the SMS
    // step on future e-book / leitfaden submits — same 30-day cookie.
    const cookie = buildVerifiedCookie(phone);
    const jsonRes = NextResponse.json({
      ok: true,
      messageId: data?.id ?? null,
      hubspotContactId: hs.ok ? hs.contactId : null,
      attached: !!pdfBase64,
      // Not sensitive — same value the user typed. Client uses it to fire
      // a Lead event with the hashed email to Meta Pixel.
      email,
      // Extra copy the client shows on success — mirrors the hero eyebrow.
      copyEyebrow: EBOOK_HERO.eyebrow,
      verifiedPhone: phone,
    });
    if (cookie) jsonRes.headers.set("Set-Cookie", cookie.header);
    return jsonRes;
  } catch (err) {
    console.error("[ebook] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
