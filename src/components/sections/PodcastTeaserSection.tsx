import Link from "next/link";
import { Mic } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import PodcastGrid from "@/components/sections/PodcastGrid";
import { PODCASTS } from "@/lib/podcasts";

/**
 * Homepage podcast teaser (Figma comment "we need a section linking to
 * podcast pages"). Uses the same card layout as /podcast so the teaser
 * previews exactly what the visitor lands on — just capped at the top
 * three episodes plus a CTA into the full archive.
 */

const HREF = "/podcast";

// Top three episodes newest-first — same source-of-truth as /podcast,
// which is already sorted reverse-chronologically at the module level.
const TOP_3 = PODCASTS.slice(0, 3);

export default function PodcastTeaserSection() {
  return (
    <section
      id="podcast-teaser"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-purple-2/15 blur-[160px]"
      />

      <div className="container-page relative">
        {/* Centered header — mirrors the /podcast hero */}
        <Reveal className="mx-auto flex max-w-[820px] flex-col items-center gap-5 text-center">
          <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            <span
              aria-hidden
              className="h-[2px] w-10 rounded-full bg-purple-2"
            />
            Podcast
          </span>
          <h2 className="text-[32px] leading-[1.12] tracking-[-1px] text-white md:text-[46px] lg:text-[54px] lg:tracking-[-1.8px]">
            <span className="font-serif italic font-normal">Selmir am</span>{" "}
            <span className="font-body font-extrabold tracking-[-1.6px]">
              Mikrofon.
            </span>
          </h2>
          <p className="max-w-[640px] font-body text-[15.5px] leading-[1.6] text-white/60 md:text-[16.5px]">
            Ehrliche Gespräche über Vertrieb, Führung und Struktur — mit
            Unternehmern, die ihren Betrieb neu aufgestellt haben. Die aktuellen
            drei Folgen als Vorschau.
          </p>
        </Reveal>

        {/* Same card layout as /podcast — YouTube embed, role badge, title */}
        <Reveal delay={0.1} className="mt-12 md:mt-14 lg:mt-[64px]">
          <PodcastGrid items={TOP_3} />
        </Reveal>

        {/* CTA into the full archive */}
        <Reveal delay={0.15} className="mt-12 flex justify-center md:mt-14">
          <Link
            href={HREF}
            className="btn-gradient group inline-flex h-14 items-center justify-center gap-2.5 rounded-[10px] px-7 text-center text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="font-body text-[14px] font-bold uppercase tracking-[0.6px]">
              Alle Folgen ansehen
            </span>
            <Mic className="size-[18px] opacity-90" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
