/**
 * "Dein Vertrieb erreicht alle Ziele" — Führungskräfte e-book lead magnet.
 *
 * Copy mirrors the Rollenspiel-Leitfaden HERO shape 1:1 so the /e-book
 * page can share the same layout template as /leitfaden.
 */

/** URL path visitors see. */
export const EBOOK_SLUG = "/e-book";

/** Where the PDF lives on disk (relative to project root). */
export const EBOOK_PDF_PATH = "public/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";

/** URL path the download link uses in the e-mail body. */
export const EBOOK_PDF_URL = "/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";

/** Filename shown in the mail attachment / download prompt. */
export const EBOOK_PDF_FILENAME = "Dein-Vertrieb-erreicht-alle-Ziele.pdf";

/** HubSpot list — auto-created 2026-08-26 as
 *  "E-Book – Führungskräfte" via /crm/v3/lists API. */
export const EBOOK_HUBSPOT_LIST_ID = "816";

/** Written to the Google Sheet's Landingpage column + tags the lead in HubSpot. */
export const EBOOK_SOURCE_LABEL = "E-Book Führungskräfte";

/** Copy — matches the mockup in Ili's dev-handover PDF. Mirrors the HERO
 *  shape of leitfaden.ts so the /e-book page uses the same layout. */
export const HERO = {
  eyebrow: "Kostenloses E-Book",
  headline: {
    line1: "Dein Vertrieb erreicht alle Ziele.",
    line2Serif: "Genau das ist",
    line2Display: "das Problem.",
  },
  lead:
    "Die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst. Sofort per E-Mail als PDF.",
  formTag: {
    title: "E-Book (PDF)",
    subtitle: "Für Führungskräfte im Vertrieb",
  },
  submitLabel: "E-Book kostenlos sichern",
  audience: "Für Vertriebsleiter & Geschäftsführer",
} as const;

/** Right-column PDF mockup cover text. */
export const COVER = {
  eyebrow: "Führung",
  titleSerif: "Dein Vertrieb",
  titleBreak: "erreicht alle",
  titleDisplay: "Ziele.",
  subtitleHigh: "Die 7 Führungsfehler",
  subtitleLow: "im Vertrieb",
  footerL: "E-Book",
  footerR: "16 Seiten",
} as const;

/** Email subject + body copy for the automated Resend send. */
export const EBOOK_EMAIL = {
  subject: "Dein E-Book: Dein Vertrieb erreicht alle Ziele",
  heading: "Dein E-Book ist da.",
  intro:
    "danke für dein Interesse — anbei das komplette E-Book „Dein Vertrieb erreicht alle Ziele“ als PDF. Die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst.",
  closingNote:
    "Lies das E-Book in 30 Minuten, markier dir die Werkzeuge, die zu deinem Team passen, und starte mit dem 30-Tage-Plan. Kein Bootcamp, kein Beratergeschwafel — nur die Führungshandwerks-Basics, die Vertriebsteams brauchen, um planbar zu liefern.",
  buttonLabel: "E-Book direkt herunterladen",
} as const;
