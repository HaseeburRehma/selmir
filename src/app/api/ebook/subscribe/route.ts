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
const FROM =
  process.env.NOTIFY_FROM ?? "Selmir Suljkanovic <noreply@sh-wachstum.de>";
const CC_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const SHEET_URL =
  process.env.EBOOK_SHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmailHtml({
  firstName,
  downloadUrl,
}: {
  firstName: string;
  downloadUrl: string;
}) {
  const greet = firstName ? `Hallo ${esc(firstName)},` : "Hallo,";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${esc(EBOOK_EMAIL.subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5ea;">
        <tr>
          <td style="padding:24px 24px 8px 24px;font:600 16px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#7454f3;letter-spacing:0.2px;">
            Selmir Suljkanovic
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 8px 24px;font:600 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111111;">
            ${esc(EBOOK_EMAIL.heading)}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px 4px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${greet}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 24px 8px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${esc(EBOOK_EMAIL.intro)}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 24px 8px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            Falls der Anhang bei dir gefiltert wurde, kannst du das E-Book auch hier laden:
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px 20px 24px;">
            <a href="${esc(downloadUrl)}" style="display:inline-block;background:#7454f3;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${esc(EBOOK_EMAIL.buttonLabel)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 20px 24px;font:14px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#555555;">
            ${esc(EBOOK_EMAIL.closingNote)}
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 24px 24px;font:14px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            Viel Erfolg,<br>
            <strong>Selmir Suljkanovic</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 24px 24px;font:12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#999999;">
            Diese Nachricht wurde automatisch von selmir-suljkanovic.de gesendet. Antworten landen direkt bei Selmir.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderEmailText({
  firstName,
  downloadUrl,
}: {
  firstName: string;
  downloadUrl: string;
}) {
  const greet = firstName ? `Hallo ${firstName},` : "Hallo,";
  return `${greet}

${EBOOK_EMAIL.intro}

Falls der Anhang bei dir gefiltert wurde, kannst du das E-Book hier laden:
${downloadUrl}

Viel Erfolg,
Selmir Suljkanovic

— selmir-suljkanovic.de`;
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
 * HubSpot: upsert by email, then add to the E-Book list. Tags the contact
 * with a custom source string so Selmir can filter these leads in HubSpot
 * separately from the Rollenspiel-Leitfaden batch.
 */
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
  // See src/app/api/leitfaden/subscribe/route.ts for why we don't touch
  // hs_analytics_source_* here — the list membership itself is the source.
  const properties: Record<string, string> = {
    email,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
  };
  if (firstName) properties.firstname = firstName;
  if (phone) properties.phone = phone;

  let contactId: string | undefined;
  const create = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ properties }),
  });
  if (create.ok) {
    const j = await create.json();
    contactId = j.id;
  } else if (create.status === 409) {
    const patch = await fetch(
      `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      { method: "PATCH", headers, body: JSON.stringify({ properties }) },
    );
    if (!patch.ok) {
      return {
        ok: false,
        reason: `hubspot patch: ${patch.status} ${await patch.text()}`,
      };
    }
    const j = await patch.json();
    contactId = j.id;
  } else {
    return {
      ok: false,
      reason: `hubspot create: ${create.status} ${await create.text()}`,
    };
  }

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
        formType: "leitfaden", // reuse router — Sheet2
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

  const hs = await pushHubspot({ firstName, phone, email }).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  if (!hs.ok) console.warn("[ebook] hubspot failed:", hs.reason);

  void appendToSheet({ name: firstName, phone, email, pageUrl });

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
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      bcc: CC_TO,
      subject: EBOOK_EMAIL.subject,
      html: renderEmailHtml({ firstName, downloadUrl }),
      text: renderEmailText({ firstName, downloadUrl }),
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
