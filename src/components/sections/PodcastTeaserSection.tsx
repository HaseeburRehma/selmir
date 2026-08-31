import Link from "next/link";
import { ArrowUpRight, Mic } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PODCASTS } from "@/lib/podcasts";

/**
 * Compact podcast teaser slotted into the homepage between the Jürgen
 * Hohnen case study and the Hörmann case study — points visitors at the
 * full /podcast page. Requested via the Figma comment "we need a section
 * linking to podcast pages".
 *
 * Shows a short pitch on the left and three podcast cover tiles on the
 * right; every tile links to the same overview page.
 */

const HREF = "/podcast";

// Pick three visually strong covers to preview.
const PICKS = PODCASTS.slice(0, 3);

export default function PodcastTeaserSection() {
  return (
    <section
      id="podcast-teaser"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[120px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-purple-2/15 blur-[160px]"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,460px)_minmax(0,600px)] lg:gap-[80px]">
          {/* Left — pitch */}
          <Reveal className="flex flex-col gap-6">
            <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
              <span
                aria-hidden
                className="h-[2px] w-10 rounded-full bg-purple-2"
              />
              Podcast
            </span>
            <h2 className="text-[32px] leading-[1.12] tracking-[-1px] text-white md:text-[42px] lg:text-[48px] lg:tracking-[-1.6px]">
              <span className="font-serif italic font-normal">Selmir am</span>{" "}
              <span className="font-body font-extrabold tracking-[-1.4px]">
                Mikrofon.
              </span>
            </h2>
            <p className="max-w-[520px] font-body text-[15.5px] leading-[1.6] text-white/70 md:text-[16.5px]">
              Ehrliche Gespräche über Vertrieb, Führung und Struktur — mit
              Unternehmern, die ihren Betrieb neu aufgestellt haben. Alle
              Folgen als Gast und im eigenen CEON Unternehmer Podcast.
            </p>
            <div>
              <Link
                href={HREF}
                className="btn-gradient group inline-flex h-14 items-center justify-center gap-2.5 rounded-[10px] px-6 text-center text-black transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="font-body text-[14px] font-bold uppercase tracking-[0.6px]">
                  Alle Folgen ansehen
                </span>
                <Mic className="size-[18px] opacity-90" />
              </Link>
            </div>
          </Reveal>

          {/* Right — three cover tiles linking to /podcast */}
          <Reveal delay={0.1} className="grid grid-cols-3 gap-3 sm:gap-4">
            {PICKS.map((p) => (
              <Link
                key={p.title}
                href={HREF}
                className="group relative aspect-[3/4] overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.02]"
                aria-label={`Podcast: ${p.title}`}
              >
                {/* YouTube thumbnails are public and stable at this URL */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${p.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.7)_100%)]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                  <span className="line-clamp-2 font-body text-[12px] font-semibold leading-tight text-white">
                    {p.title}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/85 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
