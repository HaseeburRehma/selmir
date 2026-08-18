import type { Metadata } from "next";
import Image from "next/image";
import { Download, FileText, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import LeitfadenForm from "@/components/leitfaden/LeitfadenForm";
import FooterSection from "@/components/sections/FooterSection";
import { HERO } from "@/lib/leitfaden";

export const metadata: Metadata = {
  title: "Rollenspiel-Leitfaden gratis — Selmir Suljkanovic",
  description:
    "Der Verkaufsleitfaden aus dem Rollenspiel-Video. 10 Seiten, 6 Kapitel — sofort per E-Mail als PDF. Begrüßung, Fragen, Einwandbehandlung und Abschluss.",
  alternates: { canonical: "/leitfaden" },
  openGraph: {
    title: "Rollenspiel-Leitfaden gratis — Selmir Suljkanovic",
    description:
      "Der Verkaufsleitfaden aus dem Rollenspiel-Video, sofort per E-Mail.",
    url: "/leitfaden",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Stripped-down nav specific to this LP: logo + one CTA. */
function LeitfadenNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-[80px]">
        <a href="/" aria-label="Selmir Suljkanovic — Startseite">
          <Image
            src="/logo-red-dark.svg"
            alt="Selmir Suljkanovic"
            width={140}
            height={40}
            priority
            className="h-9 w-auto md:h-10"
          />
        </a>
        <Button
          href="#download"
          icon={<Download className="size-5" />}
          className="!h-11 !px-4 !text-[11px] xl:!h-12 xl:!px-6 xl:!text-[13px]"
        >
          Leitfaden sichern
        </Button>
      </div>
    </header>
  );
}

export default function LeitfadenPage() {
  return (
    <>
      <LeitfadenNav />
      <main className="overflow-x-clip">
        {/* ─────────── HERO — the only section on this page ─────────── */}
        <section
          id="download"
          className="relative overflow-hidden bg-bg px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-[120px] lg:pb-[112px] lg:pt-[96px]"
        >
          {/* Base radial vignette — dark centre, purple bloom top-right,
              matching the Figma hero background (#090711 → #170b2e). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 78% 22%, rgba(116,84,243,0.35) 0%, rgba(37,20,72,0.55) 30%, rgba(15,10,28,0.85) 60%, #090711 100%)",
            }}
          />
          {/* Faint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
            }}
          />
          {/* Left bloom (behind the text column) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-16 h-[560px] w-[560px] rounded-full bg-purple-1/30 blur-[160px]"
          />
          {/* Right bloom (behind the PDF stack) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-purple-2/25 blur-[150px]"
          />
          {/* Warm rim glow at the very top */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[240px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(176,137,255,0.08) 0%, rgba(176,137,255,0) 100%)",
            }}
          />

          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 lg:grid-cols-[540px_1fr] lg:gap-[90px]">
            {/* Left column: eyebrow, headline, lead, PDF chip, form, trust row */}
            <Reveal className="flex flex-col gap-6">
              <span className="flex items-center gap-[14px] font-body text-[13px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2"
                />
                {HERO.eyebrow}
              </span>
              <h1 className="font-serif text-[34px] leading-[1.15] tracking-[-1px] text-white sm:text-[42px] md:text-[48px] lg:text-[50px] lg:leading-[1.18] lg:tracking-[-1.8px]">
                {HERO.headline.line1}
                <br />
                {HERO.headline.line2Serif}{" "}
                <span className="font-display">
                  {HERO.headline.line2Display}
                </span>
              </h1>
              <p className="max-w-[560px] font-body text-[15px] leading-[1.62] text-white/60 lg:text-[16.5px]">
                {HERO.lead}
              </p>

              {/* PDF file badge (Figma "PDF File Badge") */}
              <div className="inline-flex w-fit items-center gap-3.5 rounded-[14px] border border-white/[0.09] bg-white/[0.03] px-4 py-3.5">
                <span className="grid size-[42px] place-items-center rounded-[11px] bg-purple-2/[0.16]">
                  <FileText className="size-[22px] text-purple-2" strokeWidth={1.75} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-body text-[15px] font-semibold tracking-[-0.2px] text-white">
                    {HERO.formTag.title}
                  </span>
                  <span className="font-body text-[13.5px] tracking-[-0.1px] text-white/50">
                    {HERO.formTag.subtitle}
                  </span>
                </div>
              </div>

              {/* Hero form — name + phone + email + Turnstile + gradient CTA */}
              <div className="w-full">
                <LeitfadenForm
                  variant="hero"
                  submitLabel={HERO.submitLabel}
                  showFirstName
                  showPhone
                />
              </div>

              {/* Trust row: Zum Video pill + dot + audience note */}
              <div className="flex flex-wrap items-center gap-[18px]">
                <a
                  href={HERO.video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[9px] rounded-full border border-white/[0.14] bg-white/[0.06] px-5 py-[11px] font-body text-[14px] font-semibold tracking-[-0.1px] text-white/90 transition-colors hover:border-purple-2/60 hover:bg-white/[0.10]"
                >
                  <Play className="size-[16px] fill-purple-2 text-purple-2" />
                  {HERO.video.label}
                </a>
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-white/30"
                />
                <span className="font-body text-[14px] tracking-[-0.1px] text-white/50">
                  {HERO.audience}
                </span>
              </div>
            </Reveal>

            {/* Right column: BIG PDF mockup — 3-sheet stack, floating badge.
                overflow-hidden on the wrapper keeps the back-sheets and the
                floating badge from spilling past the column on narrow screens. */}
            <Reveal
              delay={0.1}
              className="mx-auto flex w-full max-w-[300px] flex-col min-w-0 sm:max-w-[420px] lg:mx-0 lg:ml-auto lg:max-w-[560px]"
            >
              <div
                className="relative w-full overflow-visible"
                style={{ aspectRatio: "500 / 620" }}
              >
                {/* soft purple bloom directly behind the cover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-[30%] size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,137,255,0.50)_0%,rgba(116,84,243,0.22)_45%,rgba(10,8,18,0)_75%)] blur-[28px]"
                />

                {/* Back sheet 2 — furthest offset right/down */}
                <div
                  aria-hidden
                  className="absolute right-[2%] top-[18%] h-[74%] w-[70%] rounded-[14px] border border-white/[0.06] bg-[#161127] opacity-80"
                />
                {/* Back sheet 1 — closer to main */}
                <div
                  aria-hidden
                  className="absolute right-[8%] top-[13%] h-[80%] w-[78%] rounded-[15px] border border-white/[0.08] bg-[#19132d]"
                />

                {/* Main PDF cover — larger, dominant */}
                <div
                  className="absolute left-0 top-[6%] flex h-[92%] w-[86%] flex-col justify-between overflow-hidden rounded-[18px] border border-purple-2/30 px-[8%] py-[7%]"
                  style={{
                    background:
                      "linear-gradient(117deg, #21183d 14%, #140e25 54%, #0b0816 86%)",
                    boxShadow: "0 40px 100px 0 rgba(112,77,255,0.42)",
                  }}
                >
                  {/* Top accent band */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(176,137,255,0.20) 0%, rgba(176,137,255,0) 100%)",
                    }}
                  />
                  <div className="relative flex flex-col gap-5 lg:gap-6">
                    <Image
                      src="/logo-red-dark.svg"
                      alt="Selmir"
                      width={130}
                      height={42}
                      className="h-[38px] w-auto lg:h-[42px]"
                    />
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="h-[2px] w-[32px] shrink-0 rounded-full bg-purple-2"
                      />
                      <span className="font-body text-[11px] font-semibold uppercase tracking-[1.8px] text-purple-2 lg:text-[12px]">
                        Vertrieb &amp; Akquise
                      </span>
                    </span>
                    <p className="font-serif text-[30px] leading-[1.2] tracking-[-1.1px] text-white lg:text-[36px] lg:tracking-[-1.4px]">
                      Rollenspiel-
                      <br />
                      <span className="font-display">Leitfaden:</span>
                    </p>
                    <p className="font-body text-[15px] leading-[1.55] tracking-[-0.15px] text-white/72 lg:text-[16px]">
                      Marketingagentur{" "}
                      <span className="font-bold text-purple-2">vs.</span>{" "}
                      Handwerksunternehmen
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <div aria-hidden className="h-px w-full bg-white/[0.14]" />
                    <div className="flex items-center justify-between font-body text-[11.5px] uppercase tracking-[1.5px] lg:text-[12px]">
                      <span className="font-semibold text-white/70">
                        Trainingsmaterial
                      </span>
                      <span className="font-medium text-white/45">10 Seiten</span>
                    </div>
                  </div>
                </div>

                {/* Floating PDF · Gratis badge */}
                <span
                  className="absolute right-[2%] top-[1%] rounded-full bg-purple-2 px-4 py-2.5 font-body text-[12px] font-bold uppercase tracking-[0.8px] text-bg lg:text-[13px]"
                  style={{ boxShadow: "0 8px 30px 0 rgba(112,77,255,0.55)" }}
                >
                  PDF · Gratis
                </span>

              </div>

              {/* caption — normal flow below the mockup, never overlaps the next section */}
              <p className="mt-5 text-center font-body text-[13px] tracking-[0.2px] text-white/45">
                Gratis PDF-Vorschau
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection landing />
    </>
  );
}
