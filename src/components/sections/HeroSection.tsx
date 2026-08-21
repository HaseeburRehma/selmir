import Image from "next/image";
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

          <div className="flex flex-col gap-7">
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

            {/* Gast Speaker badges */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {/* Noah's stage shot is too wide to read at 56px, so the badge
                  uses a head-and-shoulders crop of it. */}
              {[
                { name: "Tolga Toker", image: "/figma/speakers/tolga-toker.jpg" },
                {
                  name: "Noah Geerkens",
                  image: "/figma/speakers/noah-geerkens-avatar.jpg",
                },
                {
                  name: "Arafat Alves",
                  image: "/figma/speakers/arafat-alves-avatar.jpg",
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href="#gast-speaker"
                  className="group inline-flex w-fit items-center gap-4 rounded-full border border-purple-2/40 bg-white/[0.03] p-2 pr-7 transition-colors duration-300 hover:border-purple-2/70 hover:bg-white/[0.06]"
                >
                  <span className="relative block size-14 shrink-0 overflow-hidden rounded-full border border-white/15">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      priority
                      sizes="56px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-body text-[13px] italic tracking-[0.2px] text-white/55">
                      Gast Speaker
                    </span>
                    <span className="font-display text-[20px] leading-tight tracking-[-0.3px] text-white">
                      {s.name}
                    </span>
                  </span>
                </a>
              ))}

              {/* Google review badge — sits alongside the Gast Speaker
                  chips as a top-of-page trust signal. Jumps down to the
                  full Google Reviews section (4.9★ · 79 reviews). Cmd-click
                  opens the underlying Business Profile in a new tab, but
                  the primary path keeps the visitor on-page. */}
              <a
                href="#rezensionen"
                aria-label="4,9 Sterne bei 79 Google-Rezensionen — zu den Bewertungen springen"
                className="group inline-flex w-fit items-center gap-4 rounded-full border border-white/20 bg-white/[0.03] p-2 pr-7 transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.06]"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white">
                  {/* Official 4-color Google G — inline so it works offline
                      and never fights the design-system's dark palette. */}
                  <svg
                    aria-hidden
                    className="size-7"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="font-body text-[13px] italic tracking-[0.2px] text-white/55">
                    4,9 ★ auf Google
                  </span>
                  <span className="font-display text-[20px] leading-tight tracking-[-0.3px] text-white">
                    79 Rezensionen
                  </span>
                </span>
              </a>
            </div>
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
