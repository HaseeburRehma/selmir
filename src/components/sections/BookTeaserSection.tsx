import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Homepage "Kostenloser Leitfaden" teaser  (Figma node 3737:3492).
 *
 * Two-column layout:
 *   LEFT   Physical book mockup — SEIN. TUN. HABEN. front cover with
 *          purple halo behind and floor shadow underneath. Spine
 *          gradient + gloss overlay make it read as a 3D book.
 *   RIGHT  Eyebrow, serif+display heading, body copy, purple-gradient
 *          "LERNE SELMIR KENNEN" CTA linking to /leitfaden.
 *
 * Whole section sits over a faint grid-image background at 50 % opacity
 * (same asset the Figma design uses).
 */

const LEITFADEN_HREF = "/leitfaden";

export default function BookTeaserSection() {
  return (
    <section
      id="leitfaden-teaser"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[140px]"
    >
      {/* Faint grid background — matches Figma image 1 at 50% opacity */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
        <Image
          src="/figma/leitfaden-teaser/bg-grid.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,440px)_minmax(0,640px)] lg:gap-[53px]">
          {/* LEFT — 3D book mockup */}
          <Reveal className="relative mx-auto flex w-full max-w-[340px] items-center justify-center lg:mx-0 lg:max-w-[440px]">
            <BookMockup />
          </Reveal>

          {/* RIGHT — copy + CTA */}
          <Reveal delay={0.1} className="flex flex-col gap-6 lg:gap-7">
            <span className="flex items-center gap-3.5 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
              <span
                aria-hidden
                className="h-[2px] w-10 rounded-full bg-purple-2"
              />
              Kostenloser Leitfaden
            </span>

            <h2 className="font-serif text-[36px] leading-[1.15] tracking-[-1.2px] text-white sm:text-[44px] md:text-[50px] lg:text-[50px] lg:leading-[1.18] lg:tracking-[-1.8px]">
              Der Verkaufsleitfaden
              <br />
              aus dem{" "}
              <span className="font-display">Rollenspiel-Video.</span>
            </h2>

            <p className="max-w-[600px] font-body text-[15.5px] leading-[1.5] tracking-[-0.2px] text-white/70 md:text-[17px] md:leading-[1.5]">
              Genau der Gesprächsleitfaden, den du im YouTube-Rollenspiel
              gesehen hast – Schritt für Schritt: Begrüßung, die richtigen
              Fragen, Einwandbehandlung und Abschluss. Trag dich ein und du
              bekommst die komplette PDF sofort per E-Mail.
            </p>

            <div>
              <Link
                href={LEITFADEN_HREF}
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

/**
 * The book mockup — front cover image + spine gradient + floor shadow +
 * purple halo, layered so the whole thing reads as a physical book
 * catching light from the top-right.
 */
function BookMockup() {
  return (
    <div className="relative aspect-[440/638] w-full">
      {/* Halo behind the book */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,137,255,0.35)_0%,rgba(116,84,243,0.14)_45%,rgba(10,8,18,0)_75%)] blur-[40px]"
      />

      {/* Floor shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] bottom-[2%] h-[8%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_65%)] blur-[10px]"
      />

      {/* Side / page block visible on the right edge (gives depth) */}
      <div
        aria-hidden
        className="absolute left-[8.5%] top-[3.5%] h-[85%] w-[85%] rounded-[4px]"
        style={{
          background:
            "linear-gradient(90deg, rgb(41,33,66) 0%, rgb(41,33,66) 86%, rgb(122,115,158) 93%, rgb(61,51,92) 100%)",
        }}
      />

      {/* Front cover image */}
      <div
        className="absolute left-[7%] top-[2.5%] h-[90%] w-[86%] overflow-hidden rounded-l-[2px] rounded-r-[4px]"
        style={{
          boxShadow:
            "-18px 0px 50px 0px rgba(115,84,242,0.35), 26px 34px 60px 0px rgba(0,0,0,0.65)",
        }}
      >
        <Image
          src="/figma/leitfaden-teaser/buch-cover.png"
          alt="SEIN. TUN. HABEN. — Buchcover"
          fill
          sizes="(max-width: 1024px) 90vw, 440px"
          className="object-cover"
          priority={false}
        />
        {/* Gloss highlight sweeping across the cover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(56deg, rgba(255,255,255,0.14) 14%, rgba(255,255,255,0) 46%, rgba(115,84,242,0.12) 86%)",
          }}
        />
        {/* Binding shadow on the left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[7%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.18) 55%, rgba(255,255,255,0.06) 100%)",
          }}
        />
      </div>
    </div>
  );
}
