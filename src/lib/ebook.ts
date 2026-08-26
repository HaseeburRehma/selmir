/**
 * "Dein Vertrieb erreicht alle Ziele" — Führungskräfte e-book lead magnet.
 *
 * Copy pulled directly from Selmir's e-book PDF (cover + Bevor du anfängst
 * chapter). Mirrors the Rollenspiel-Leitfaden HERO shape 1:1 so the
 * /e-book page shares the same layout template as /leitfaden.
 */

export const EBOOK_SLUG = "/e-book";
export const EBOOK_PDF_PATH = "public/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";
export const EBOOK_PDF_URL = "/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";
export const EBOOK_PDF_FILENAME = "Dein-Vertrieb-erreicht-alle-Ziele.pdf";

/** HubSpot list — auto-created 2026-08-26 via /crm/v3/lists API as
 *  "E-Book – Führungskräfte". */
export const EBOOK_HUBSPOT_LIST_ID = "816";

/** Landingpage column value in the Google Sheet + source tag in HubSpot. */
export const EBOOK_SOURCE_LABEL = "E-Book Führungskräfte";

/** Copy — matches Selmir's e-book PDF cover + Bevor-du-anfängst intro. */
export const HERO = {
  eyebrow: "E-Book für Entscheider",
  headline: {
    line1: "Dein Vertrieb erreicht alle Ziele.",
    line2Serif: "Genau das ist",
    line2Display: "das Problem.",
  },
  lead:
    "Die 7 Führungsfehler, die Handwerksbetriebe, Agenturen, Immobilien- und IT-Unternehmen jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst. Sofort per E-Mail als PDF.",
  /** Small target-audience bullets (from page 1: "Für wen dieses E-Book
   *  geschrieben ist"). Rendered under the lead as compact ticks. */
  audienceBullets: [
    "Geschäftsführer & Inhaber von Handwerksbetrieben mit eigenem Vertriebsteam",
    "Agenturinhaber, die vom Empfehlungsgeschäft in den aktiven Vertrieb wollen",
    "Führungskräfte in Immobilienunternehmen mit Makler- oder Vertriebsmannschaften",
    "Geschäftsführer von IT-Unternehmen mit Sales-Teams aus Settern und Closern",
  ],
  formTag: {
    title: "E-Book (PDF)",
    subtitle: "16 Seiten · Vertriebsführung",
  },
  submitLabel: "E-Book kostenlos sichern",
  audience: "Für Vertriebsleiter & Geschäftsführer",
} as const;

/** Right-column PDF mockup cover text — mirrors the actual PDF cover. */
export const COVER = {
  eyebrow: "E-Book für Entscheider",
  titleSerif: "Dein Vertrieb",
  titleBreak: "erreicht alle",
  titleDisplay: "Ziele.",
  subtitleHigh: "Die 7 Führungsfehler",
  subtitleLow: "im Vertrieb",
  footerL: "Vertriebsführung",
  footerR: "16 Seiten",
} as const;

/** Email subject + body copy for the automated Resend send. */
export const EBOOK_EMAIL = {
  subject: "Dein E-Book: Dein Vertrieb erreicht alle Ziele",
  heading: "Dein E-Book ist da.",
  intro:
    "danke für dein Interesse — anbei das komplette E-Book „Dein Vertrieb erreicht alle Ziele“ als PDF. Die 7 Führungsfehler, die Handwerksbetriebe, Agenturen, Immobilien- und IT-Unternehmen jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst.",
  closingNote:
    "Lies das E-Book in 30 Minuten, markier dir die Werkzeuge, die zu deinem Team passen, und starte mit dem 30-Tage-Plan. Kein Motivationstext, kein Beratergeschwafel — nur die Führungshandwerks-Basics, die Vertriebsteams brauchen, um planbar zu liefern.",
  buttonLabel: "E-Book direkt herunterladen",
} as const;
