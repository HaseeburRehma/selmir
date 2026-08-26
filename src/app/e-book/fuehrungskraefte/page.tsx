import type { Metadata } from "next";
import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import FooterSection from "@/components/sections/FooterSection";
import EbookForm from "@/components/ebook/EbookForm";
import { COVER, HERO } from "@/lib/ebook";

export const metadata: Metadata = {
  title: "E-Book: Dein Vertrieb erreicht alle Ziele — Selmir Suljkanovic",
  description:
    "Kostenloses E-Book für Führungskräfte: die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten — und wie du sie in 30 Tagen abstellst. Sofort per E-Mail als PDF.",
  alternates: { canonical: "/e-book/fuehrungskraefte" },
  openGraph: {
    title: "E-Book: Dein Vertrieb erreicht alle Ziele — Selmir Suljkanovic",
    description:
      "Die 7 Führungsfehler im Vertrieb — kostenloses E-Book von Selmir Suljkanovic.",
    url: "/e-book/fuehrungskraefte",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Stripped-down nav specific to this LP: logo + one CTA. Same shape as
 *  /leitfaden. */
function EbookNav() {
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
          E-Book sichern
        </Button>
      </div>
    </header>
  );
}

export default function EbookPage() {
  return (
    <>
      <EbookNav />
      <main className="overflow-x-clip">
        {/* ─────────── HERO — same shape as /leitfaden ─────────── */}
        <section
          id="download"
          className="relative overflow-hidden bg-bg px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-[120px] lg:pb-[112px] lg:pt-[96px]"
        >
          {/* Base radial vignette — same purple bloom top-right. */}
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
          {/* Blooms + top rim glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-16 h-[560px] w-[560px] rounded-full bg-purple-1/30 blur-[160px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-purple-2/25 blur-[150px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[240px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(176,137,255,0.08) 0%, rgba(176,137,255,0) 100%)",
            }}
          />

          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 lg:grid-cols-[540px_1fr] lg:gap-[90px]">
            {/* LEFT column on desktop, SECOND on mobile — the PDF mockup
                above the form makes more sense on a phone (visual first,
                copy + form second). On lg+ they sit side-by-side as before. */}
            <Reveal className="order-2 flex flex-col gap-6 lg:order-1">
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

              {/* PDF file badge */}
              <div className="inline-flex w-fit items-center gap-3.5 rounded-[14px] border border-white/[0.09] bg-white/[0.03] px-4 py-3.5">
                <span className="grid size-[42px] place-items-center rounded-[11px] bg-purple-2/[0.16]">
                  <FileText
                    className="size-[22px] text-purple-2"
                    strokeWidth={1.75}
                  />
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

              {/* Hero form — Vorname + E-Mail + Telefon + Turnstile + gradient CTA */}
              <div className="w-full">
                <EbookForm />
              </div>

              {/* Trust row: audience note */}
              <div className="flex flex-wrap items-center gap-[18px]">
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-white/30"
                />
                <span className="font-body text-[14px] tracking-[-0.1px] text-white/50">
                  {HERO.audience}
                </span>
              </div>
            </Reveal>

            {/* RIGHT column on desktop, FIRST on mobile (order-1) so the
                cover mockup leads the fold on a phone. */}
            <Reveal
              delay={0.1}
              className="order-1 mx-auto flex w-full min-w-0 max-w-[300px] flex-col sm:max-w-[420px] lg:order-2 lg:mx-0 lg:ml-auto lg:max-w-[560px]"
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

                {/* Back sheet 2 */}
                <div
                  aria-hidden
                  className="absolute right-[2%] top-[18%] h-[74%] w-[70%] rounded-[14px] border border-white/[0.06] bg-[#161127] opacity-80"
                />
                {/* Back sheet 1 */}
                <div
                  aria-hidden
                  className="absolute right-[8%] top-[13%] h-[80%] w-[78%] rounded-[15px] border border-white/[0.08] bg-[#19132d]"
                />

                {/* Main PDF cover */}
                <div
                  className="absolute left-0 top-[6%] flex h-[92%] w-[86%] flex-col justify-between overflow-hidden rounded-[18px] border border-purple-2/30 px-[8%] py-[7%]"
                  style={{
                    background:
                      "linear-gradient(117deg, #21183d 14%, #140e25 54%, #0b0816 86%)",
                    boxShadow: "0 40px 100px 0 rgba(112,77,255,0.42)",
                  }}
                >
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
                        {COVER.eyebrow}
                      </span>
                    </span>
                    <p className="font-serif text-[28px] leading-[1.15] tracking-[-1.1px] text-white lg:text-[34px] lg:tracking-[-1.4px]">
                      {COVER.titleSerif}
                      <br />
                      {COVER.titleBreak}{" "}
                      <span className="font-display">{COVER.titleDisplay}</span>
                    </p>
                    <p className="font-body text-[15px] leading-[1.55] tracking-[-0.15px] text-white/72 lg:text-[16px]">
                      {COVER.subtitleHigh}{" "}
                      <span className="font-bold text-purple-2">
                        {COVER.subtitleLow}
                      </span>
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <div aria-hidden className="h-px w-full bg-white/[0.14]" />
                    <div className="flex items-center justify-between font-body text-[11.5px] uppercase tracking-[1.5px] lg:text-[12px]">
                      <span className="font-semibold text-white/70">
                        {COVER.footerL}
                      </span>
                      <span className="font-medium text-white/45">
                        {COVER.footerR}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating E-BOOK · GRATIS badge */}
                <span
                  className="absolute right-[2%] top-[1%] rounded-full bg-purple-2 px-4 py-2.5 font-body text-[12px] font-bold uppercase tracking-[0.8px] text-bg lg:text-[13px]"
                  style={{ boxShadow: "0 8px 30px 0 rgba(112,77,255,0.55)" }}
                >
                  E-Book · Gratis
                </span>
              </div>

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
