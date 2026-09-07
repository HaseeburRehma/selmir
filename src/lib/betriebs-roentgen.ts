/**
 * Betriebs-Röntgen — shared question definitions and constants.
 *
 * The tool is a 5-step lead qualifier that replaces the old
 * "Potenzialanalyse" flow. It does NOT auto-generate a report;
 * everything the visitor answers is pushed to HubSpot and a human
 * analyst calls back.
 *
 * Question copy stays in German (users are German-speaking business
 * owners). Keep this file the single source of truth: the wizard
 * component reads it for rendering, and the submit route reads it
 * (via the `slug` + option `value`) to convert answer-indexes back
 * into their German label before writing to HubSpot.
 */

export type Industry =
  | "Handwerk"
  | "Agentur"
  | "Immobilien"
  | "Coaching"
  | "IT"
  | "Sonstiges";

export const INDUSTRIES: {
  id: Industry;
  label: string;
  icon: string; // emoji – matches the prototype
}[] = [
  { id: "Handwerk", label: "Handwerk", icon: "🔧" },
  { id: "Agentur", label: "Agentur", icon: "📈" },
  { id: "Immobilien", label: "Immobilien", icon: "🏢" },
  { id: "Coaching", label: "Coaching / Beratung", icon: "🎯" },
  { id: "IT", label: "IT / Software", icon: "💻" },
  { id: "Sonstiges", label: "Sonstiges", icon: "➕" },
];

export type Choice = {
  /** Persisted value written to HubSpot (German). */
  label: string;
};

export type Question = {
  /** Machine key — the property name in HubSpot. */
  key: string;
  /** Headline shown to the visitor. */
  q: string;
  /** One-line supporting hint below the headline. */
  hint: string;
  /** Options in display order (0..n). */
  opts: Choice[];
};

/**
 * Reaktionszeit lookup — used in Step 1's key-figures card so it can
 * be a compact radio-like list rather than a full opts card. Same
 * German labels the prototype used.
 */
export const REAKTIONSZEIT_OPTIONS: Choice[] = [
  { label: "Innerhalb von Minuten" },
  { label: "Am selben Tag" },
  { label: "Innerhalb von 2–3 Tagen" },
  { label: "Länger / unregelmäßig" },
];

/**
 * Core questions — asked to every visitor (Step 2).
 * All three de-duplicated per the client-changes brief.
 */
export const CORE_QUESTIONS: Question[] = [
  {
    key: "br_core_vertrieb",
    q: "Läuft dein Vertrieb ohne dich?",
    hint:
      "Werden neue Kunden auch gewonnen, wenn du im Urlaub bist? Oder hängt alles an dir?",
    opts: [
      { label: "Ja, komplett systematisch" },
      { label: "Teilweise – aber ich bin meist involviert" },
      { label: "Nein, läuft fast nur über mich" },
    ],
  },
  {
    key: "br_core_prozess",
    q: "Hast du einen definierten, wiederholbaren Vertriebsprozess?",
    hint: "Feste Schritte von Anfrage bis Abschluss – oder Bauchgefühl?",
    opts: [
      { label: "Ja, klar dokumentiert & wird gelebt" },
      { label: "So halb – im Kopf, nicht auf Papier" },
      { label: "Nein, jeder macht es anders" },
    ],
  },
  {
    key: "br_core_nachfassen",
    q: "Wie konsequent fasst ihr bei Interessenten nach?",
    hint: "Was passiert mit jemandem, der nicht sofort zusagt?",
    opts: [
      { label: "Automatisiert & konsequent" },
      { label: "Manuell, wenn wir dran denken" },
      { label: "Meist gar nicht" },
    ],
  },
];

/**
 * Industry-specific questions — ONLY the 2 for the picked industry
 * are shown (Step 3). Same 5 industries + Sonstiges fallback that
 * appear on Step 0.
 */
export const INDUSTRY_QUESTIONS: Record<Industry, Question[]> = {
  Handwerk: [
    {
      key: "br_industry_q1",
      q: "Wie schnell nach der Anfrage steht dein Angebot beim Kunden?",
      hint: "Zeit zwischen Anfrage und fertigem Angebot",
      opts: [
        { label: "Innerhalb von 24–48 h" },
        { label: "Innerhalb einer Woche" },
        { label: "Länger / schwankend" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Läuft die Baustellen-/Auftragsplanung ohne dich?",
      hint: "Disposition und Koordination",
      opts: [
        { label: "Ja, mein Team regelt das" },
        { label: "Teilweise" },
        { label: "Nein, ich plane fast alles selbst" },
      ],
    },
  ],
  Agentur: [
    {
      key: "br_industry_q1",
      q: "Bist du operativ in jedem Kundenprojekt drin?",
      hint: "Delegation der Umsetzung",
      opts: [
        { label: "Nein, Team liefert eigenständig" },
        { label: "Bei den großen schon" },
        { label: "Ja, überall" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Wie gut ist eure Kundenbindung / Retention?",
      hint: "Bleiben Kunden langfristig?",
      opts: [
        { label: "Sehr gut, lange Laufzeiten" },
        { label: "Durchwachsen" },
        { label: "Hohe Fluktuation" },
      ],
    },
  ],
  Immobilien: [
    {
      key: "br_industry_q1",
      q: "Wie systematisch läuft eure Objekt-Akquise?",
      hint: "Kommen neue Objekte planbar rein?",
      opts: [
        { label: "Systematisch & planbar" },
        { label: "Teils-teils" },
        { label: "Über Zufall / Beziehungen" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Wie schnell reagiert ihr auf neue Interessenten?",
      hint: "Reaktionsgeschwindigkeit",
      opts: [
        { label: "Sofort" },
        { label: "Am selben Tag" },
        { label: "Oft zu spät – Objekt schon weg" },
      ],
    },
  ],
  Coaching: [
    {
      key: "br_industry_q1",
      q: "Wie planbar füllst du deine Termine / Programme?",
      hint: "Auslastung",
      opts: [
        { label: "Planbar & voll" },
        { label: "Schwankend" },
        { label: "Immer wieder Löcher" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Wie hoch ist deine Abschlussquote im Erstgespräch?",
      hint: "Sales-Skill",
      opts: [
        { label: "Hoch (>40 %)" },
        { label: "Mittel" },
        { label: "Niedrig / unklar" },
      ],
    },
  ],
  IT: [
    {
      key: "br_industry_q1",
      q: "Wie hoch ist euer Anteil wiederkehrender Umsätze?",
      hint: "Recurring / Wartung",
      opts: [
        { label: "Hoch" },
        { label: "Mittel" },
        { label: "Niedrig" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Wie planbar kommen neue Projekte / Kunden rein?",
      hint: "Pipeline",
      opts: [
        { label: "Planbar" },
        { label: "Schwankend" },
        { label: "Reaktiv" },
      ],
    },
  ],
  Sonstiges: [
    {
      key: "br_industry_q1",
      q: "Wie planbar ist deine Auftragslage?",
      hint: "Pipeline",
      opts: [
        { label: "Planbar" },
        { label: "Schwankend" },
        { label: "Unsicher" },
      ],
    },
    {
      key: "br_industry_q2",
      q: "Wie schnell reagierst du auf neue Anfragen?",
      hint: "Reaktionszeit",
      opts: [
        { label: "Sofort / am selben Tag" },
        { label: "Nach ein paar Tagen" },
        { label: "Unregelmäßig" },
      ],
    },
  ],
};

/**
 * Branchen-spezifisches Wording für Step 1 Feld-Labels — Immobilien
 * z. B. sagt "Interessenten" statt "Anfragen", "Provision" statt
 * "Auftragswert". Nur Overrides listen; alles andere fällt auf die
 * generischen Labels zurück.
 */
export const KEY_FIGURE_WORDING: Partial<
  Record<Industry, { anfragen?: string; auftrag?: string; reaktion?: string }>
> = {
  Immobilien: {
    anfragen: "Interessenten pro Monat",
    auftrag: "Ø Provision pro Abschluss (€)",
    reaktion: "Reaktionszeit auf neue Interessenten",
  },
};

/** HubSpot list id the submit endpoint pushes contacts into. */
export const BR_HUBSPOT_LIST_ID = process.env.BR_HUBSPOT_LIST_ID ?? "822";

/**
 * Wire-format of the submit payload the wizard sends to the API.
 * `industryQ1` / `industryQ2` are labels (already converted from
 * the option index) — matches how HubSpot expects to store them.
 */
export interface BetriebsRoentgenSubmit {
  // Step 0
  industry: Industry;
  industryOther?: string;

  // Step 1 — key figures
  umsatz?: number;
  mitarbeiter?: number;
  anfragenMonat?: number;
  auftragWert?: number;
  abschlussquote: number; // 0-10 slider
  reaktionszeit: string; // one of REAKTIONSZEIT_OPTIONS labels
  wochenstunden: number; // 20-80 slider

  // Step 2 — core (three labels)
  coreVertrieb: string;
  coreProzess: string;
  coreNachfassen: string;

  // Step 3 — industry (two labels)
  industryQ1: string;
  industryQ2: string;

  // Step 4 — gate
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;

  // Attribution (optional; captured from URL when present)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUrl?: string;
}
