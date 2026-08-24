/**
 * Podcast appearances — Selmir Suljkanovic
 *
 * Curated from YouTube 2026-08-20. Two buckets:
 *   • CEON Unternehmer Podcast — Selmir's own show, he interviews guests
 *   • Guest appearances — Selmir on other people's podcasts
 *
 * Update procedure: search YouTube for new episodes and append here.
 * Keep newest-first so the top of the page shows fresh content.
 */

export type PodcastRole = "host" | "guest";

export type PodcastEpisode = {
  /** YouTube video ID (11 chars). */
  id: string;
  /** Full episode title as shown on YouTube. */
  title: string;
  /** Name of the podcast show. */
  show: string;
  /** Who Selmir was on this episode: host of CEON or guest elsewhere. */
  role: PodcastRole;
  /**
   * The other person in the episode:
   *   role=host  → the guest Selmir interviewed
   *   role=guest → the host that interviewed Selmir
   */
  counterpart?: string;
};

export const PODCASTS: PodcastEpisode[] = [
  // Guest appearances first — external social proof beats self-hosted
  {
    id: "x4BukHX8arA",
    title: "„ICH WOLLTE NICHT MEHR LEBEN“",
    show: "VALUE. Der Podcast für deinen Mehrwert",
    role: "guest",
    counterpart: "VALUE. Der Podcast",
  },
  {
    id: "rcU-fVERZL8",
    title: "Millionär: Ein Fensterputzer zerstört euch alle",
    show: "Ungefiltert on Fire",
    role: "guest",
    counterpart: "Ungefiltert on Fire",
  },

  // CEON Unternehmer Podcast — Selmir hosts
  {
    id: "6FnEG4oXp4A",
    title: "Marco Huck von NICHTS zum MULTIMILLIONÄR — Straßenkämpfe, Fame & Business-Erfolg",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Marco Huck",
  },
  {
    id: "vfmU6PmJ21A",
    title: "Vertrieb, Masse & PERSONAL BRAND",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Tolga Toker",
  },
  {
    id: "V1lVh-ox6fE",
    title: "Vitamin D, Trauma & KRANKHEITSSYSTEM",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Vitamin_D_King",
  },
  {
    id: "4Z7YZzOgKwo",
    title: "Vom Rapper zum Reaction-King mit Millionen Views",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Reaction-King",
  },
  {
    id: "M4G_SHA71Lc",
    title: "HalidTV macht Kaltakquise und Einwandbehandlung live im Podcast",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "HalidTV",
  },
  {
    id: "CgJf5DbCaX4",
    title: "HANDWERK, FACHKRÄFTEMANGEL & WACHSTUM IM SHK-BEREICH",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Jürgen Hohnen",
  },
  {
    id: "57YwzI0Cosc",
    title: "3H's Burger Gründer zu Gast — Einblicke hinter die Kulissen",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Omar Afkir",
  },
  {
    id: "2USfg7Pxodo",
    title: "Vom Donut-Imperium zur Croissant-Pizza-Revolution",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Enes Seker — Crusty Slices",
  },
];
