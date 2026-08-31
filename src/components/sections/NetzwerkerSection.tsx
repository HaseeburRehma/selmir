import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import PortraitSlider from "@/components/ui/PortraitSlider";

/**
 * "Über Selmir Suljkanovic — Netzwerker aus Überzeugung"
 * (Figma node 3724:2976, updated per review comments).
 *
 * LEFT   Auto-rotating portrait slider — five real Selmir photos so the
 *        section doesn't sit on a single stage shot.
 * RIGHT  Eyebrow + serif+display heading, longer bio matching the
 *        Figma copy, three text-only stats (no card border/background —
 *        matches the design's clean three-column layout), and the
 *        purple-gradient "Lerne Selmir kennen" CTA.
 */

const PORTRAITS = [
  { src: "/figma/about/selmir-stage.jpg", alt: "Selmir Suljkanovic auf der Bühne" },
  { src: "/figma/about/selmir-portrait.jpg", alt: "Selmir Suljkanovic — Portrait" },
  { src: "/figma/about/interview.jpg", alt: "Selmir Suljkanovic im Interview" },
  { src: "/figma/about/aboutus.jpg", alt: "Selmir Suljkanovic mit dem Team" },
  { src: "/figma/about/hero-coffee.jpg", alt: "Selmir Suljkanovic im Gespräch" },
];

const STATS = [
  {
    value: "400 %",
    label:
      "Wachstum für Europas erfolgreichsten Verkaufstrainer – in 18 Monaten.",
  },
  {
    value: "12+ Jahre",
    label: "Erfahrung im oberen Management, Vertrieb und Teamaufbau.",
  },
  {
    value: "1 Prinzip",
    label: "Das Umfeld gewinnt immer – Netzwerk als Wachstumsmotor.",
  },
];

export default function NetzwerkerSection() {
  return (
    <section
      id="netzwerker"
      className="relative bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-purple-1/15 blur-[160px]"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,440px)_minmax(0,620px)] lg:gap-[80px]">
          {/* Left: rotating portrait */}
          <Reveal className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
            <PortraitSlider slides={PORTRAITS} />
          </Reveal>

          {/* Right: copy + stats */}
          <Reveal delay={0.1} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-10 rounded-full bg-purple-2"
                />
                Über Selmir Suljkanovic
              </span>
              <h2 className="text-[32px] leading-[1.1] tracking-[-1px] text-white md:text-[46px] lg:text-[54px] lg:tracking-[-1.8px]">
                <span className="font-serif italic font-normal">
                  Netzwerker aus
                </span>{" "}
                <span className="font-body font-extrabold tracking-[-1.6px]">
                  Überzeugung
                </span>
              </h2>

              <div className="mt-2 flex flex-col gap-4 font-body text-[15px] leading-[1.65] text-white/70 md:text-[16.5px]">
                <p>
                  Seine Reise begann in den Tiefen des Unmöglichen und führte
                  ihn schließlich zu den Höhen des Erfolgs.
                </p>
                <p>
                  Bekannt für seine klare Führung, strukturierte Prozesse und
                  die Fähigkeit, nicht nur ein Business, sondern auch Menschen
                  zu entwickeln, steht Selmir heute als dein Partner bereit,
                  um gemeinsam Grenzen zu verschieben.
                </p>
                <p>
                  Als Netzwerker aus Überzeugung weiß er: Das Umfeld gewinnt
                  immer.
                </p>
                <p>
                  Von Vertrieblern bis hin zu Coaches, die sich auf Mindset
                  und Verkaufspsychologie spezialisiert haben, vertrauen sie
                  alle auf Selmirs Expertise. Als angestellter Verkaufsleiter
                  ließ er den erfolgreichsten Verkaufstrainer Europas in nur
                  18 Monaten um 400 % wachsen.
                </p>
                <p>
                  Nun teilt er sein gesammeltes Wissen aus über 12 Jahren
                  Management mit dir und deinen Führungskräften.
                </p>
              </div>
            </div>

            {/* Text-only stat columns — matches Figma (no card border) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
              {STATS.map((s) => (
                <div key={s.value} className="flex flex-col gap-2">
                  <span className="font-body text-[26px] font-extrabold leading-none tracking-[-1px] text-white lg:text-[28px]">
                    {s.value}
                  </span>
                  <p className="font-body text-[13.5px] leading-[1.55] text-white/60 lg:text-[14px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="/kontakt"
                className="btn-gradient group inline-flex h-14 items-center justify-center gap-2.5 rounded-[10px] px-6 text-center text-black transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="font-body text-[14px] font-bold uppercase tracking-[0.6px]">
                  Lerne Selmir kennen
                </span>
                <CalendarDays className="size-[20px] opacity-90 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
