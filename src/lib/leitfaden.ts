/**
 * Content spec for the /leitfaden lead-magnet page
 * (Rollenspiel-Leitfaden — Handwerks vs. Agentur).
 *
 * Edit copy here; the page components read from these constants.
 * The physical PDF lives at /public/leitfaden/rollenspiel-leitfaden.pdf —
 * drop the client's final file at that path and everything else keeps working.
 */

import {
  Anchor,
  BadgeCheck,
  BarChart3,
  Calculator,
  Circle,
  DoorOpen,
  Euro,
  HelpCircle,
  Lightbulb,
  MessageCircleQuestion,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export const LEITFADEN = {
  /** PDF file the API attaches to the confirmation email. */
  pdfPath: "public/leitfaden/rollenspiel-leitfaden.pdf",
  /** Filename recipients see. */
  pdfFilename: "Rollenspiel-Leitfaden — Selmir Suljkanovic.pdf",
  /** Public URL of the PDF (also linked in the email as a backup download). */
  pdfUrl: "/leitfaden/rollenspiel-leitfaden.pdf",
};

/* ── Hero ────────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "Kostenloser Leitfaden",
  headline: {
    line1: "Der Verkaufsleitfaden",
    line2Serif: "aus dem",
    line2Display: "Rollenspiel-Video.",
  },
  lead:
    "Genau der Gesprächsleitfaden, den du im YouTube-Rollenspiel gesehen hast — Schritt für Schritt: Begrüßung, die richtigen Fragen, Einwandbehandlung und Abschluss. Trag dich ein und du bekommst die komplette PDF sofort per E-Mail.",
  formTag: {
    title: "Rollenspiel-Leitfaden (PDF)",
    subtitle: "Marketingagentur vs. Handwerksunternehmen",
  },
  video: {
    label: "Zum Video",
    href: "https://www.youtube.com/@selmirsuljkanovic",
  },
  submitLabel: "Leitfaden jetzt zuschicken",
  reassurance: "Deine Daten sind sicher. Kein Spam.",
  audience: "Für Handwerk & Agenturen",
  bookTitle: "Rollenspiel-Leitfaden:",
  bookSubtitle: "Marketingagentur vs. Handwerksunternehmen",
  bookMeta: { chapter: "Trainingsmaterial", pages: "10 Seiten" },
  bookBadge: "PDF · gratis",
} as const;

/* ── Trust bar ───────────────────────────────────────────────────────── */

export const TRUST_LOGOS = [
  { src: "/figma/hero/logo-1.png", alt: "Pattberg Maschinenbau" },
  { src: "/figma/hero/logo-2.png", alt: "Jürgen Hohnen GmbH" },
  { src: "/figma/hero/logo-3.png", alt: "prolina" },
  { src: "/figma/hero/logo-4.png", alt: "optimum" },
  { src: "/figma/hero/logo-5.png", alt: "Hörmann Haustechnik" },
  { src: "/figma/hero/logo-6.png", alt: "Wirtschaft TV" },
];

/* ── Section 1 · Was drin ist ────────────────────────────────────────── */

export const CHAPTERS: {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    n: "1",
    icon: DoorOpen,
    title: "Der richtige Einstieg",
    body:
      "Begrüßung, ein ehrliches Lob und die Erwartungshaltung sauber klären — so übernimmst du vom ersten Satz an die Führung im Gespräch.",
  },
  {
    n: "2",
    icon: MessageCircleQuestion,
    title: "Die richtigen Fragen",
    body:
      "Offene Fragen, die den echten Bedarf und die Wachstumsblockade deines Gegenübers aufdecken — statt Produktmerkmale herunterzubeten.",
  },
  {
    n: "3",
    icon: ShieldCheck,
    title: "Einwände souverän behandeln",
    body:
      "„Zu teuer“, „Ich muss das erst abklären“, „Gibt es eine Garantie?“ — fertige Antwortmuster, die den Einwand entkräften, bevor er dich ausbremst.",
  },
  {
    n: "4",
    icon: BadgeCheck,
    title: "Sauber zum Abschluss",
    body:
      "Die Alternativ-Abschlussfrage, der Umgang mit dem Preis und die Stille danach — wie du das Gespräch ruhig und konsequent zum Ja führst.",
  },
];

export const CHAPTERS_FOOTNOTE =
  "10 Seiten, 6 Kapitel — sofort per E-Mail, ohne Anruf und ohne Verkaufsgespräch.";

/* ── Section 2 · Einwandbehandlung ───────────────────────────────────── */

export const OBJECTIONS: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Anchor,
    title: "Die Ankertechnik",
    body:
      "Nimm mögliche Einwände vorweg, bevor der Kunde sie überhaupt ausspricht. Beim Abschluss nutzt du denselben Anker erneut.",
  },
  {
    icon: BarChart3,
    title: "„Hast du Referenzen?“",
    body:
      "Beweis-Einwände nie mit Behauptungen beantworten, immer mit einer konkreten Case: echter Name, echte Zahl, echter Zeitraum.",
  },
  {
    icon: Euro,
    title: "„Was kostet mich das?“",
    body:
      "Sprachmusterkennung: Ab diesem Moment heißt es im ganzen Gespräch konsequent Investition statt Kosten.",
  },
  {
    icon: Lightbulb,
    title: "„Gibt es eine Garantie?“",
    body:
      "Risikofrage in Chancenfrage drehen: Angenommen, es funktioniert wie bei den anderen 30 Kunden — was verändert sich dann?",
  },
  {
    icon: Calculator,
    title: "„Das ist mir zu teuer“",
    body:
      "Drei Schritte: Offenheit würdigen, Commitment-Analogie, und den Einwand live gemeinsam durchrechnen.",
  },
  {
    icon: Users,
    title: "„Ich muss das erst abklären“",
    body:
      "Die Risikoträger-Frage: Wer das unternehmerische Risiko trägt, darf die Entscheidung auch selbst treffen.",
  },
];

/* ── Section 3 · Abschlusstechnik ────────────────────────────────────── */

export const CLOSES: {
  tag: string;
  image: string;
  title: string;
  body: string;
}[] = [
  {
    tag: "Technik 01",
    image: "/figma/lp/cases/geerkens-1.webp",
    title: "Zwei Termine statt Ja oder Nein",
    body:
      "„Möchtest du zum Datum A oder zum Datum B starten?“ Nie eine offene Ja/Nein-Frage stellen — immer zwei positive Optionen zur Auswahl geben.",
  },
  {
    tag: "Technik 02",
    image: "/figma/lp/cases/geerkens-2.webp",
    title: "Preis nennen, dann schweigen",
    body:
      "„Der schweigt, der kauft.“ Die Stille nach der Preisnennung aushalten — und sie nicht nervös mit Erklärungen oder Rabatten füllen.",
  },
  {
    tag: "Technik 03",
    image: "/figma/lp/cases/geerkens-3.webp",
    title: "Commitment statt Vertrag",
    body:
      "„Wir setzen keinen Vertrag auf, sondern ein Commitment zwischen dir und mir.“ Persönlicher, weniger bedrohlich, emotional bindender.",
  },
];

/* ── Section · Download form ─────────────────────────────────────────── */

export const DOWNLOAD = {
  eyebrow: "Gratis Download",
  headline: {
    serif: "Den kompletten Leitfaden",
    display: "sofort per E-Mail.",
  },
  lead:
    "Trag dich ein — die PDF landet sofort in deinem Postfach. 10 Seiten, 6 Kapitel: Begrüßung, die richtigen Fragen, Einwandbehandlung und Abschluss.",
  bullets: [
    { icon: BadgeCheck, text: "Kostenlos und ohne Anruf. Kein Newsletter, keine Weitergabe deiner Daten an Dritte." },
    { icon: Circle,     text: "Sofort per E-Mail — du liest den Leitfaden in 20 Minuten." },
    { icon: HelpCircle, text: "Bereits über 30 begleitete Betriebe in Handwerk & Vertrieb." },
  ],
  form: {
    title: "PDF gratis sichern",
    subtitle: "Trag dich ein — die PDF landet sofort in deinem Postfach.",
    firstNameLabel: "Vorname",
    firstNamePlaceholder: "Max",
    emailLabel: "E-Mail",
    emailPlaceholder: "name@firma.de",
    submitLabel: "Leitfaden jetzt zuschicken",
    reassurance: "Deine Daten sind sicher. Kein Spam.",
  },
} as const;

/* ── About Selmir ────────────────────────────────────────────────────── */

export const ABOUT = {
  eyebrow: "Über Selmir",
  headline: { serif: "Wer ist", display: "Selmir Suljkanovic?" },
  body: [
    "Ich bin Selmir Suljkanovic. Seit über 15 Jahren baue ich Vertriebsstrukturen für Handwerks- und Industriebetriebe auf. Dieser Leitfaden ist genau das Gerüst, das ich selbst in Verkaufsgesprächen nutze.",
    "Die Formulierungen stammen aus über 10.000 echten Verkaufsgesprächen — kein Seminarwissen, sondern Praxis, die im Betrieb funktioniert.",
  ],
  cta: { label: "Leitfaden gratis sichern", href: "#download" },
  photo: "/figma/about/selmir-portrait.jpg",
};

/* ── Track record stats ──────────────────────────────────────────────── */

export const TRACK_RECORD = [
  { value: "30+", label: "begleitete Betriebe in Handwerk & Vertrieb" },
  { value: "€247M", label: "verantworteter Umsatz" },
  { value: "47", label: "aufgebaute Vertriebsteams" },
  { value: "33", label: "Branchen mit messbaren Ergebnissen" },
];

/* ── FAQ ─────────────────────────────────────────────────────────────── */

export const FAQ = [
  {
    q: "Was kostet der Leitfaden?",
    a: "Nichts. Die komplette PDF ist kostenlos — im Austausch nur eine gültige E-Mail-Adresse.",
  },
  {
    q: "Wie schnell bekomme ich die PDF?",
    a: "Innerhalb weniger Sekunden nach dem Absenden — automatisch per E-Mail, ohne Anruf und ohne Verkaufsgespräch.",
  },
  {
    q: "Ist das derselbe Leitfaden wie im Video?",
    a: "Ja. Wort für Wort dieselbe Systematik, die du im Rollenspiel gesehen hast — nur als Handout zum sofortigen Nachschlagen.",
  },
  {
    q: "Bekomme ich danach Werbeanrufe?",
    a: "Nein. Deine Nummer wird nicht abgefragt. Du bekommst gelegentlich eine E-Mail mit weiterem Vertriebs-Know-how; abmelden geht mit einem Klick.",
  },
];

/* ── Final CTA banner ────────────────────────────────────────────────── */

export const FINAL_CTA = {
  eyebrow: "Kostenloser Leitfaden",
  headline: {
    serif: "Hol dir den Leitfaden,",
    display: "den Top-Verkäufer nutzen.",
  },
  body:
    "Trag dich ein und der Leitfaden landet sekundenspäter in deinem Postfach.",
  submitLabel: "PDF jetzt gratis sichern",
} as const;
