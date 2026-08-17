import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { LEITFADEN } from "@/lib/leitfaden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead-magnet subscription: /api/leitfaden/subscribe
 *   POST { name, email }
 *
 * Fires three things in one request (all failures are logged, none block
 * each other):
 *  1. Upsert the contact in HubSpot with email + firstname + a source tag,
 *     then add them to list 793
 *     ("Lead Magnet - Rollenspiel Handwerks VS Agentur").
 *  2. Send the subscriber a German confirmation e-mail from Resend with
 *     the PDF attached (falls back to a signed download link if the PDF
 *     is missing from disk).
 *  3. CC the internal inboxes (info@sh-wachstum.de + info@tylotech.de) so
 *     the sales team sees every download.
 *
 * Requires env: HUBSPOT_TOKEN, RESEND_API_KEY.
 * Optional env: LEITFADEN_LIST_ID (default: 793),
 *               NOTIFY_FROM (default from src/lib/notify.ts),
 *               NOTIFY_TO   (default from src/lib/notify.ts).
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;
const LIST_ID = process.env.LEITFADEN_LIST_ID ?? "793";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.NOTIFY_FROM ?? "Sales Mastery Days <noreply@sh-wachstum.de>";
const CC_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** German HTML body, self-contained, no external CSS. */
function renderEmailHtml({
  firstName,
  downloadUrl,
}: {
  firstName: string;
  downloadUrl: string;
}) {
  const greet = firstName ? `Hallo ${esc(firstName)},` : "Hallo,";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Rollenspiel-Leitfaden</title></head>
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
            Dein Rollenspiel-Leitfaden ist da.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px 4px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${greet}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 24px 8px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            danke für dein Interesse — anbei der komplette Rollenspiel-Leitfaden als PDF. 10 Seiten, 6 Kapitel: Begrüßung, die richtigen Fragen, Einwandbehandlung und Abschluss. Alles direkt aus dem Rollenspiel-Video.
          </td>
        </tr>
        <tr>
          <td style="padding:8px 24px 8px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            Falls der Anhang bei dir gefiltert wurde, kannst du den Leitfaden auch hier laden:
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px 20px 24px;">
            <a href="${esc(downloadUrl)}" style="display:inline-block;background:#7454f3;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">PDF direkt herunterladen</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 20px 24px;font:14px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#555555;">
            Lies den Leitfaden in 20 Minuten, markier dir die Formulierungen und probier sie im nächsten Termin. Wenn du sie einmal spürst, wirst du sie nicht mehr weglegen.
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

danke für dein Interesse — anbei der komplette Rollenspiel-Leitfaden als PDF. 10 Seiten, 6 Kapitel: Begrüßung, die richtigen Fragen, Einwandbehandlung und Abschluss.

Falls der Anhang bei dir gefiltert wurde, kannst du den Leitfaden hier laden:
${downloadUrl}

Viel Erfolg,
Selmir Suljkanovic

— selmir-suljkanovic.de`;
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
  };
  if (firstName) properties.firstname = firstName;
  if (phone) properties.phone = phone;

  // Try create; on 409 (already exists) fall through to patch by email.
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
    // Update the existing contact keyed by email
    const patch = await fetch(
      `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(
        email,
      )}?idProperty=email`,
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

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }
  const firstName = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  // All three fields are required. Return the first offender so the client
  // can show a targeted error.
  if (!firstName) {
    return NextResponse.json(
      { ok: false, reason: "name is required" },
      { status: 400 },
    );
  }
  if (!phone) {
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

  // 2. Send the PDF e-mail via Resend.
  if (!RESEND_KEY) {
    return NextResponse.json(
      { ok: false, reason: "RESEND_API_KEY not set" },
      { status: 200 },
    );
  }
  const pdfBase64 = await loadPdfBase64();
  const resend = new Resend(RESEND_KEY);
  const html = renderEmailHtml({ firstName, downloadUrl });
  const text = renderEmailText({ firstName, downloadUrl });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      bcc: CC_TO,
      subject: "Dein Rollenspiel-Leitfaden (PDF)",
      html,
      text,
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
    return NextResponse.json({
      ok: true,
      messageId: data?.id ?? null,
      hubspotContactId: hs.ok ? hs.contactId : null,
      attached: !!pdfBase64,
    });
  } catch (err) {
    console.error("[leitfaden] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
