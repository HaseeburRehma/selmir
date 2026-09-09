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
 *
 * v2 (2026-09-08) — de-duplicated per client Dev-Briefing:
 *   · Every "Reaktionszeit / wie schnell reagierst du" question is
 *     removed here (it's already Step 2's Reaktionszeit slot).
 *   · Every "depends-on-you" question is removed here (Step 3 F1
 *     "Läuft dein Vertrieb ohne dich?" is the single core version).
 *   · Coaching's second Abschlussquote is reframed to LTV — the
 *     slider in Step 2 already asked Abschlussquote.
 *   · Each industry now has ONE planbar/pipeline flavour question
 *     max, and each replacement is a genuinely industry-specific
 *     diagnostic — not a re-phrased duplicate.
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
      // Replaced the old "Läuft die Baustellenplanung ohne dich?"
      // (duplicate of Step-3 depends-on-you) with a capacity metric.
      key: "br_industry_q2",
      q: "Wie ausgelastet sind eure Kapazitäten / Kolonnen?",
      hint: "Auslastung der Ausführung",
      opts: [
        { label: "Fast immer voll ausgelastet" },
        { label: "Meistens gut, mit Puffer" },
        { label: "Immer wieder Leerlauf" },
      ],
    },
  ],
  Agentur: [
    {
      // Replaced the old "Bist du operativ in jedem Kundenprojekt drin?"
      // (duplicate of Step-3 depends-on-you) with a concentration-risk
      // question — a genuine agency-specific pain point.
      key: "br_industry_q1",
      q: "Wie stark hängt dein Umsatz von 1–2 Großkunden ab?",
      hint: "Konzentrationsrisiko im Kundenstamm",
      opts: [
        { label: "Breit gestreut, keiner > 20 %" },
        { label: "Ausgewogen, aber Top-Kunden dominieren" },
        { label: "Stark abhängig von 1–2 Kunden" },
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
      // Kept as the single planbar/pipeline question for Immobilien.
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
      // Replaced the old "Wie schnell reagiert ihr auf neue
      // Interessenten?" (duplicate of Step-2 Reaktionszeit) with a
      // process-length metric that captures deal-cycle efficiency.
      key: "br_industry_q2",
      q: "Wie lang ist eure Ø Zeit vom Erstgespräch bis Notartermin?",
      hint: "Dauer eines Deals",
      opts: [
        { label: "≤ 30 Tage" },
        { label: "1–3 Monate" },
        { label: "Länger / unplanbar" },
      ],
    },
  ],
  Coaching: [
    {
      // Kept as the single planbar/pipeline question for Coaching.
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
      // Replaced the old "Abschlussquote im Erstgespräch?" (duplicate
      // of Step-2 Abschlussquote slider) with LTV — non-overlapping
      // and a real coaching KPI.
      key: "br_industry_q2",
      q: "Wie hoch ist dein Ø Kundenwert (LTV)?",
      hint: "Umsatz pro Kunde über die gesamte Laufzeit",
      opts: [
        { label: "Hoch (> 10.000 €)" },
        { label: "Mittel (2.000 – 10.000 €)" },
        { label: "Niedrig (< 2.000 €)" },
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
      // Single planbar/pipeline question for IT.
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
      // Kept as the single planbar/pipeline question for the generic
      // fallback bucket.
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
      // Replaced the old "Wie schnell reagierst du auf neue Anfragen?"
      // (duplicate of Step-2 Reaktionszeit) with recurring-revenue
      // share — non-overlapping, works across most industries.
      key: "br_industry_q2",
      q: "Wie hoch ist dein Anteil an Wiederholungs-/Bestandskunden?",
      hint: "Recurring-Anteil im Umsatz",
      opts: [
        { label: "Hoch (> 50 %)" },
        { label: "Mittel" },
        { label: "Niedrig — überwiegend Neukunden" },
      ],
    },
  ],
};

/**
 * Branchen-spezifisches Wording für Step 1 Feld-Labels — Immobilien
 * z. B. sagt "Interessenten" statt "Anfragen", "Provision" statt
 * "Auftragswert". Nur Overrides listen; alles andere fällt auf die
 * generischen Labels zurück.
 *
 * `reaktionSub` overrides the sub-line under the Reaktionszeit card
 * so it matches the industry-specific heading — fixes the client-
 * flagged inconsistency where Immobilien said "Interessenten" in
 * the heading but still "Anfrage" in the sub-line.
 */
export const KEY_FIGURE_WORDING: Partial<
  Record<
    Industry,
    {
      anfragen?: string;
      auftrag?: string;
      reaktion?: string;
      reaktionSub?: string;
    }
  >
> = {
  Immobilien: {
    anfragen: "Interessenten pro Monat",
    auftrag: "Ø Provision pro Abschluss (€)",
    reaktion: "Reaktionszeit auf neue Interessenten",
    reaktionSub:
      "Wie schnell reagiert ihr, wenn sich ein neuer Interessent meldet?",
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

  // Step 1 — key figures. Wochenstunden dropped per v2 brief to
  // tighten the flow; field kept optional here so older callers still
  // typecheck.
  umsatz?: number;
  mitarbeiter?: number;
  anfragenMonat?: number;
  auftragWert?: number;
  abschlussquote: number; // 0-10 slider
  reaktionszeit: string; // one of REAKTIONSZEIT_OPTIONS labels
  wochenstunden?: number; // legacy; wizard no longer collects this

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
  /**
   * 6-digit Twilio Verify code the visitor typed after receiving the
   * SMS. Optional here because a returning visitor with a valid
   * `sh_pv` cookie skips the SMS dance entirely — the submit route
   * uses the cookie path in that case.
   */
  code?: string;

  // Attribution (optional; captured from URL when present)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUrl?: string;
}
