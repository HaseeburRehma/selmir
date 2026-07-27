/**
 * The 8 "Marketing Page" variants from the Figma file
 * (TyloTech Design File → "Marketing Page - 01" … "Marketing Page - 8").
 *
 * All eight share one section stack — only the hero angle changes, so each ad
 * campaign can point at the pain point it was written for. Everything below
 * the fold lives in `LANDING_CONTENT` and is rendered identically on all pages.
 */

export interface LandingHero {
  /** First half of the headline — set in Prata (serif). */
  headlineSerif: string;
  /** Second half — set in Days One (display), the emphasised punch. */
  headlineDisplay: string;
  /** Large serif line under the headline. */
  sub: string;
  /** Small supporting line above the CTA. */
  support: string;
}

export interface LandingPage {
  slug: string;
  /** Short internal name, also used for the <title>. */
  name: string;
  metaDescription: string;
  hero: LandingHero;
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "anfragen-ohne-auftraege",
    name: "Genug Anfragen. Zu wenig Aufträge.",
    metaDescription:
      "Dir fehlen keine Interessenten – dir fehlt der Vertrieb, der sie zu Aufträgen macht. Kostenlose Potenzialanalyse mit Selmir Suljkanovic.",
    hero: {
      headlineSerif: "Genug Anfragen.",
      headlineDisplay: "Zu wenig Aufträge.",
      sub: "Dir fehlen keine Interessenten – dir fehlt der Vertrieb, der sie zu Aufträgen macht.",
      support:
        "In einer kostenlosen Potenzialanalyse zeige ich dir, wo deine Abschlüsse verloren gehen.",
    },
  },
  {
    slug: "4-auf-18-millionen",
    name: "Von 4 auf 18 Millionen Euro",
    metaDescription:
      "Planbares Wachstum ist kein Zufall und kein Glück. Kostenlose Potenzialanalyse mit Selmir Suljkanovic.",
    hero: {
      headlineSerif: "Von 4 auf 18 Millionen Euro",
      headlineDisplay: "durch Struktur und Vertrieb.",
      sub: "Planbares Wachstum ist kein Zufall und kein Glück.",
      support:
        "In einer kostenlosen Potenzialanalyse zeige ich dir, welcher Hebel in deinem Betrieb steckt.",
    },
  },
  {
    slug: "alles-haengt-an-dir",
    name: "Dein Betrieb läuft – aber alles hängt an dir",
    metaDescription:
      "Chaos im Ablauf kostet dich Umsatz und Nerven. Wir finden die Struktur, die deinen Betrieb trägt – auch ohne dich.",
    hero: {
      headlineSerif: "Dein Betrieb läuft",
      headlineDisplay: "aber alles hängt an dir.",
      sub: "Chaos im Ablauf kostet dich Umsatz und Nerven.",
      support:
        "Wir finden die Struktur, die deinen Betrieb trägt – auch ohne dich.",
    },
  },
  {
    slug: "nur-du-verkaufst",
    name: "Der Laden läuft nur, wenn du selbst verkaufst",
    metaDescription:
      "Solange alles über dich läuft, ist Wachstum gedeckelt. Wir bauen den Weg, wie dein Betrieb auch ohne dich verkauft.",
    hero: {
      headlineSerif: "Der Laden läuft nur,",
      headlineDisplay: "wenn du selbst verkaufst?",
      sub: "Solange alles über dich läuft, ist Wachstum gedeckelt.",
      support: "Wir bauen den Weg, wie dein Betrieb auch ohne dich verkauft.",
    },
  },
  {
    slug: "ausgelastet-ohne-marge",
    name: "Ausgelastet – und trotzdem bleibt zu wenig",
    metaDescription:
      "Volle Auftragsbücher heißen nicht automatisch volle Kasse. Wir finden, wo deine Marge liegen bleibt.",
    hero: {
      headlineSerif: "Ausgelastet –",
      headlineDisplay: "und trotzdem bleibt am Monatsende zu wenig.",
      sub: "Volle Auftragsbücher heißen nicht automatisch volle Kasse.",
      support: "Wir finden, wo deine Marge liegen bleibt.",
    },
  },
  {
    slug: "werbung-ohne-ergebnis",
    name: "Schon Geld in Werbung verbrannt – ohne Ergebnis?",
    metaDescription:
      "Das Problem ist selten zu wenig Werbung. Es ist fehlende Struktur und ein Vertrieb, der nicht verkauft.",
    hero: {
      headlineSerif: "Schon Geld in Werbung verbrannt –",
      headlineDisplay: "ohne Ergebnis?",
      sub: "Das Problem ist selten zu wenig Werbung.",
      support:
        "Es ist fehlende Struktur und ein Vertrieb, der nicht verkauft. Ich zeige dir den Unterschied.",
    },
  },
  {
    slug: "branche-ist-anders",
    name: "„In meiner Branche ist das anders.“ – Ist es nicht.",
    metaDescription:
      "Ob SHK, Elektro oder Bau: Die Hebel für Wachstum sind dieselben. Ich zeige dir, wie ein Betrieb wie deiner planbar gewachsen ist.",
    hero: {
      headlineSerif: "„In meiner Branche ist das anders.“",
      headlineDisplay: "Ist es nicht.",
      sub: "Ob SHK, Elektro oder Bau: Die Hebel für Wachstum sind dieselben.",
      support:
        "Ich zeige dir, wie ein Betrieb wie deiner planbar gewachsen ist.",
    },
  },
  {
    slug: "unplanbare-auftraege",
    name: "Mal rennen sie dir die Bude ein, mal Funkstille",
    metaDescription:
      "Unplanbarer Auftragseingang macht jede Planung kaputt. Wir bauen dir einen planbaren, gleichmäßigen Zufluss.",
    hero: {
      headlineSerif: "Mal rennen sie dir die Bude ein,",
      headlineDisplay: "mal Funkstille.",
      sub: "Unplanbarer Auftragseingang macht jede Planung kaputt.",
      support: "Wir bauen dir einen planbaren, gleichmäßigen Zufluss.",
    },
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Shared content — identical across all eight pages                    */
/* ------------------------------------------------------------------ */

export const CTA_LABEL = "Kostenlose Potenzialanalyse sichern";
export const CTA_HREF = "#analyse";

export const TRUST_LINE =
  "Vertraut von Handwerksbetrieben aus SHK, Elektro, Bau & mehr.";

export const TRUST_LOGOS = [
  "/figma/hero/logo-5.png", // Pattberg
  "/figma/hero/logo-6.png", // Jürgen Hohnen
  "/figma/hero/logo-4.png", // Geerkens
  "/figma/hero/logo-2.png", // Profina
  "/figma/hero/logo-eoptimum.png", // e.optimum
  "/figma/hero/logo-3.png", // Hörmann
];

export const PROOF = {
  eyebrow: "Der Beweis",
  headlineSerif: "Von 4 auf 18 Millionen Euro",
  headlineDisplay: "in 2 Jahren.",
  body: "Gemeinsam mit einem Wärmepumpen-Betrieb haben wir den Vertrieb von Grund auf aufgebaut – ohne mehr Werbebudget, allein durch Struktur und Vertrieb. Das Ergebnis: eine Vervierfachung des Jahresumsatzes.",
  videoId: "KIfrhPyYPNA",
  caption: "Video: Hörmann-Podcast-Clip",
};

export const PROBLEMS = [
  {
    icon: "/figma/lp/problem-1.webp",
    quote: "„Ich habe genug Anfragen – aber zu viele werden nicht zu Aufträgen.“",
  },
  {
    icon: "/figma/lp/problem-2.webp",
    quote: "„Der Laden läuft nur, wenn ich selbst verkaufe.“",
  },
  {
    icon: "/figma/lp/problem-3.webp",
    quote: "„Wir sind ausgelastet, aber am Monatsende bleibt zu wenig übrig.“",
  },
  {
    icon: "/figma/lp/problem-4.webp",
    quote: "„Der Auftragseingang ist unplanbar – mal zu viel, mal Funkstille.“",
  },
  {
    icon: "/figma/lp/problem-5.webp",
    quote: "„Ich habe schon Geld in Werbung gesteckt – ohne echtes Ergebnis.“",
  },
  {
    icon: "/figma/lp/problem-6.webp",
    quote: "„Alles hängt an mir. Struktur? Fehlanzeige.“",
  },
];

export const SOLUTION = {
  eyebrow: "Die Lösung",
  headlineSerif: "Nicht mehr Werbung.",
  headlineDisplay: "Sondern ein System, das verkauft.",
  body: "Die meisten Handwerksbetriebe scheitern nicht an zu wenig Interesse, sondern daran, dass aus Interesse kein Auftrag wird und der Betrieb komplett am Inhaber hängt. Ich baue dir zwei Dinge: eine Vertriebsstruktur, die aus Anfragen planbar Aufträge macht – und Abläufe, die dein Betrieb auch ohne dich trägt.",
  cards: [
    {
      title: "Struktur",
      body: "Klare Abläufe, damit nicht alles an dir hängt.",
    },
    { title: "Vertrieb", body: "Aus Anfragen werden planbar Aufträge." },
    {
      title: "Planbarkeit",
      body: "Gleichmäßiger Auftragseingang statt Achterbahn.",
    },
  ],
};

export const STEPS = {
  eyebrow: "In 3 Schritten",
  headlineSerif: "So",
  headlineDisplay: "läuft’s ab",
  cards: [
    {
      title: "Schritt 1 – Potenzialanalyse",
      body: "Wir schauen gemeinsam auf deinen Betrieb und finden die 3 größten Hebel.",
    },
    {
      title: "Schritt 2 – Struktur & Vertrieb aufbauen",
      body: "Wir bauen die Prozesse, die aus Anfragen Aufträge machen.",
    },
    {
      title: "Schritt 3 – Planbar wachsen",
      body: "Dein Betrieb verkauft planbar – auch ohne dass alles an dir hängt.",
    },
  ],
};

export const AUDIENCE = {
  eyebrow: "Klartext",
  headlineSerif: "Für wen das",
  headlineDisplay: "gedacht ist.",
  fit: {
    title: "Für dich, wenn …",
    items: [
      "du einen Handwerksbetrieb führst und wirklich wachsen willst",
      "du genug hast vom Chaos und davon, dass alles an dir hängt",
      "du bereit bist, an Struktur und Vertrieb zu arbeiten",
    ],
  },
  noFit: {
    title: "Nicht für dich, wenn …",
    items: [
      "du einen schnellen Trick statt echter Veränderung suchst",
      "du nichts an deinen Abläufen ändern willst",
    ],
  },
};

export const ABOUT = {
  eyebrow: "Über Selmir",
  headlineSerif: "Wer ist",
  headlineDisplay: "Selmir Suljkanovic?",
  body: "Ich bin Selmir Suljkanovic. Ich helfe Handwerksbetrieben, mit Struktur und Vertrieb planbar zu wachsen – aus Anfragen echte Aufträge zu machen und einen Betrieb aufzubauen, der nicht mehr nur am Inhaber hängt.",
  image: "/figma/lp/selmir-about.webp",
  stats: [
    { value: "€247M", label: "247 Mio. € Umsatz verantwortet." },
    { value: "47 Sales Teams", label: "Über 47 Vertriebsteams aufgebaut." },
    { value: "33 Industries", label: "In 33 Branchen mit messbaren Ergebnissen." },
  ],
};

// The "6 Erfolgsgeschichten" video-carousel section was dropped from the
// landing pages — the four case studies below carry the proof instead. The
// carousel still runs on the main site (see StoriesSection).

export interface CaseStudy {
  /**
   * The section's single eyebrow — "Case Study — <company>", rendered
   * uppercase. The design has no second badge next to the headline.
   */
  eyebrow: string;
  headlineSerif: string;
  headlineDisplay: string;
  before: string;
  after: string;
  chart: {
    title: string;
    wordmark: string;
    stat: string;
    /** Two value labels on the curve, low → high. */
    marks: [string, string];
  };
  results: [string, string, string];
  /**
   * Team photos, in Figma order. The count drives the layout:
   * 1 → one 568×388 frame, 2 → two stacked full-width frames,
   * 4 → a 2×2 grid of 280×187.5 frames.
   */
  images: { src: string; alt: string }[];
  /** Video card under the chart — only the Hörmann study has one. */
  video?: { id: string; poster: string; title: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    eyebrow: "Case Study — ebork GmbH",
    headlineSerif: "Von 1,9 auf",
    headlineDisplay: "4,2 Millionen Euro",
    before:
      "Sieben Mitarbeiter in Kurzarbeit, zwei Fertighauskunden und 1,9 Millionen Euro Jahresumsatz. Kein Vertrieb, keine klare Unternehmensstruktur und keine Führung – jeder Mitarbeiter konnte machen, was er wollte.",
    after:
      "4,2 Millionen Euro Jahresumsatz und ein systematisierter Vertrieb in Setter-Closer-Struktur, der unabhängig vom Geschäftsführer für Umsatz sorgt. Ein Organigramm bildet alle Strukturen ab – ergänzt um Mitarbeitergespräche, Feedback und Führungskultur.",
    chart: {
      title: "Umsatzentwicklung ebork GmbH",
      wordmark: "ebork",
      stat: "4,2 Mio. Euro Umsatz",
      // The Figma card labels these guides "7,0 Mio." / "10 Mio." — those are
      // Geerkens' numbers left behind by a copy-paste and contradict this
      // card's own "4,2 Mio." stat. Kept as waypoints on ebork's 1,9 → 4,2
      // curve, which is what the other three cards do.
      marks: ["2,4 Mio.", "3,5 Mio."],
    },
    results: [
      "10 neue Fertighauskunden in zwölf Monaten",
      "Systematisierter Vertrieb in Setter-Closer-Struktur",
      "Von 7 auf 21 Mitarbeiter mit klarer Führung",
    ],
    images: [
      {
        src: "/figma/lp/cases/ebork.webp",
        alt: "Beratungsgespräch mit dem Vertriebsteam der ebork GmbH",
      },
    ],
  },
  {
    eyebrow: "Case Study — Geerkens GmbH",
    headlineSerif: "Von 7 auf",
    headlineDisplay: "10 Millionen Euro",
    before:
      "Keine Vertriebsabteilung – der Vertrieb wurde von Technikern übernommen, die vertrieblich nicht geführt wurden. Der Erfolg blieb dem Zufall überlassen, es gab kein KPI-Tracking und keinen Fokus auf Vertrieb. 7 Millionen Euro Jahresumsatz, 51 Mitarbeiter.",
    after:
      "Ein Vertriebsleiter und drei Verkäufer wurden eingestellt, ein klares Organigramm schafft eindeutige Verantwortlichkeiten und einen reibungslosen Ablauf zwischen Vertrieb und Betrieb. Der Fokus im Unternehmen liegt heute auf Vertrieb – bei 65 Mitarbeitern.",
    chart: {
      title: "Umsatzentwicklung Geerkens GmbH",
      wordmark: "Geerkens",
      stat: "10 Mio. Euro Umsatz",
      marks: ["8,1 Mio.", "9,2 Mio."],
    },
    results: [
      "Rekordmonat mit 1 Mio. Euro Umsatz",
      "Klares Organigramm mit klaren Verantwortlichkeiten",
      "Von 51 auf 65 Mitarbeiter gewachsen",
    ],
    images: [
      { src: "/figma/lp/cases/geerkens-1.webp", alt: "Vertriebsteam der Geerkens GmbH im Gespräch" },
      { src: "/figma/lp/cases/geerkens-2.webp", alt: "Workshop mit dem Vertriebsteam der Geerkens GmbH" },
      { src: "/figma/lp/cases/geerkens-3.webp", alt: "Beratung im Betrieb der Geerkens GmbH" },
      { src: "/figma/lp/cases/geerkens-4.webp", alt: "Team der Geerkens GmbH bei der Vertriebsschulung" },
    ],
  },
  {
    eyebrow: "Case Study — Jürgen Hohnen GmbH",
    headlineSerif: "Von 4,4 auf",
    headlineDisplay: "8,7 Millionen Euro",
    before:
      "4,4 Millionen Euro Jahresumsatz, den Vertrieb machte der Geschäftsführer selbst. Anfragen wurden sporadisch bearbeitet, es gab keine Vertriebsstruktur und eine Conversion von 15 %. Ohne Führung und Zielemanagement waren die Mitarbeiter demotiviert.",
    after:
      "8,7 Millionen Euro Jahresumsatz und ein Vertrieb in Setter-Closer-Struktur. Die Closing-Conversion stieg durch Skillverbesserung und einen psychologischen Leitfaden auf 60 %. Der Umsatz ist vom Geschäftsführer entkoppelt – er arbeitet heute am Unternehmen.",
    chart: {
      title: "Umsatzentwicklung Jürgen Hohnen GmbH",
      wordmark: "Hohnen",
      stat: "8,7 Mio. Euro Umsatz",
      marks: ["5,9 Mio.", "7,4 Mio."],
    },
    results: [
      "Closing-Conversion von 15 % auf 60 % gesteigert",
      "Vertriebsprozesse auf Schnelligkeit ausgelegt",
      "44 % mehr Mitarbeiter durch klaren Recruitingprozess",
    ],
    images: [
      { src: "/figma/lp/cases/hohnen-1.webp", alt: "Vertriebsteam der Jürgen Hohnen GmbH im Gespräch" },
      { src: "/figma/lp/cases/hohnen-2.webp", alt: "Schulung des Vertriebsteams der Jürgen Hohnen GmbH" },
      { src: "/figma/lp/cases/hohnen-3.webp", alt: "Beratung im Betrieb der Jürgen Hohnen GmbH" },
      { src: "/figma/lp/cases/hohnen-4.webp", alt: "Team der Jürgen Hohnen GmbH bei der Vertriebsarbeit" },
    ],
  },
  {
    eyebrow: "Case Study — Hörmann Haustechnik",
    headlineSerif: "Von 4 auf",
    headlineDisplay: "18 Millionen Euro",
    before:
      "4 Millionen Euro Jahresumsatz und kein echter Vertrieb – Techniker und Geschäftsführer bearbeiteten Anfragen nebenbei, oft blieben sie wochenlang liegen. Keine Vertriebsstruktur, kein Marketing, keine digitalen Prozesse. 30 Mitarbeiter, 30 Wärmepumpen im Jahr.",
    after:
      "18 Millionen Euro Jahresumsatz in 2025 und ein komplett digitaler Vertriebsprozess in Setter-Closer-Struktur: Anfragen werden am selben Tag bearbeitet, Kunden erhalten das Angebot vor Ort und unterschreiben direkt. 2026 liegt der Umsatz 55 % über Vorjahr.",
    chart: {
      title: "Umsatzentwicklung Hörmann Haustechnik",
      wordmark: "Hörmann",
      stat: "18 Mio. Euro Umsatz",
      marks: ["9,5 Mio.", "14,2 Mio."],
    },
    results: [
      "600 Wärmepumpen in 2025, 70 in der Spitzenwoche",
      "Angebotsprozess am selben Tag, komplett digital",
      "Von 30 auf 96 Mitarbeiter, 11 Verkäufer eingestellt",
    ],
    images: [
      { src: "/figma/lp/cases/hoermann-1.webp", alt: "Selmir Suljkanovic im Gespräch bei Hörmann Haustechnik" },
      { src: "/figma/lp/cases/hoermann-2.webp", alt: "Vertriebsgespräch bei Hörmann Haustechnik" },
    ],
    // "Von 4 auf 18 Millionen €" — the same clip "Der Beweis" opens with,
    // which is this study's own story.
    video: {
      id: PROOF.videoId,
      poster: "/figma/lp/cases/hoermann-video.webp",
      title: "Hörmann Haustechnik im Podcast",
    },
  },
];

export const OFFER = {
  eyebrow: "Kostenlose Vertriebs-Potenzialanalyse",
  headlineSerif: "In 30 Minuten",
  headlineDisplay: "die 3 größten Umsatzhebel",
  headlineSerifTail: "in deinem Betrieb.",
  body: "Trag dich ein – wir rufen dich an und schauen gemeinsam, wo in deinem Betrieb der meiste Umsatz liegen bleibt. Du gehst mit konkreten Hebeln raus, auch wenn wir danach nicht zusammenarbeiten.",
  assurances: [
    "Kostenlos & unverbindlich. Bringt dir das Gespräch nichts Konkretes, hast du 30 Minuten investiert – mehr nicht.",
    "Wir nehmen nur eine begrenzte Zahl an Analysen pro Woche an.",
  ],
  form: {
    title: "Jetzt Analyse anfordern",
    note: "Wir melden uns zeitnah telefonisch bei dir.",
    consent:
      "Mit dem Absenden stimmst du zu, dass wir dich telefonisch kontaktieren dürfen.",
    submit: "Jetzt Potenzialanalyse sichern",
  },
};

export const FAQS = [
  {
    q: "Was kostet die Analyse?",
    a: "Nichts. Die Potenzialanalyse ist komplett kostenlos und unverbindlich.",
  },
  {
    q: "Wie lange dauert das Gespräch?",
    a: "Rund 30 Minuten. Wir schauen auf deine Zahlen, deine Abläufe und deinen Vertrieb – und benennen die drei größten Hebel.",
  },
  {
    q: "Funktioniert das in meiner Branche?",
    a: "Ja. Ob SHK, Elektro, Bau oder Dach: Die Hebel im Vertrieb sind dieselben. Wir haben in 33 Branchen mit denselben Prinzipien gearbeitet.",
  },
  {
    q: "Ist das nur ein Verkaufsgespräch?",
    a: "Nein. Du bekommst konkrete Hebel für deinen Betrieb – auch dann, wenn wir danach nicht zusammenarbeiten.",
  },
];

// The Figma FAQ list carries a fifth entry ("Lohnt sich das Investment
// wirklich?") on a hidden layer — the published design shows four.

export const FINAL_CTA = {
  badge: "Kostenlose Potenzialanalyse",
  headlineTop: "Bereit, aus dem Engpass",
  headlineBottom: "auszubrechen?",
  body: "Trag dich ein – wir rufen dich an und finden gemeinsam die 3 größten Umsatzhebel in deinem Betrieb.",
  cta: "Jetzt Potenzialanalyse sichern",
};
