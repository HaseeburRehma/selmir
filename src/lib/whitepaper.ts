/**
 * "Der Angebotsprozess für 2,1 Mio. € / Woche" — whitepaper lead
 * magnet. Same UX contract as /e-book (form → SMS verify → HubSpot
 * upsert + list add → Google Sheet → Resend PDF delivery) — this file
 * is the copy + config-only twin of `src/lib/ebook.ts`. Keeping the
 * per-magnet copy and IDs in one place lets us reuse the render layout
 * across future whitepapers without duplicating logic.
 */

export const WP_SLUG = "/whitepaper/angebotsprozess";
export const WP_PDF_PATH = "public/pdf/whitepaper-angebotsprozess.pdf";
export const WP_PDF_URL = "/pdf/whitepaper-angebotsprozess.pdf";
export const WP_PDF_FILENAME =
  "Whitepaper-Angebotsprozess-Selmir-Suljkanovic.pdf";

/** HubSpot list — auto-created 2026-09-07 via /crm/v3/lists API as
 *  "Whitepaper – Angebotsprozess". */
export const WP_HUBSPOT_LIST_ID = "823";

/** Landingpage column value in the Google Sheet + segment label. */
export const WP_SOURCE_LABEL = "Whitepaper Angebotsprozess";

/** Copy — from the mock the client shared. */
export const HERO = {
  eyebrow: "Whitepaper für Entscheider",
  headline: {
    // "Der Angebotsprozess, der 2,1 Mio. € Umsatz pro Woche macht."
    part1: "Der Angebotsprozess, der",
    // Highlighted number
    accent: "2,1 Mio. €",
    part2: "Umsatz pro Woche macht.",
  },
  lead:
    "Wie die Hörmann Haustechnik mit nur zwei Vertrieblern monatlich 33 Wärmepumpen verkauft – der komplette Angebotsprozess Schritt für Schritt. Von der Anfrage bis zum Abschluss in 3–5 Tagen. Sofort per E-Mail als PDF.",
  formTag: {
    title: "Whitepaper (PDF)",
    subtitle: "Systemvertrieb · Angebotsprozess",
  },
  submitLabel: "Whitepaper kostenlos sichern",
  audience: "Für Geschäftsführer & Vertriebsleiter",
} as const;

/** Right-column PDF mockup cover text. */
export const COVER = {
  eyebrow: "Whitepaper (PDF)",
  titleSerif: "Der Angebotsprozess für",
  titleDisplay: "2,1 Mio. € / Woche",
  subtitleHigh: "Effiziente Angebotsprozesse im",
  subtitleLow: "Systemvertrieb",
  footerL: "Systemvertrieb",
  footerR: "Live-Case Hörmann",
} as const;

/** Email subject + body copy for the automated Resend delivery. */
export const WP_EMAIL = {
  subject: "Dein Whitepaper: Der Angebotsprozess für 2,1 Mio. € / Woche",
  heading: "Dein Whitepaper ist da.",
  intro:
    "danke für dein Interesse — anbei das komplette Whitepaper „Der Angebotsprozess für 2,1 Mio. € / Woche“ als PDF. Der vollständige Angebotsprozess, mit dem die Hörmann Haustechnik mit nur zwei Vertrieblern monatlich 33 Wärmepumpen verkauft — Schritt für Schritt, von der Anfrage bis zum Abschluss in 3–5 Tagen.",
  closingNote:
    "Nimm dir 20 Minuten für den Live-Case, markier dir die Bausteine, die zu deinem Vertrieb passen, und übertrag den Prozess in dein eigenes Team. Kein Theorie-Baukasten — der reale Ablauf, den ein Handwerksbetrieb heute produktiv fährt.",
  buttonLabel: "Whitepaper direkt herunterladen",
} as const;
