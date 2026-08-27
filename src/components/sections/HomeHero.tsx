import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Homepage hero — "Erfolg durch Klarheit" (Figma node 3721:2862).
 *
 * Portrait is a transparent-background PNG downloaded from the Figma
 * design so it floats over the section without a rounded card border.
 * Buttons render in a single row on all viewports (no wrap).
 */

const PARTNER_LOGOS = [
  "/figma/hero/logo-eoptimum.png",
  "/figma/hero/logo-3.png",
  "/figma/hero/logo-4.png",
  "/figma/hero/logo-5.png",
  "/figma/hero/logo-2.png",
  "/figma/hero/logo-6.png",
];

export default function HomeHero() {
  return (
    <section
      id="home-hero"
      className="relative overflow-hidden bg-bg px-6 pb-16 pt-[120px] md:px-12 md:pb-24 md:pt-[160px] lg:px-[120px] lg:pt-[180px]"
    >
      {/* Radial vignette + faint grid + purple blooms */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 22%, rgba(116,84,243,0.30) 0%, rgba(37,20,72,0.55) 30%, rgba(15,10,28,0.85) 60%, #090711 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-16 h-[560px] w-[560px] rounded-full bg-purple-1/30 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-purple-2/25 blur-[150px]"
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-[minmax(0,620px)_minmax(0,540px)] lg:gap-[80px]">
          {/* Left — copy */}
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-[42px] leading-[1.05] tracking-[-1.5px] text-white sm:text-[56px] md:text-[68px] lg:text-[72px] lg:tracking-[-2.5px]">
                Erfolg durch{" "}
                <span className="font-display">Klarheit.</span>
              </h1>
              <p className="font-serif text-[22px] leading-[1.25] tracking-[-0.5px] text-white/85 sm:text-[26px] md:text-[30px] lg:text-[34px]">
                Strategien, die bewegen.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="flex items-center gap-3.5 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-10 rounded-full bg-purple-2"
                />
                Grenzen überwinden
              </span>
              <p className="max-w-[540px] font-body text-[15.5px] leading-[1.65] text-white/70 md:text-[17px]">
                Willkommen bei Selmir Suljkanovic — deinem Wegbereiter für
                systematisierten Vertrieb, klare Führung und ein Umfeld, das
                immer gewinnt. Von der ersten Struktur bis zur skalierten
                Vertriebsmannschaft: hier bekommst du Klarheit statt Chaos.
              </p>
            </div>

            {/* Buttons stay in one row on every viewport. Below 380px they
                shrink text/padding rather than wrap — no line-break either. */}
            <div className="flex flex-nowrap items-center gap-3 sm:gap-4">
              <Button
                href="/kontakt"
                icon={<ArrowUpRight className="size-4 shrink-0 sm:size-5" />}
                className="whitespace-nowrap !px-4 !text-[11px] sm:!px-6 sm:!text-[13px]"
              >
                Kontakt aufnehmen
              </Button>
              <Button
                href="#leistungen"
                variant="secondary"
                icon={<ArrowRight className="size-4 shrink-0 sm:size-5" />}
                className="whitespace-nowrap !px-4 !text-[11px] sm:!px-6 sm:!text-[13px]"
              >
                Über Selmir
              </Button>
            </div>
          </Reveal>

          {/* Right — floating portrait (transparent PNG, no card) */}
          <Reveal
            delay={0.1}
            className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] lg:mx-0 lg:ml-auto lg:max-w-[560px]"
          >
            {/* Soft purple glow behind the portrait */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-2/30 blur-[80px]"
            />
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/figma/home/selmir-hero.png"
                alt="Selmir Suljkanovic"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 440px, 560px"
                className="object-contain object-bottom"
              />
            </div>
          </Reveal>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-col items-center gap-6 md:mt-20">
          <p className="text-center font-label text-[13px] font-bold uppercase tracking-[2px] text-white/60 lg:text-[15px]">
            Vertraut von führenden Unternehmen
          </p>
          <Marquee gap={88} className="max-w-full opacity-60">
            {PARTNER_LOGOS.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex h-14 items-center justify-center px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="max-h-9 w-auto object-contain"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
