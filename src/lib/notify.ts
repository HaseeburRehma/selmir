import { Resend } from "resend";

/**
 * Transactional email for form notifications.
 *
 * Sends genuine German messages via Resend to both info@sh-wachstum.de and
 * info@tylotech.de — no third-party template preamble ("Hello, a new form has
 * been submitted…") like the Web3Forms free plan tacks on.
 *
 * Requires RESEND_API_KEY. Optional: NOTIFY_FROM (default:
 * "Sales Mastery Days <onboarding@resend.dev>"), NOTIFY_TO (comma-separated
 * override, default: info@sh-wachstum.de,info@tylotech.de).
 */

export type NotifyRow = { label: string; value: string };

export type NotifyPayload = {
  /** Subject line — starts with "Neue …-Anfrage von <Name>" */
  subject: string;
  /** German intro paragraph shown at the top of the email body. */
  intro: string;
  /** Ordered label/value pairs shown as a table. */
  rows: NotifyRow[];
  /** Optional: reply-to address so replies go to the sender directly. */
  replyTo?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.NOTIFY_FROM ??
  "Sales Mastery Days <onboarding@resend.dev>";
const TO = (
  process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de"
)
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

/** Renders a clean German HTML email. Table layout, no external CSS. */
function renderHtml({ intro, rows }: NotifyPayload): string {
  const cells = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;color:#666666;font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;vertical-align:top;width:190px;">${esc(r.label)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;color:#111111;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${esc(r.value).replace(/\n/g, "<br>")}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Neue Anfrage</title></head>
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
          <td style="padding:0 24px 20px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${esc(intro)}
          </td>
        </tr>
        <tr><td style="padding:0 24px 24px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eeeeee;border-radius:8px;border-collapse:separate;overflow:hidden;">
            ${cells}
          </table>
        </td></tr>
        <tr>
          <td style="padding:0 24px 24px 24px;font:12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#999999;">
            Diese Benachrichtigung wurde automatisch von selmir-suljkanovic.de gesendet.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Renders a plain-text fallback (for clients that don't render HTML). */
function renderText({ intro, rows }: NotifyPayload): string {
  const lines = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
  return `${intro}\n\n${lines}\n\n— selmir-suljkanovic.de`;
}

/**
 * Send the notification to every configured recipient.
 * Returns the array of Resend message ids (or throws on config error).
 */
export async function sendNotification(
  payload: NotifyPayload,
): Promise<{ ok: true; ids: string[] } | { ok: false; reason: string }> {
  if (!RESEND_KEY) {
    return { ok: false, reason: "RESEND_API_KEY not set" };
  }
  if (TO.length === 0) {
    return { ok: false, reason: "NOTIFY_TO is empty" };
  }

  const resend = new Resend(RESEND_KEY);
  const html = renderHtml(payload);
  const text = renderText(payload);

  // Resend delivers to multiple `to` addresses in a single API call; each
  // recipient still receives an individual email.
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: payload.subject,
    html,
    text,
    replyTo: payload.replyTo,
  });

  if (error) {
    throw new Error(`resend: ${error.message ?? JSON.stringify(error)}`);
  }
  return { ok: true, ids: data?.id ? [data.id] : [] };
}
