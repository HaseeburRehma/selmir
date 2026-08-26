/**
 * "Dein Vertrieb erreicht alle Ziele" — Führungskräfte e-book lead magnet.
 *
 * Same architecture as src/lib/leitfaden.ts. This file only carries the
 * copy + PDF path + delivery config; the actual page and API route
 * reuse the leitfaden pipeline (HubSpot upsert, Resend, Google Sheet).
 *
 * Client-side Meta Pixel `Lead` event fires on submit success. Server-side
 * CAPI is a follow-up (needs META_CAPI_ACCESS_TOKEN + pixel setup on the
 * Meta side — see comment in src/app/api/ebook/subscribe/route.ts).
 */

/** URL path visitors see. */
export const EBOOK_SLUG = "/e-book";

/** Where the PDF lives on disk (relative to project root). */
export const EBOOK_PDF_PATH = "public/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";

/** URL path the download link uses in the e-mail body. */
export const EBOOK_PDF_URL = "/ebook/dein-vertrieb-erreicht-alle-ziele.pdf";

/** Filename shown in the mail attachment / download prompt. */
export const EBOOK_PDF_FILENAME = "Dein-Vertrieb-erreicht-alle-Ziele.pdf";

/** HubSpot list — auto-created via /crm/v3/lists 2026-08-26 as
 *  "E-Book – Führungskräfte" (list_id 816). Change here if renamed. */
export const EBOOK_HUBSPOT_LIST_ID = "816";

/** Value written to the "Landing Page" column in the Google Sheet + the
 *  contact source tag used to tell these leads apart in HubSpot. */
export const EBOOK_SOURCE_LABEL = "E-Book Führungskräfte";

/** Copy — mirrors the mockup in the dev-handover PDF exactly. */
export const EBOOK_COPY = {
  eyebrow: "Kostenloses E-Book",
  headline: {
    line1Serif: "Dein Vertrieb erreicht alle Ziele.",
    line2Display: "Genau das ist das Problem.",
  },
  lead:
    "Die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst.",
  bullets: [
    "Warum dein Team seine Ziele verfehlt — und was du sofort daran ändern kannst.",
    "Die 7 typischen Führungsfehler im Vertrieb, die Unternehmern jedes Jahr Umsatz kosten.",
    "Konkrete Werkzeuge, um Struktur, Verantwortung und Ergebnisse zurück ins Team zu bringen.",
    "Ein 30-Tage-Plan, der bereits ab Woche 1 messbare Ergebnisse liefert.",
  ],
  submitLabel: "E-Book kostenlos sichern",
  footerNote: "Kein Spam. Jederzeit abbestellbar.",
} as const;

/** Email subject + body copy for the automated Resend fallback (until
 *  the HubSpot workflow is set up by Ili). */
export const EBOOK_EMAIL = {
  subject: "Dein E-Book: Dein Vertrieb erreicht alle Ziele",
  heading: "Dein E-Book ist da.",
  intro:
    "danke für dein Interesse — anbei das komplette E-Book „Dein Vertrieb erreicht alle Ziele“ als PDF. Die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten – und wie du sie in 30 Tagen abstellst.",
  closingNote:
    "Lies das E-Book in 30 Minuten, markier dir die Werkzeuge, die zu deinem Team passen, und starte mit dem 30-Tage-Plan. Kein Bootcamp, kein Beratergeschwafel — nur die Führungshandwerks-Basics, die Vertriebsteams brauchen, um planbar zu liefern.",
  buttonLabel: "E-Book direkt herunterladen",
} as const;
