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
      {/* Near-black base (matches Figma). Section itself is already
          `bg-bg` (#090711). Purple glow parked on the LEFT side of the
          section (behind the copy column) per client feedback — softer
          than the previous right-side placement, so the surface reads
          black everywhere except where the ambient purple bleeds in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 65% at 18% 45%, rgba(116,84,243,0.32) 0%, rgba(76,46,180,0.18) 35%, rgba(9,7,17,0) 70%)",
        }}
      />
      {/* Faint grid — same subtle 96px lines Figma uses on the dark
          surface, ~10% opacity so it reads as texture, not decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.06) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0 1px, transparent 1px 96px)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-[minmax(0,640px)_minmax(0,600px)] lg:gap-[56px]">
          {/* Left — copy */}
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {/* Two-line headline on desktop: italic serif line 1,
                  bold sans line 2. Explicit `<br />` forces the break so
                  the column can be narrow (matching Figma) without the
                  headline collapsing into 4+ short lines. Mobile keeps
                  natural wrap. */}
              <h1 className="text-balance text-[34px] leading-[1.08] tracking-[-1px] text-white sm:text-[42px] md:text-[50px] lg:text-[56px] lg:leading-[1.06] lg:tracking-[-1.8px]">
                <span className="font-serif italic font-normal">
                  Struktur & Vertrieb
                </span>
                <br />
                <span className="font-body font-extrabold tracking-[-1.6px]">
                  für inhabergeführte Betriebe
                </span>
              </h1>
              <p className="font-serif italic text-[20px] leading-[1.3] tracking-[-0.4px] text-white/85 sm:text-[24px] md:text-[28px] lg:text-[30px]">
                Dein Betrieb läuft. Aber nur, wenn du selbst dranstehst.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="max-w-[600px] font-body text-[15px] leading-[1.65] text-white/70 md:text-[16.5px]">
                Wir helfen Inhabern & Führungskräften, ihren Vertrieb und ihre
                Struktur so aufzustellen, dass der Betrieb wächst – ohne dass
                sie noch mehr Stunden reinstecken. Klare Prozesse, planbare
                Zahlen, ein Betrieb, der auch ohne dich funktioniert.
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
                href="/ueber"
                variant="secondary"
                icon={<ArrowRight className="size-4 shrink-0 sm:size-5" />}
                className="whitespace-nowrap !px-4 !text-[11px] sm:!px-6 sm:!text-[13px]"
              >
                Über Selmir
              </Button>
            </div>
          </Reveal>

          {/* Right — portrait (transparent PNG). Sized to match the
              Figma proportions: portrait fills its column, torso &
              arms remain fully visible. A small (~18 %) bottom fade
              feathers only the very edge of the PNG into the purple
              background so the natural crop at his hands doesn't read
              as a hard line — nothing more aggressive than that. */}
          <Reveal
            delay={0.1}
            className="relative mx-auto w-full max-w-[440px] sm:max-w-[520px] lg:mx-0 lg:ml-auto lg:max-w-[620px]"
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/figma/home/selmir-hero.png"
                alt="Selmir Suljkanovic"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 520px, 620px"
                style={{ objectPosition: "center bottom" }}
                className="object-contain"
              />
              {/* Subtle bottom feather into the near-black section
                  background so the PNG's crop at his hands blends in
                  invisibly instead of reading as a hard edge. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%]"
                style={{
                  background:
                    "linear-gradient(to top, #090711 0%, rgba(9,7,17,0.55) 55%, rgba(9,7,17,0) 100%)",
                }}
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
