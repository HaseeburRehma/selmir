import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Leistungen — Womit wir dein Wachstum bauen"  (Figma node 3724:2875).
 *
 * Six services in a 2x3 grid (mobile: 1 col, tablet: 2, desktop: 3),
 * separated by thin dividers just like the Figma. Each card uses the
 * neon-glow icon exported from Figma sitting inside 3 concentric halo
 * rings — assets live in /figma/leistungen/.
 */

type Service = {
  icon: string;
  name: string;
  body: string;
};

const SERVICES: Service[] = [
  {
    icon: "/figma/leistungen/vertrieb.png",
    name: "Vertrieb",
    body:
      "Gesprächsstrukturen, Einwandbehandlung und Abschlusstechniken, die nicht vom Bauchgefühl abhängen, sondern vom System.",
  },
  {
    icon: "/figma/leistungen/persoenlichkeit.png",
    name: "Persönlichkeitsentwicklung",
    body:
      "Management und persönliche Entwicklung gehen Hand in Hand – hier arbeitest du an Haltung, Fokus und Führung.",
  },
  {
    icon: "/figma/leistungen/wachstum.png",
    name: "Wachstumsmentoring",
    body:
      "Dein Navigator in der Welt des systematisierten Erfolgs: begleitetes Wachstum vom Marketing bis zur Auslieferung.",
  },
  {
    icon: "/figma/leistungen/sales-academy.png",
    name: "Sales Academy",
    body:
      "Über 12 Jahre Management-Wissen als Programm für dich und deine Führungskräfte – strukturiert und wiederholbar.",
  },
  {
    icon: "/figma/leistungen/elite-club.png",
    name: "Elite Club",
    body:
      "Das Umfeld gewinnt immer. Ein Netzwerk aus Unternehmern, Vertrieblern und Machern, das dich weiterträgt.",
  },
  {
    icon: "/figma/leistungen/fuehrungsseminar.png",
    name: "Führungsseminar",
    body:
      "Klare Führung, strukturierte Prozesse: so entwickelst du nicht nur ein Business, sondern auch Menschen.",
  },
];

/** Icon well: concentric halo rings + the neon icon centered on top.
 *  The halos are pure CSS radial gradients so we don't need to ship
 *  the Figma SVG masks separately. */
function IconWell({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex h-[220px] w-full items-center justify-center sm:h-[240px] lg:h-[260px]">
      {/* Halo — outer / mid / inner */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-[220px] rounded-full border border-purple-2/[0.12] sm:size-[240px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute size-[160px] rounded-full border border-purple-2/[0.18] sm:size-[170px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute size-[110px] rounded-full bg-[radial-gradient(circle,rgba(116,84,243,0.18)_0%,rgba(116,84,243,0)_70%)]"
      />
      {/* Neon icon */}
      <div className="relative size-[130px] sm:size-[150px] lg:size-[170px]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="170px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function LeistungenSection() {
  return (
    <section
      id="leistungen"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-purple-1/15 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-purple-2/15 blur-[160px]"
      />

      <div className="container-page relative">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            <span
              aria-hidden
              className="h-[2px] w-10 rounded-full bg-purple-2"
            />
            Leistungen
          </span>
          <h2 className="max-w-[880px] font-serif text-[32px] leading-[1.15] tracking-[-1px] text-white md:text-[44px] lg:text-[52px] lg:tracking-[-1.6px]">
            Womit wir dein{" "}
            <span className="font-display">Wachstum bauen.</span>
          </h2>
          <p className="max-w-[720px] font-body text-[15.5px] leading-[1.6] text-white/60 md:text-[16.5px]">
            Vom ersten Gespräch bis zur Auslieferung: Programme, die Vertrieb,
            Führung und Prozesse zusammenbringen.
          </p>
        </Reveal>

        {/* Bordered card grid — dividers between rows/cols, matching Figma */}
        <div className="mt-14 overflow-hidden rounded-[8px] border border-white/[0.09] bg-white/[0.02] md:mt-16 lg:mt-[72px]">
          <div className="grid grid-cols-1 divide-y divide-white/[0.09] md:grid-cols-2 md:divide-x lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.name}
                delay={i * 0.05}
                className={
                  // Bottom border on all but the last row (mobile), plus col
                  // dividers via divide-x on md+ — grid handles the rest.
                  "flex h-full flex-col items-stretch " +
                  // Reapply top-border tint on wrapped cells (grid divide
                  // handles cols but rows need explicit borders on lg).
                  (i >= 3 ? "lg:border-t lg:border-white/[0.09] " : "") +
                  // The `divide-x` on md+ conflicts with lg grid rows; use
                  // manual left-border for the 4th/5th/6th cell on lg only.
                  (i % 3 !== 0 ? "lg:border-l lg:border-white/[0.09] " : "")
                }
              >
                <IconWell src={s.icon} alt={s.name} />
                <div className="flex flex-col gap-3.5 px-8 pb-10 pt-6 lg:px-10 lg:pb-12 lg:pt-8">
                  <h3 className="font-body text-[18px] font-semibold tracking-[-0.3px] text-white lg:text-[19px]">
                    {s.name}
                  </h3>
                  <p className="font-body text-[14.5px] leading-[1.6] tracking-[-0.15px] text-white/60 lg:text-[15px]">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
