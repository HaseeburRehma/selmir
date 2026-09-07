import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import FooterSection from "@/components/sections/FooterSection";
import WhitepaperForm from "@/components/whitepaper/WhitepaperForm";
import { HERO } from "@/lib/whitepaper";

export const metadata: Metadata = {
  title:
    "Whitepaper: Der Angebotsprozess für 2,1 Mio. € / Woche — Selmir Suljkanovic",
  description:
    "Kostenloses Whitepaper: der komplette Angebotsprozess, mit dem Hörmann Haustechnik mit nur zwei Vertrieblern monatlich 33 Wärmepumpen verkauft. Sofort per E-Mail als PDF.",
  alternates: { canonical: "/whitepaper/angebotsprozess" },
  openGraph: {
    title:
      "Whitepaper: Der Angebotsprozess für 2,1 Mio. € / Woche — Selmir Suljkanovic",
    description:
      "Von der Anfrage bis zum Abschluss in 3–5 Tagen — der Angebotsprozess aus dem Live-Case Hörmann als kostenloses Whitepaper.",
    url: "/whitepaper/angebotsprozess",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Stripped-down nav specific to this LP: logo + one CTA. Mirrors the
 *  header shape used on /e-book/fuehrungskraefte and /leitfaden. */
function WhitepaperNav() {
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
          Whitepaper sichern
        </Button>
      </div>
    </header>
  );
}

export default function WhitepaperAngebotsprozessPage() {
  return (
    <>
      <WhitepaperNav />
      <main className="overflow-x-clip">
        {/* ─────────── HERO — same shape as /e-book/fuehrungskraefte ─────────── */}
        <section
          id="download"
          className="relative overflow-hidden bg-bg px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-[120px] lg:pb-[112px] lg:pt-[96px]"
        >
          {/* Base radial vignette — purple bloom top-right. */}
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
            {/* Left on desktop, FIRST on mobile — form up top, PDF mockup
                stacks below. On lg+ they sit side-by-side. */}
            <Reveal className="order-1 flex flex-col gap-6">
              <span className="flex items-center gap-[14px] font-body text-[13px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2"
                />
                {HERO.eyebrow}
              </span>
              {/* H1 in three explicit lines — matches the client mock:
                  base copy in italic serif, only the price accent
                  '2,1 Mio. €' switches to an upright purple extrabold
                  sans. Forced breaks so the balance stays predictable
                  at every viewport; mobile font drops so each line
                  fits inside its column. */}
              <h1 className="font-serif italic text-[26px] leading-[1.08] tracking-[-0.4px] text-white sm:text-[32px] md:text-[38px] lg:text-[44px] lg:leading-[1.08] lg:tracking-[-1.2px]">
                {HERO.headline.line1}
                <br />
                {HERO.headline.line2Pre}{" "}
                <span className="whitespace-nowrap font-body not-italic font-extrabold tracking-[-1px] text-purple-2">
                  {HERO.headline.accent}
                </span>{" "}
                {HERO.headline.line2Post}
                <br />
                {HERO.headline.line3}
              </h1>
              <p className="max-w-[560px] font-body text-[15px] leading-[1.62] text-white/60 lg:text-[16.5px]">
                {HERO.lead}
              </p>

              {/* Hero form — Vorname + Nachname + Telefon + Turnstile +
                  gradient CTA. Same SMS-verify UX as the e-book form. */}
              <div className="w-full">
                <WhitepaperForm />
              </div>

              {/* Audience trust row */}
              <div className="flex flex-wrap items-center gap-[18px]">
                <span aria-hidden className="size-1 rounded-full bg-white/30" />
                <span className="font-body text-[14px] tracking-[-0.1px] text-white/50">
                  {HERO.audience}
                </span>
              </div>
            </Reveal>

            {/* Right on desktop, SECOND on mobile — real PDF cover
                (extracted from page 1 of the redesigned whitepaper).
                Layered back-sheets behind + a floating WHITEPAPER · GRATIS
                badge keep the "stacked pages" impression the previous
                synthetic mockup had, but the front cover is now the
                actual artwork the visitor gets in the PDF — no more
                mismatch between the teaser and the file. */}
            <Reveal
              delay={0.1}
              className="order-2 mx-auto flex w-full min-w-0 max-w-[320px] flex-col sm:max-w-[400px] lg:mx-0 lg:ml-auto lg:max-w-[560px]"
            >
              <div
                className="relative w-full overflow-visible"
                style={{ aspectRatio: "2425 / 3430" }}
              >
                {/* Soft purple bloom directly behind the cover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-[30%] size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,137,255,0.50)_0%,rgba(116,84,243,0.22)_45%,rgba(10,8,18,0)_75%)] blur-[28px]"
                />

                {/* Back sheet 2 */}
                <div
                  aria-hidden
                  className="absolute right-[2%] top-[8%] h-[86%] w-[70%] rounded-[14px] border border-white/[0.06] bg-[#161127] opacity-80"
                />
                {/* Back sheet 1 */}
                <div
                  aria-hidden
                  className="absolute right-[8%] top-[5%] h-[92%] w-[78%] rounded-[15px] border border-white/[0.08] bg-[#19132d]"
                />

                {/* Real PDF cover — front of the stack */}
                <div
                  className="absolute left-0 top-0 h-full w-[92%] overflow-hidden rounded-[18px] border border-purple-2/30"
                  style={{
                    boxShadow: "0 40px 100px 0 rgba(112,77,255,0.42)",
                  }}
                >
                  <Image
                    src="/pdf/whitepaper-cover.jpg"
                    alt="Whitepaper: Der Angebotsprozess für 2,1 Mio. € / Woche — Cover"
                    width={2425}
                    height={3430}
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 400px, 560px"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Floating WHITEPAPER · GRATIS badge */}
                <span
                  className="absolute right-[-2%] top-[-2%] rounded-full bg-purple-2 px-4 py-2.5 font-body text-[12px] font-bold uppercase tracking-[0.8px] text-bg lg:text-[13px]"
                  style={{ boxShadow: "0 8px 30px 0 rgba(112,77,255,0.55)" }}
                >
                  Whitepaper · Gratis
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
