import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import {
  CTA_HREF,
  CTA_LABEL,
  TRUST_LINE,
  TRUST_LOGOS,
  type LandingHero,
} from "@/lib/landing-pages";

/**
 * Hero of the marketing landing pages.
 * Figma (1440): headline block 890 wide starting at y=183, 64/76 headline,
 * 32/38 sub, 16/19 support, 64px-high CTA, then the trust bar at y=704.
 */
export default function LpHero({ hero }: { hero: LandingHero }) {
  return (
    <section id="top" className="relative overflow-hidden bg-bg">
      {/* Backdrop: grid + purple beams, fading into the page background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#0b0817]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        <div className="absolute -top-32 left-[18%] h-[703px] w-[300px] -rotate-6 rounded-full bg-purple-1/25 blur-[110px]" />
        <div className="absolute -top-24 right-[12%] h-[703px] w-[240px] rotate-6 rounded-full bg-purple-2/20 blur-[120px]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[420px] -translate-x-1/2 rounded-full bg-purple-1/20 blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pt-[120px] text-center md:px-10 md:pt-[150px] lg:pt-[183px]">
        <h1 className="max-w-[890px] text-balance font-serif text-[34px] leading-[1.16] tracking-[-1px] text-white sm:text-[46px] md:text-[56px] lg:text-[64px] lg:leading-[76px] lg:tracking-[-2px]">
          {hero.headlineSerif}{" "}
          {/* The design always breaks between the serif setup and the
              display punch — keep them on their own lines from sm up. */}
          <span className="font-display sm:block">{hero.headlineDisplay}</span>
        </h1>

        <p className="mt-5 max-w-[890px] font-serif text-[20px] leading-[1.2] tracking-[-0.4px] text-white sm:text-[26px] md:text-[30px] lg:mt-6 lg:text-[32px] lg:leading-[38px]">
          {hero.sub}
        </p>

        <p className="mt-5 max-w-[720px] text-pretty font-body text-[14px] leading-[1.5] text-white/55 lg:mt-6 lg:text-[16px] lg:leading-[19px]">
          {hero.support}
        </p>

        <div className="mt-9 md:mt-11 lg:mt-12">
          <Button
            href={CTA_HREF}
            icon={<CalendarDays className="size-5" strokeWidth={2} />}
            className="!h-14 !px-6 !text-[12px] sm:!px-8 md:!h-16 md:!text-[14px]"
          >
            {CTA_LABEL}
          </Button>
        </div>
      </div>

      {/* Trust bar — Figma: label at y=704, 56px logo row at y=752 */}
      {/* No bottom padding — the next section's 140px top padding is the gap. */}
      <div className="relative z-10 flex flex-col items-center pb-4 pt-[72px] md:pt-24 lg:pb-0 lg:pt-[114px]">
        <p className="px-6 text-center font-label text-[13px] font-bold uppercase leading-[24px] tracking-[0.5px] text-white md:text-[16px]">
          {TRUST_LINE}
        </p>
        <Marquee gap={96} className="mt-5 max-w-full opacity-55 lg:mt-6">
          {TRUST_LOGOS.map((src) => (
            <div
              key={src}
              className="flex h-[56px] items-center justify-center px-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className={`w-auto object-contain ${
                  src.includes("eoptimum") ? "max-h-[42px]" : "max-h-[40px]"
                }`}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
