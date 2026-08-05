/**
 * "Talentiertes Team" — the people behind Selmir Suljkanovic.
 *
 * Names, roles, bios and LinkedIn come from the client roster (MA TyloTech).
 * Photos live under /public/figma/team. Add or reorder members here; the
 * carousel and the hover-flip card adapt automatically.
 */
export type TeamMember = {
  /** Shown large on the card front (Days One). */
  name: string;
  /** Sub-line on the card front — the full job title. */
  role: string;
  /** Short heading revealed on hover. Falls back to `role`. */
  title?: string;
  /** Path under /public. */
  photo: string;
  /** true when the photo is a pre-composited card design (purple background
   *  baked in, same aspect as the card). Rendered full-bleed instead of
   *  scaled cut-out. */
  preComposited?: boolean;
  linkedin?: { url: string; handle: string };
  /** Paragraph revealed on hover. Members without a bio simply don't flip. */
  bio?: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Selmir Suljkanovic",
    role: "Geschäftsführer",
    photo: "/figma/team/selmir.png",
    linkedin: {
      url: "https://www.linkedin.com/in/selmir-suljkanovic-13a480235/",
      handle: "Selmir Suljkanovic",
    },
    bio: "Selmir Suljkanovic kam im Kindesalter als bosnischer Kriegsflüchtling ohne Besitz nach Deutschland, nur mit dem festen Willen, sich etwas aufzubauen. Heute ist er erfolgreicher Unternehmer, Mentor und Investor. Mit mehr als 13 Jahren Erfahrung im Vertrieb und einem Jahrzehnt in leitenden Managementpositionen hat er über 47 Vertriebsteams aufgebaut und in 33 Branchen messbare Ergebnisse erzielt.",
  },
  {
    name: "Vanessa Suljkanovic",
    role: "Head of Support",
    photo: "/figma/team/vanessa.png",
    preComposited: true,
    linkedin: {
      url: "https://www.linkedin.com/in/vanessa-suljkanovic-1532a52ab/",
      handle: "Vanessa Suljkanovic",
    },
    bio: "Vanessa hat einen Bachelor of Science in Management and Economics und ist als zentrale Ansprechpartnerin für Recruiting, internes wie externes Relationship Management sowie Prozess- und Eventmanagement verantwortlich. Sie bündelt ihr Know-how, um Kunden und Kollegen professionell zu betreuen und einen reibungslosen Ablauf im Unternehmen sicherzustellen.",
  },
  {
    name: "Andre Wilhelm",
    role: "Wachstumsmanager",
    photo: "/figma/team/andre.png",
    linkedin: {
      url: "https://www.linkedin.com/in/andre-wilhelm-6a2788303/",
      handle: "Andre Wilhelm",
    },
    bio: "Andre ist seit über sechs Jahren im Vertrieb tätig und verfügt über Erfahrung in den Bereichen Energie, Photovoltaik und Wärmepumpen, Telekommunikation und Finanzberatung – sowohl im B2B- als auch im B2C-Vertrieb. Dabei erzielte er im Bereich Photovoltaik und Wärmepumpen in weniger als sechs Monaten einen höheren siebenstelligen Umsatz.",
  },
  {
    name: "Fernando Ferreira",
    role: "Wachstumsmanager",
    photo: "/figma/team/fernando.png",
    bio: "Fernando bringt über 10 Jahre Vertriebserfahrung mit, vom Direktvertrieb bis zu Spitzenpositionen im hochpreisigen B2C- und B2B-Geschäft. Als Sales Operator in der Unternehmensberatung erzielte er eigenständig über zwei Jahre einen siebenstelligen Verkaufsumsatz. Zudem bringt er Erfahrung im KI-Vertrieb mit Fokus auf Geschäftsführer aus der Immobilienbranche mit.",
  },
  {
    name: "Mikail Turgut",
    role: "Wachstumsmanager",
    photo: "/figma/team/mikail.png",
    linkedin: {
      url: "https://www.linkedin.com/in/mikail-turgut-257990170/",
      handle: "Mikail Turgut",
    },
    bio: "Mikail bringt über drei Jahre Berufserfahrung in technischer Entwicklung, Consulting und Selbstständigkeit in den Bereichen Medizintechnik und Automotive mit. Im B2B-Vertrieb verbindet er technisches Verständnis mit wirtschaftlichem Denken und analytischer Arbeitsweise und berät Kunden präzise und lösungsorientiert.",
  },
  {
    name: "Aaliyah Hümmer",
    role: "Persönliche Assistenz Selmir Suljkanovic",
    title: "Persönliche Assistenz",
    photo: "/figma/team/aaliyah.png",
    preComposited: true,
    linkedin: {
      url: "https://www.linkedin.com/in/aaliyah-h%C3%BCmmer-531996274/",
      handle: "Aaliyah Hümmer",
    },
    bio: "Aaliyah hat einen dualen Bachelor of Arts im Personalmanagement mit Schwerpunkt Sales sowie Expertise in Grafik- und Objektdesign. Als persönliche Assistenz des Geschäftsführers setzt sie beides gezielt ein: Sie gestaltet die Marke aktiv mit und verantwortet die strategische Kommunikation.",
  },
  {
    name: "Juri Michalev",
    role: "Videograf",
    photo: "/figma/team/juri.png",
    linkedin: {
      url: "https://www.linkedin.com/in/juri-michalev-9aba54371/",
      handle: "Juri Michalev",
    },
    bio: "Juri verfügt über mehr als sieben Jahre Erfahrung in der professionellen Medienproduktion mit Fokus auf Social Media und Performance Marketing. Er entwickelt strategischen Content, der Aufmerksamkeit schafft, Reichweite steigert und die Marke nachhaltig stärkt.",
  },
];
