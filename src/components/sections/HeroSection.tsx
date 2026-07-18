import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { YouTubeLite } from "@/components/ui/YouTubeLite";

// Order matters: e.optimum directly next to Hörmann; Profina further back
const PARTNER_LOGOS = [
  "/figma/hero/logo-eoptimum.png", // e.optimum
  "/figma/hero/logo-3.png", // Hörmann
  "/figma/hero/logo-4.png", // Geerkens GmbH
  "/figma/hero/logo-5.png", // Pattberg
  "/figma/hero/logo-2.png", // Profina
  "/figma/hero/logo-6.png", // Jürgen Hohnen
];

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-bg pt-[96px]">
      {/* background + purple glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[703px] w-[520px] opacity-70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/hero/glow-1.svg" alt="" className="h-full w-full object-contain" />
        </div>
        <div className="absolute -top-24 -left-24 h-[703px] w-[420px] opacity-60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/hero/glow-2.svg" alt="" className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,618px)_minmax(0,1fr)] lg:gap-10">
        {/* LEFT: copy */}
        <div className="flex flex-col gap-12 md:gap-14">
          <div className="flex flex-col gap-6">
            <h1 className="text-[44px] leading-[1.2] tracking-[-1.5px] text-white sm:text-[56px] lg:text-[64px] lg:tracking-[-2.5px]">
              <span className="font-serif">Sales </span>
              <span className="font-display">Mastery Days</span>
              <span className="mt-3 block font-body text-[18px] font-semibold tracking-[0.5px] text-purple-2 sm:text-[22px] lg:text-[26px]">
                21.11 – 22.11.2026
              </span>
            </h1>
            <p className="max-w-[560px] font-serif text-[24px] leading-[1.2] tracking-[-0.5px] text-white sm:text-[28px] lg:text-[32px]">
              Das wichtigste Event im Jahr 2026 für Selbstständige und
              Unternehmer!
            </p>
            <div className="flex flex-col gap-3">
              <p className="font-display text-[20px] leading-[1.2] tracking-[-0.5px] text-white lg:text-[24px]">
                Zwei Tage, die deinen Vertrieb neu aufstellen.
              </p>
              <p className="max-w-[540px] font-body text-[16px] leading-[1.5] text-white/70">
                Live in Düsseldorf mit Selmir Suljkanovic. Keine Motivation – nur
                Systeme, Gesprächsstrukturen und Closing-Techniken, die ab Montag
                verkaufen.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="#tickets" icon={<ArrowUpRight className="size-5" />}>
              Ticket sichern
            </Button>
            <Button
              href="#event"
              variant="secondary"
              icon={<ArrowRight className="size-5" />}
            >
              Infos zum Event
            </Button>
          </div>
        </div>

        {/* RIGHT: video panel */}
        <div className="relative w-full rounded-2xl border border-purple-2/50 bg-purple-2/10 p-2.5">
          <YouTubeLite
            videoId="oNulnavbtTM"
            title="Sales Mastery Days — Selmir Suljkanovic"
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Trust / partner logo marquee */}
      <div className="container-page relative z-10 flex flex-col items-center gap-6 pb-16 pt-4">
        <p className="text-center font-label text-[18px] font-bold uppercase tracking-wide text-white lg:text-[20px]">
          Vertraut von führenden Unternehmen
        </p>
        <Marquee gap={88} className="max-w-full opacity-60">
          {PARTNER_LOGOS.map((src, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center px-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className={`w-auto object-contain ${
                  src.includes("eoptimum") ? "max-h-14" : "max-h-9"
                }`}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
