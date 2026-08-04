/**
 * "Talentiertes Team" — the people behind Selmir Suljkanovic.
 *
 * Content + photos are taken 1:1 from the Figma "Card - Hover Slider" section
 * (TyloTech Design File, node 3409:2325). Figma ships one fully-authored member
 * (Aaliyah, with LinkedIn + bio) plus a second real headshot whose name/role is
 * still a placeholder — fill `name`/`title`/`bio`/`linkedin` below to complete it,
 * and add more members by pushing onto this array.
 */
export type TeamMember = {
  /** Shown large on the card front (Days One). */
  name: string;
  /** Sub-line on the card front. */
  role: string;
  /** Short heading revealed on hover (the role without the "Selmir …" suffix). */
  title?: string;
  /** Path under /public. */
  photo: string;
  /** True when the photo is a transparent cut-out that sits on the purple card. */
  cutout?: boolean;
  linkedin?: { url: string; handle: string };
  /** Paragraph revealed on hover. Members without a bio simply don't flip. */
  bio?: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Aaliyah Hümme",
    role: "Persönliche Assistenz Selmir Suljkanovic",
    title: "Persönliche Assistenz",
    photo: "/figma/team/aaliyah-huemme.jpg",
    linkedin: {
      url: "https://www.linkedin.com/in/aaliyah-h%C3%BCmmer-531996274/",
      handle: "Aaliyah Hümmer",
    },
    bio: "Aaliyah hat einen dualen Bachelor of Arts im Personalmanagement mit Schwerpunkt Sales sowie Expertise in Grafik- und Objektdesign. Als persönliche Assistenz des Geschäftsführers setzt sie beides gezielt ein: Sie gestaltet die Marke aktiv mit und verantwortet die strategische Kommunikation.",
  },
  {
    // Real headshot from Figma — name/role/bio still to be confirmed.
    name: "Teammitglied",
    role: "Team Selmir Suljkanovic",
    photo: "/figma/team/team-mann.png",
    cutout: true,
  },
];
