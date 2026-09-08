/**
 * Per-magnet email branding.
 *
 * Every lead-magnet route sends a transactional email after the visitor
 * submits — and previously they all inherited the site-wide
 * NOTIFY_FROM=`Sales Mastery Days <noreply@sh-wachstum.de>` sender.
 * Recipients couldn't tell which form triggered the mail: an E-Book
 * download showed up as "Sales Mastery Days" in the inbox list.
 *
 * This module owns the per-magnet identity — sender name, accent color,
 * badge label — so the email header a recipient sees matches the form
 * they filled out. The template lives here too (`renderMagnetEmailHtml`)
 * so every magnet renders on the same clean base, differing only in the
 * colored top band + eyebrow label + heading + copy.
 *
 * Adding a new magnet: add an entry to MAGNET_BRANDING and its route
 * imports its own key. That's it — the renderer + sender helper adapt.
 */

const REPLY_TO_DEFAULT = "info@sh-wachstum.de";
const SENDER_ADDRESS = "noreply@sh-wachstum.de";

export type MagnetKey =
  | "ebook"
  | "leitfaden"
  | "whitepaper"
  | "betriebs-roentgen";

export type MagnetBranding = {
  /** Human-readable sender name shown in the recipient's inbox list. */
  senderName: string;
  /** Purple/violet accent used for the top band + CTA + eyebrow color. */
  accent: string;
  /** "E-Book", "Whitepaper", … — shown as an uppercase eyebrow chip. */
  badgeLabel: string;
  /** Fine-print line below the badge. */
  badgeSubtitle: string;
};

export const MAGNET_BRANDING: Record<MagnetKey, MagnetBranding> = {
  ebook: {
    senderName: "Selmir Suljkanovic · E-Book",
    accent: "#7454f3",
    badgeLabel: "E-BOOK · FÜHRUNGSKRÄFTE",
    badgeSubtitle: "16 Seiten · sofort per PDF",
  },
  leitfaden: {
    senderName: "Selmir Suljkanovic · Leitfaden",
    accent: "#7454f3",
    badgeLabel: "LEITFADEN · ROLLENSPIEL",
    badgeSubtitle: "Gesprächsleitfaden aus dem YouTube-Rollenspiel",
  },
  whitepaper: {
    senderName: "Selmir Suljkanovic · Whitepaper",
    accent: "#7454f3",
    badgeLabel: "WHITEPAPER · SYSTEMVERTRIEB",
    badgeSubtitle: "Live-Case Hörmann · Angebotsprozess",
  },
  "betriebs-roentgen": {
    senderName: "Selmir Suljkanovic · Betriebs-Röntgen",
    accent: "#7454f3",
    badgeLabel: "BETRIEBS-RÖNTGEN",
    badgeSubtitle: "Deine Anfrage ist eingegangen",
  },
};

/** Full RFC-5322 From header: `Display Name <address>`. */
export function magnetFrom(key: MagnetKey): string {
  return `${MAGNET_BRANDING[key].senderName} <${SENDER_ADDRESS}>`;
}

/** Reply-To — always Selmir's team inbox so replies land in a real inbox. */
export function magnetReplyTo(): string {
  return REPLY_TO_DEFAULT;
}

/* ------------------------------------------------------------------ */
/*  HTML renderer                                                      */
/* ------------------------------------------------------------------ */

/** Escape user-supplied strings so they can't break the surrounding HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type MagnetEmailContent = {
  firstName: string;
  subject: string;
  /** Big black headline at the top of the card. */
  heading: string;
  /** Opening paragraph (after "Hallo <name>,"). */
  intro: string;
  /** Second paragraph, sits under the download button. */
  closingNote: string;
  /** Button copy — for magnets that ship a downloadable file. */
  buttonLabel?: string;
  /** URL the button points at — omit both to skip the button. */
  downloadUrl?: string;
  /** Optional attachment-hint line above the button. Default matches every magnet. */
  attachmentHint?: string;
};

/**
 * Renders the branded email body. Same base card across every magnet;
 * only the top accent band + eyebrow badge + heading + copy vary.
 */
export function renderMagnetEmailHtml(
  key: MagnetKey,
  c: MagnetEmailContent,
): string {
  const brand = MAGNET_BRANDING[key];
  const greet = c.firstName ? `Hallo ${esc(c.firstName)},` : "Hallo,";
  const hint =
    c.attachmentHint ??
    (c.downloadUrl
      ? "Falls der Anhang bei dir gefiltert wurde, kannst du das PDF auch hier laden:"
      : "");

  const buttonBlock =
    c.downloadUrl && c.buttonLabel
      ? `
        <tr>
          <td style="padding:0 24px 4px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${esc(hint)}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px 20px 24px;">
            <a href="${esc(c.downloadUrl)}" style="display:inline-block;background:${brand.accent};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${esc(c.buttonLabel)}</a>
          </td>
        </tr>`
      : "";

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e5ea;box-shadow:0 4px 18px -6px rgba(15,10,28,0.08);">
        <!-- Colored accent band + eyebrow badge -->
        <tr>
          <td style="background:${brand.accent};padding:14px 24px;">
            <div style="font:700 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#ffffff;letter-spacing:1.6px;">
              ${esc(brand.badgeLabel)}
            </div>
            <div style="font:500 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:rgba(255,255,255,0.78);margin-top:3px;">
              ${esc(brand.badgeSubtitle)}
            </div>
          </td>
        </tr>
        <!-- Brand line -->
        <tr>
          <td style="padding:22px 24px 6px 24px;font:600 15px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${brand.accent};letter-spacing:0.2px;">
            Selmir Suljkanovic
          </td>
        </tr>
        <!-- Headline -->
        <tr>
          <td style="padding:0 24px 12px 24px;font:600 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111111;">
            ${esc(c.heading)}
          </td>
        </tr>
        <!-- Greeting -->
        <tr>
          <td style="padding:8px 24px 4px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${greet}
          </td>
        </tr>
        <!-- Intro paragraph -->
        <tr>
          <td style="padding:6px 24px 8px 24px;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            ${esc(c.intro)}
          </td>
        </tr>
        ${buttonBlock}
        <!-- Closing / secondary paragraph -->
        <tr>
          <td style="padding:0 24px 22px 24px;font:14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#555555;">
            ${esc(c.closingNote)}
          </td>
        </tr>
        <!-- Sign-off -->
        <tr>
          <td style="padding:0 24px 24px 24px;font:14px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#333333;">
            Viel Erfolg,<br>
            <strong>Selmir Suljkanovic</strong>
          </td>
        </tr>
        <!-- Fine print -->
        <tr>
          <td style="padding:0 24px 22px 24px;font:12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#999999;">
            Diese Nachricht wurde automatisch von selmir-suljkanovic.de gesendet. Antworten landen direkt bei Selmir.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Plain-text fallback — same content, no styling. */
export function renderMagnetEmailText(c: MagnetEmailContent): string {
  const greet = c.firstName ? `Hallo ${c.firstName},` : "Hallo,";
  const link = c.downloadUrl ? `\n\nDownload: ${c.downloadUrl}` : "";
  return `${greet}

${c.intro}${link}

${c.closingNote}

Viel Erfolg,
Selmir Suljkanovic

— selmir-suljkanovic.de`;
}
