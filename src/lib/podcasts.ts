/**
 * Podcast appearances — Selmir Suljkanovic
 *
 * Curated from YouTube. Two buckets:
 *   • Als Gast — Selmir on other people's podcasts (external social proof)
 *   • CEON Unternehmer Podcast — Selmir's own show, he interviews guests
 *
 * BOTH lists are sorted newest-first (see the ISO date comment on
 * each row). When you add a new episode, insert it at the top of the
 * correct list to preserve the reverse-chronological order the /podcast
 * page renders.
 *
 * Playlist for CEON:
 *   https://www.youtube.com/playlist?list=PLs_1HqLccQU20alsvpE0QHl6Vmex8CpsA
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
   * Omit for solo topic episodes (Selmir on his own show, no guest).
   */
  counterpart?: string;
};

export const PODCASTS: PodcastEpisode[] = [
  /* ─────────── Als Gast (external shows) ─────────── */
  {
    // 2026-09-01 — newest
    id: "ccaBJffUv0s",
    title:
      "Mit 3.500 Euro Kredit zum Millionen-Business! Selmir Suljkanovic & Maurice Bork",
    show: "Maurice Bork",
    role: "guest",
    counterpart: "Maurice Bork",
  },
  {
    // 2026-08-16
    id: "x4BukHX8arA",
    title: "„ICH WOLLTE NICHT MEHR LEBEN“",
    show: "VALUE. Der Podcast für deinen Mehrwert",
    role: "guest",
    counterpart: "VALUE. Der Podcast",
  },
  {
    // 2026-08-02
    id: "m6UqSmqngSs",
    title: "Millionär packt aus — Es ist nicht schwer in Deutschland reich zu werden",
    show: "TALK N' SIP",
    role: "guest",
    counterpart: "Artur & Kamal",
  },
  {
    // 2026-07-23
    id: "O8NHAPc8F2A",
    title: "Über 100.000 € Provision im Monat — Als Verkäufer zum Millionär",
    show: "Timo Sven Bauer",
    role: "guest",
    counterpart: "Timo Sven Bauer",
  },
  {
    // 2026-04-30
    id: "rcU-fVERZL8",
    title: "Millionär: Ein Fensterputzer zerstört euch alle",
    show: "Ungefiltert on Fire",
    role: "guest",
    counterpart: "Ungefiltert on Fire",
  },
  {
    // 2026-04-23
    id: "NsLHfEpbApI",
    title:
      "Vom Flüchtlingsheim zum Einkommensmillionär — StartUp Stage, Kritik & Sales",
    show: "Burnic trifft Business",
    role: "guest",
    counterpart: "Burnic trifft Business",
  },
  {
    // 2026-02-01
    id: "Od8uJ5-W6q0",
    title: "40.000 € war ein schlechter Monat!",
    show: "Uncut Interviews",
    role: "guest",
    counterpart: "Uncut Interviews",
  },
  {
    // 2026-01-25
    id: "thGOCXEDq30",
    title: "Ich bin aus Jugoslawien geflohen!",
    show: "Uncut Interviews",
    role: "guest",
    counterpart: "Uncut Interviews",
  },
  {
    // 2026-01-02
    id: "59t89OOR5ew",
    title: "Als Angestellter zum Einkommensmillionär — Selmirs Weg",
    show: "Erfolg ist kein Zufall — Maurice Bork",
    role: "guest",
    counterpart: "Maurice Bork",
  },

  /* ─────────── CEON Unternehmer Podcast (Selmir hosts) ─────────── */
  {
    // 2026-08-01
    id: "IlPsAIpQD-E",
    title: "Dein Unternehmen ist nichts wert, wenn's nur durch dich läuft",
    show: "CEON Unternehmer Podcast",
    role: "host",
  },
  {
    // 2026-07-21
    id: "4Z7YZzOgKwo",
    title: "Vom Rapper zum Reaction-King mit Millionen Views",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Reaction-King",
  },
  {
    // 2026-07-08
    id: "M4G_SHA71Lc",
    title: "HalidTV macht Kaltakquise und Einwandbehandlung live im Podcast",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "HalidTV",
  },
  {
    // 2026-06-25
    id: "KIfrhPyYPNA",
    title:
      "Von 4 auf 18 Mio. € — wie ein SHK-Familienbetrieb seinen Umsatz vervierfachte",
    show: "CEON Unternehmer Podcast",
    role: "host",
  },
  {
    // 2026-06-06
    id: "vfmU6PmJ21A",
    title: "Vertrieb, Masse & PERSONAL BRAND",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Tolga Toker",
  },
  {
    // 2026-05-28
    id: "V1lVh-ox6fE",
    title: "Vitamin D, Trauma & KRANKHEITSSYSTEM",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Vitamin_D_King",
  },
  {
    // 2026-03-18
    id: "yac7LQXXhXU",
    title: "Frauen im Verkauf — zwischen Vorurteilen und Millionen",
    show: "CEON Unternehmer Podcast",
    role: "host",
  },
  {
    // 2025-09-21
    id: "57YwzI0Cosc",
    title: "3H's Burger Gründer zu Gast — Einblicke hinter die Kulissen",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Omar Afkir",
  },
  {
    // 2025-06-27
    id: "n0c0ca2dmEM",
    title: "Vom Traum zur Stadion-Werbung — So baute er Profina Deutschland auf",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Sejdin Sejdini",
  },
  {
    // 2025-06-04
    id: "2USfg7Pxodo",
    title: "Vom Donut-Imperium zur Croissant-Pizza-Revolution",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Enes Seker — Crusty Slices",
  },
  {
    // 2025-05-11
    id: "CgJf5DbCaX4",
    title: "HANDWERK, FACHKRÄFTEMANGEL & WACHSTUM IM SHK-BEREICH",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Jürgen Hohnen",
  },
  {
    // 2025-04-27
    id: "6FnEG4oXp4A",
    title:
      "Marco Huck von NICHTS zum MULTIMILLIONÄR — Straßenkämpfe, Fame & Business-Erfolg",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Marco Huck",
  },
  {
    // 2025-04-13
    id: "OKctKeWdpgI",
    title: "Vom Vater angeschossen — vom Boxsport zur Unternehmerin",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Rola El-Halabi",
  },
  {
    // 2025-03-21
    id: "00uMaUlUrz0",
    title: "KI WIRD DICH ERSETZEN — das Zeitalter der KI",
    show: "CEON Unternehmer Podcast",
    role: "host",
  },
  {
    // 2025-01-10
    id: "cZ43a_Mzp1Y",
    title: "Ex-Hells Angel enthüllt seinen Weg aus der Dunkelheit (Teil 2)",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Ex-Hells-Angel",
  },
  {
    // 2024-12-26
    id: "-RkGAe5NKJI",
    title: "Ex-Hells Angel packt aus — Hinter Gittern begann der Weg zum Erfolg (Teil 1)",
    show: "CEON Unternehmer Podcast",
    role: "host",
    counterpart: "Ex-Hells-Angel",
  },
];
