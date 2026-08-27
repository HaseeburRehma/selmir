import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Über Selmir Suljkanovic — Netzwerker aus Überzeugung"
 * (Figma node 3724:2976).
 *
 * Left: portrait / stage photo. Right: eyebrow + serif+display heading,
 * bio paragraph, three stats (400% / 12+ Jahre / 1 Prinzip), CTA to /ueber.
 */

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
          {/* Left: portrait */}
          <Reveal className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-purple-2/40 shadow-[0_40px_100px_-20px_rgba(112,77,255,0.42)]">
              <Image
                src="/figma/about/selmir-stage.jpg"
                alt="Selmir Suljkanovic auf der Bühne"
                fill
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover object-center"
              />
            </div>
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
              <h2 className="font-serif text-[32px] leading-[1.15] tracking-[-1px] text-white md:text-[46px] lg:text-[54px] lg:tracking-[-1.8px]">
                Netzwerker aus{" "}
                <span className="font-display">Überzeugung.</span>
              </h2>
              <p className="font-serif text-[19px] leading-[1.35] tracking-[-0.3px] text-white/85 md:text-[22px]">
                Seine Reise begann in den Tiefen des Unmöglichen und führte ihn
                schließlich zu den Höhen des Erfolgs.
              </p>
              <p className="max-w-[560px] font-body text-[15.5px] leading-[1.65] text-white/60 md:text-[16.5px]">
                Über zehn Jahre im oberen Management, mehr als 47 aufgebaute
                Vertriebsteams, 33 Branchen und über 247 Millionen Euro
                verantwortete Umsätze. Selmir hat den Weg vom Kriegsflüchtling
                zum Unternehmer nicht durch Motivation gefunden, sondern durch
                Struktur, Systeme und ein Umfeld, das ihn getragen hat. Dieses
                Umfeld gibt er heute weiter.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="flex flex-col gap-2 rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-5 lg:p-6"
                >
                  <span className="font-display text-[28px] leading-none tracking-[-1px] text-purple-2 lg:text-[32px]">
                    {s.value}
                  </span>
                  <p className="font-body text-[13px] leading-[1.5] text-white/55 lg:text-[13.5px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Button href="/ueber" icon={<ArrowUpRight className="size-5" />}>
                Mehr über Selmir
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
