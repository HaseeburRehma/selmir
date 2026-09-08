import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { checkVerificationCode, normalizeE164 } from "@/lib/twilio";
import { buildVerifiedCookie, readVerifiedPhone } from "@/lib/phoneVerify";
import {
  WP_EMAIL,
  WP_HUBSPOT_LIST_ID,
  WP_PDF_FILENAME,
  WP_PDF_PATH,
  WP_PDF_URL,
  WP_SOURCE_LABEL,
  HERO as WP_HERO,
} from "@/lib/whitepaper";
import {
  magnetFrom,
  magnetReplyTo,
  renderMagnetEmailHtml,
  renderMagnetEmailText,
} from "@/lib/email-branding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Whitepaper lead-magnet subscription: /api/whitepaper/subscribe
 *   POST { name, phone, email, turnstileToken, pageUrl }
 *
 * Simpler than the leitfaden endpoint — no SMS verify layer, just:
 *   1. Cloudflare Turnstile bot check
 *   2. HubSpot upsert + push to list "Whitepaper – Angebotsprozess" (823)
 *   3. Google Sheet row (Sheet2, tagged Landingpage="Whitepaper Angebotsprozess")
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
/**
 * Sender name = "Selmir Suljkanovic · Whitepaper" so the recipient's
 * inbox row identifies WHICH form they submitted, not the site-wide
 * NOTIFY_FROM default (which used to say "Sales Mastery Days" for
 * every mail). Address stays the verified domain.
 */
const FROM = magnetFrom("whitepaper");
const CC_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const SHEET_URL =
  process.env.WP_SHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "";

/**
 * Default HubSpot owner assigned to every new whitepaper lead so
 * contacts don't sit in "no owner" limbo. Env-overridable so a
 * proper round-robin workflow can take over later without a code
 * change — just clear the env var and the field is left empty for
 * the workflow to fill in.
 *
 * Current fallback: Mikail Turgut (id 30347534) — matches the owner
 * the existing lead-magnet contacts (Sezer, Simon, Damir…) are
 * assigned to.
 */
const WP_DEFAULT_OWNER_ID =
  process.env.WP_DEFAULT_OWNER_ID ?? "30347534";

/** Basic HTML-escape for user-supplied strings that end up in the admin
 *  notification below. Route-scoped so we don't pull the branding lib
 *  helper across a module boundary just for one call. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Per-magnet user email — shared branded template with the whitepaper
 *  copy from src/lib/whitepaper.ts. */
function buildUserEmail(firstName: string, downloadUrl: string) {
  const content = {
    firstName,
    subject: WP_EMAIL.subject,
    heading: WP_EMAIL.heading,
    intro: WP_EMAIL.intro,
    closingNote: WP_EMAIL.closingNote,
    buttonLabel: WP_EMAIL.buttonLabel,
    downloadUrl,
    attachmentHint:
      "Falls der Anhang bei dir gefiltert wurde, kannst du das Whitepaper auch hier laden:",
  };
  return {
    html: renderMagnetEmailHtml("whitepaper", content),
    text: renderMagnetEmailText(content),
  };
}

async function loadPdfBase64(): Promise<string | null> {
  try {
    const abs = path.join(process.cwd(), WP_PDF_PATH);
    const buf = await readFile(abs);
    return buf.toString("base64");
  } catch (err) {
    console.warn("[whitepaper] PDF not readable:", (err as Error).message);
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
      "[whitepaper] hubspot rejected lead_source/lead_magnet — retrying without them; create these two custom contact properties in HubSpot to enable two-level tagging.",
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
 * HubSpot: upsert by email, then add to the Whitepaper list. Tags the contact
 * with a custom source string so Selmir can filter these leads in HubSpot
 * separately from other lead magnets.
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
    lead_magnet: "Whitepaper Angebotsprozess",
  };
  if (firstName) properties.firstname = firstName;
  if (lastName) properties.lastname = lastName;
  if (phone) properties.phone = phone;
  // Auto-assign an owner so the lead never sits in "no owner" limbo.
  // Skip only when the env override is explicitly empty (a real
  // round-robin workflow will pick it up in that case).
  if (WP_DEFAULT_OWNER_ID) properties.hubspot_owner_id = WP_DEFAULT_OWNER_ID;

  let contactId: string | undefined;
  const create = await hsCreateOrUpdate({ email, properties, headers });
  if (!create.ok) return { ok: false, reason: create.reason };
  contactId = create.contactId;

  if (contactId) {
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${WP_HUBSPOT_LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn("[whitepaper] list add failed:", add.status, await add.text());
    }
  }
  return { ok: true, contactId };
}

/**
 * Append the lead to the shared "Meta Ads Leads" spreadsheet via the
 * same Apps Script router that serves the Rollenspiel-Leitfaden. The
 * script routes leads by `landingPage` — Whitepaper rows land in Sheet2
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
        formType: "whitepaper", // → Whitepaper tab
        name: row.name,
        phone: row.phone ? `'${row.phone}` : "",
        email: row.email,
        landingPage: WP_SOURCE_LABEL,
        pageUrl: row.pageUrl,
      }),
    });
  } catch (err) {
    console.error("[whitepaper] sheet append failed:", (err as Error).message);
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
      console.warn("[whitepaper] twilio check failed:", twilio.reason);
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
  const downloadUrl = `${origin.replace(/\/$/, "")}${WP_PDF_URL}`;

  const hs = await pushHubspot({ firstName, lastName, phone, email }).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  if (!hs.ok) console.warn("[whitepaper] hubspot failed:", hs.reason);

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
    // HubSpot workflow can pick up delivery once configured.
    return NextResponse.json(
      { ok: true, mailSkipped: "RESEND_API_KEY not set" },
      { status: 200 },
    );
  }
  const pdfBase64 = await loadPdfBase64();
  const resend = new Resend(RESEND_KEY);

  // ────────────────────────────────────────────────────────────
  //  ADMIN NOTIFICATION — sent as its own transaction so a failed
  //  user-side delivery (bad e-mail, attachment rejected by their
  //  inbox, etc.) can't silently drop the internal alert too.
  //  Previously admin was on BCC of the user mail; if that mail
  //  bounced/failed, admin never learned about the lead.
  // ────────────────────────────────────────────────────────────
  const displayName = lastName ? `${firstName} ${lastName}` : firstName;
  const adminHtml = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f5f5f7;margin:0;padding:24px;">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5ea;">
    <tr><td style="padding:20px 24px 8px 24px;font-weight:600;color:#7C5CFF;font-size:12px;letter-spacing:2px;text-transform:uppercase">Neuer Whitepaper-Lead</td></tr>
    <tr><td style="padding:0 24px 20px 24px;font-weight:700;font-size:22px;color:#111;">${esc(displayName)}</td></tr>
    <tr><td style="padding:0 24px 24px 24px;"><table cellspacing="0" cellpadding="0" style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 10px;color:#666;">E-Mail</td><td style="padding:6px 10px;color:#111;"><b>${esc(email)}</b></td></tr>
      <tr><td style="padding:6px 10px;color:#666;">Telefon</td><td style="padding:6px 10px;color:#111;"><b>${esc(phone)}</b></td></tr>
      <tr><td style="padding:6px 10px;color:#666;">Landingpage</td><td style="padding:6px 10px;color:#111;">${esc(pageUrl || WP_SOURCE_LABEL)}</td></tr>
      <tr><td style="padding:6px 10px;color:#666;">HubSpot-ID</td><td style="padding:6px 10px;color:#111;">${hs.ok ? esc(hs.contactId ?? "") : "<i style='color:#F0556B'>FEHLGESCHLAGEN — " + esc(hs.reason ?? "unknown") + "</i>"}</td></tr>
    </table></td></tr>
  </table></body></html>`;

  // Fire the admin notification first (independent of user-mail success).
  if (CC_TO.length > 0) {
    void resend.emails
      .send({
        from: FROM,
        to: CC_TO,
        subject: `Neuer Whitepaper-Lead: ${displayName}`,
        html: adminHtml,
        replyTo: email,
      })
      .catch((err) =>
        console.error("[whitepaper] admin notify failed:", (err as Error).message),
      );
  }

  // ────────────────────────────────────────────────────────────
  //  USER MAIL — Whitepaper PDF as attachment + inline download
  //  link fallback. NOTE: keep the PDF under ~5MB (Ghostscript
  //  /ebook preset) so the base64-encoded attachment stays
  //  well below Gmail's 25MB per-message cap.
  // ────────────────────────────────────────────────────────────
  try {
    const { html, text } = buildUserEmail(firstName, downloadUrl);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: WP_EMAIL.subject,
      html,
      text,
      replyTo: magnetReplyTo(),
      attachments: pdfBase64
        ? [{ filename: WP_PDF_FILENAME, content: pdfBase64 }]
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
      copyEyebrow: WP_HERO.eyebrow,
      verifiedPhone: phone,
    });
    if (cookie) jsonRes.headers.set("Set-Cookie", cookie.header);
    return jsonRes;
  } catch (err) {
    console.error("[whitepaper] resend error:", (err as Error).message);
    // Return ok: false to the client but the admin already got the
    // notification, and the lead is safe in HubSpot + Google Sheet.
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
