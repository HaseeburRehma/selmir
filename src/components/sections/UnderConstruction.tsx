import Link from "next/link";
import { ArrowUpRight, ArrowRight, Hammer } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Placeholder shell used by every Seminare page whose real content
 * hasn't shipped yet. Kept intentionally minimal and brand-aligned:
 * navbar + footer stay identical to the rest of the site, so
 * visitors never feel like they hit a broken 404 — the page reads
 * "coming soon", not "gone".
 *
 * Copy is German — matches audience & the whiteboard brief.
 */
export function UnderConstruction({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <>
      <Navbar />
      <main className="relative min-h-[100vh] overflow-hidden bg-bg">
        {/* Subtle grid + purple glow — matches Über / Kontakt pages. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-1/25 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[720px] rounded-full bg-purple-2/15 blur-[110px]"
        />

        <section className="relative z-10 flex min-h-[calc(100vh-96px)] items-center px-6 pb-24 pt-[160px] md:px-12 md:pb-32 md:pt-[200px] lg:px-[120px]">
          <div className="mx-auto flex w-full max-w-[880px] flex-col items-center gap-8 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-2/30 bg-white/5 px-4 py-2.5">
                <Hammer className="size-4 text-purple-2" />
                <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-white/85">
                  In Bau
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="font-serif text-[40px] leading-[1.12] tracking-[-1.5px] text-white sm:text-[56px] lg:text-[72px] lg:tracking-[-2.5px]">
                {title}
              </h1>
            </Reveal>

            {subtitle ? (
              <Reveal delay={0.1}>
                <p className="max-w-[620px] font-serif text-[20px] leading-[1.35] tracking-[-0.5px] text-white/85 md:text-[24px]">
                  {subtitle}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.15}>
              <p className="max-w-[560px] font-body text-[15px] leading-[1.65] tracking-[-0.2px] text-white/60 md:text-[16px]">
                Diese Seite ist derzeit im Aufbau. Wir arbeiten an den letzten
                Details – schau bald wieder vorbei. Bis dahin freuen wir uns,
                dich persönlich kennenzulernen.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
                <Button
                  href="/betriebs-roentgen"
                  icon={<ArrowUpRight className="size-5" />}
                >
                  Potenzialanalyse sichern
                </Button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-body text-[15px] font-semibold text-white/80 transition-colors hover:text-white"
                >
                  Zur Startseite
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
