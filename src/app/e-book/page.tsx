import type { Metadata } from "next";
import Image from "next/image";
import { Check, Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import FooterSection from "@/components/sections/FooterSection";
import EbookForm from "@/components/ebook/EbookForm";
import { EBOOK_COPY } from "@/lib/ebook";

export const metadata: Metadata = {
  title: "E-Book: Dein Vertrieb erreicht alle Ziele — Selmir Suljkanovic",
  description:
    "Kostenloses E-Book für Führungskräfte: die 7 Führungsfehler, die Betriebe jedes Jahr ein Vermögen kosten — und wie du sie in 30 Tagen abstellst.",
  alternates: { canonical: "/e-book" },
  openGraph: {
    title: "E-Book: Dein Vertrieb erreicht alle Ziele — Selmir Suljkanovic",
    description:
      "Die 7 Führungsfehler im Vertrieb — kostenloses E-Book von Selmir Suljkanovic.",
    url: "/e-book",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Stripped-down nav — logo + one CTA — identical pattern to /leitfaden. */
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
          href="#form"
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
        <section
          id="form"
          className="relative overflow-hidden bg-bg px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-[120px] lg:pb-[112px] lg:pt-[96px]"
        >
          {/* Same purple-bloom background as /leitfaden — cohesion. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 78% 22%, rgba(116,84,243,0.35) 0%, rgba(37,20,72,0.55) 30%, rgba(15,10,28,0.85) 60%, #090711 100%)",
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[240px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(176,137,255,0.08) 0%, rgba(176,137,255,0) 100%)",
            }}
          />

          <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,600px)_minmax(0,480px)] lg:gap-[90px]">
            {/* Left column — copy + bullets */}
            <Reveal className="flex flex-col gap-6">
              <span className="flex items-center gap-[14px] font-body text-[13px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2"
                />
                {EBOOK_COPY.eyebrow}
              </span>

              <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-1px] text-white sm:text-[44px] md:text-[52px] lg:text-[58px] lg:leading-[1.08] lg:tracking-[-2px]">
                {EBOOK_COPY.headline.line1Serif}
                <br />
                <span className="font-display">
                  {EBOOK_COPY.headline.line2Display}
                </span>
              </h1>

              <p className="max-w-[560px] font-body text-[15.5px] leading-[1.62] text-white/65 lg:text-[17px]">
                {EBOOK_COPY.lead}
              </p>

              <ul className="mt-2 flex flex-col gap-3">
                {EBOOK_COPY.bullets.map((b) => (
                  <li
                    key={b.slice(0, 32)}
                    className="flex items-start gap-3 font-body text-[14.5px] leading-[1.55] text-white/75 lg:text-[15.5px]"
                  >
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-purple-2/40 bg-purple-2/[0.12]">
                      <Check className="size-3 text-purple-2" strokeWidth={2.8} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Right column — the form card */}
            <Reveal delay={0.1}>
              <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.03] p-6 backdrop-blur lg:p-8">
                <EbookForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection landing />
    </>
  );
}
