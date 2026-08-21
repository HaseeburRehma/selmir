/**
 * Google Business Profile reviews — SH-Wachstumsgesellschaft mbH
 *
 * Curated snapshot of the top-rated German-language reviews from
 * https://www.google.com/maps/place/SH-Wachstumsgesellschaft+mbH
 * (Profile owned by tylotech0@gmail.com — 4.9★ · 79 reviews at time of
 * scrape, 2026-08-20.)
 *
 * We hand-curate rather than live-fetch to:
 *   - stay under the Places API free tier (would need billing)
 *   - keep control over which quotes surface on the marketing site
 *   - avoid layout shift while Google's async data loads
 *
 * Update procedure when Selmir asks:
 *   1. Open https://www.google.com/maps/place/SH-Wachstumsgesellschaft+mbH?hl=de
 *   2. Click "Rezensionen" → scroll to find the new ones
 *   3. Append here, trim quote to ~2 short sentences (mobile-friendly),
 *      keep the reviewer's actual first name + last-name initial.
 */

export type GoogleReview = {
  /** Reviewer's display name as shown on Google. */
  name: string;
  /** Optional role/context — e.g. "Führungskraft im Vertrieb". */
  role?: string;
  /** Star rating, 1–5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Relative date as scraped (e.g. "vor 2 Monaten"). */
  date: string;
  /** German review quote — kept to ~2 short sentences. */
  quote: string;
};

/** Total review count on the Google profile — shown in the section header. */
export const GOOGLE_REVIEW_COUNT = 79;
/** Average rating on the Google profile. */
export const GOOGLE_REVIEW_AVERAGE = 4.9;

/**
 * Direct link to the SH-Wachstumsgesellschaft mbH profile on Google
 * Maps — used by the "Alle Rezensionen ansehen" CTA and the hero badge.
 */
export const GOOGLE_PROFILE_URL =
  "https://www.google.com/maps/place/SH-Wachstumsgesellschaft+mbH/@51.4369834,7.0000685,17z/data=!4m6!3m5!1s0x47b8c31674643b7d:0xb06c883fc60473b5!8m2!3d51.4369834!4d7.0000685?hl=de";

/**
 * Short search-based URL — safer for use in email/QR/print where the
 * long maps URL could break. Always shows the Business Profile card.
 */
export const GOOGLE_SEARCH_URL =
  "https://www.google.com/search?q=SH-Wachstumsgesellschaft+mbH+Essen&hl=de";

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: "Sal Sh.",
    role: "Führungskraft im Vertrieb",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Als Führungskraft im Vertrieb habe ich die Sales Mastery Days bewusst als Investment in mich selbst gebucht — und es hat sich mehr als gelohnt.",
  },
  {
    name: "Werbungmacher Team",
    role: "Werbeagentur",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Wir waren am vergangenen Wochenende bei den Sales Mastery Days in Düsseldorf und sind immer noch begeistert. Was uns besonders beeindruckt hat, war die unglaubliche Energie vor Ort.",
  },
  {
    name: "Majd Ramic",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Sales Mastery Days — absolut phänomenal! Ich war richtig gut vorbereitet und hatte jede Menge Fragen notiert — am Ende habe ich keine einzige davon gebraucht, weil einfach alles abgedeckt wurde.",
  },
  {
    name: "Damir Majdancic",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Ich war bisher auf zwei Events sowie beim Sellday von Selmir und konnte jedes Mal enorm viel für meinen Vertriebsalltag mitnehmen. Die Inhalte sind nicht nur motivierend, sondern vor allem direkt in der Praxis umsetzbar.",
  },
  {
    name: "B. H.",
    rating: 5,
    date: "vor einem Monat",
    quote:
      "Ich habe am Sales Mastery Day in Düsseldorf teilgenommen — mein Mindset hat sich wirklich verändert. Für ein Basic-Ticket haben wir in zwei Tagen so viel wertvolles Wissen auf authentische Weise vermittelt bekommen.",
  },
  {
    name: "Kathy M.",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Die Sales Mastery Days von Selmir Suljkanovic waren für uns eine äußerst wertvolle und inspirierende Veranstaltung.",
  },
  {
    name: "Abd-Alrhman Madhoon",
    rating: 5,
    date: "vor 2 Monaten",
    quote:
      "Zwei Tage Sales Mastery Days — für mich haben sich vor allem zwei Dinge gelohnt: der Blick auf den eigenen Kopf und die Menschen, die man dort trifft.",
  },
  {
    name: "Oguz Yildirim",
    rating: 5,
    date: "vor 2 Monaten",
    quote: "Best of the Man! 💪",
  },
];
