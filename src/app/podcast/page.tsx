import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import GoogleReviewsSection from "@/components/sections/GoogleReviewsSection";
import PodcastGrid from "@/components/sections/PodcastGrid";
import { Reveal } from "@/components/ui/Reveal";
import { PODCASTS } from "@/lib/podcasts";

export const metadata: Metadata = {
  title: "Podcast — Selmir Suljkanovic",
  description:
    "Alle Podcast-Auftritte von Selmir Suljkanovic: als Gast in externen Shows und im eigenen CEON Unternehmer Podcast mit Marco Huck, Tolga Toker, Jürgen Hohnen und weiteren Unternehmern.",
  alternates: { canonical: "/podcast" },
  openGraph: {
    title: "Podcast — Selmir Suljkanovic",
    description:
      "Alle Podcast-Auftritte von Selmir Suljkanovic — als Gast und Gastgeber.",
    url: "/podcast",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

const GUEST = PODCASTS.filter((p) => p.role === "guest");
const HOST = PODCASTS.filter((p) => p.role === "host");

export default function PodcastPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ─── Hero ─── */}
        <section
          id="podcast-hero"
          className="relative overflow-hidden bg-bg px-6 pb-16 pt-[120px] md:px-12 md:pb-24 md:pt-[160px] lg:px-[120px] lg:pt-[200px]"
        >
          {/* purple glow behind the heading */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 70% at 50% 0%, rgba(116,84,243,0.28) 0%, rgba(37,20,72,0.35) 30%, rgba(15,10,28,0.7) 60%, #090711 100%)",
            }}
          />

          <div className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-6 text-center">
            <Reveal>
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Podcast
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-1px] text-white sm:text-[48px] md:text-[60px] md:tracking-[-1.8px] lg:text-[72px] lg:tracking-[-2.4px]">
                Selmir am{" "}
                <span className="font-display">Mikrofon.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[720px] font-body text-[16px] leading-[1.6] text-white/65 md:text-[18px]">
                Als Gast bei anderen und als Gastgeber im{" "}
                <strong className="text-white/90">
                  CEON Unternehmer Podcast
                </strong>{" "}
                — Gespräche mit Unternehmern über Vertrieb, Wachstum, Mindset
                und den Weg vom Kriegsflüchtling zum Unternehmer.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── Guest appearances ─── */}
        <section
          id="als-gast"
          className="bg-bg px-6 py-20 md:px-12 md:py-24 lg:px-[120px]"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:gap-14">
            <Reveal className="flex flex-col gap-4">
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Als Gast
              </span>
              <h2 className="font-serif text-[28px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[36px] md:text-[44px] md:tracking-[-1.4px]">
                Interviews auf{" "}
                <span className="font-display">externen Shows</span>
              </h2>
            </Reveal>
            <Reveal className="w-full">
              <PodcastGrid items={GUEST} />
            </Reveal>
          </div>
        </section>

        {/* ─── CEON Podcast (host) ─── */}
        <section
          id="ceon-podcast"
          className="bg-bg px-6 pb-24 pt-4 md:px-12 md:pb-32 md:pt-8 lg:px-[120px] lg:pb-[140px]"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:gap-14">
            <Reveal className="flex flex-col gap-4">
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                CEON Unternehmer Podcast
              </span>
              <h2 className="font-serif text-[28px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[36px] md:text-[44px] md:tracking-[-1.4px]">
                Selmir als{" "}
                <span className="font-display">Gastgeber</span>
              </h2>
            </Reveal>
            <Reveal className="w-full">
              <PodcastGrid items={HOST} />
            </Reveal>
          </div>
        </section>

        {/* Google reviews trust block */}
        <GoogleReviewsSection />
      </main>
      <FooterSection />
    </>
  );
}
