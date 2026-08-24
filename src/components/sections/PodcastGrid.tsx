"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Mic } from "lucide-react";
import { YouTubeLite } from "@/components/ui/YouTubeLite";
import type { PodcastEpisode } from "@/lib/podcasts";

/**
 * Responsive episode grid.
 *
 * Layout scales:
 *   mobile   → 1 column, cards stack, scroll page
 *   ≥sm      → horizontal snap-scroll carousel with 2 up
 *   ≥lg      → 3 up
 *
 * Arrows are hidden on touch — swiping is the primary path there.
 * We do NOT auto-advance: this is a browsable archive, not a
 * top-of-page attention grabber (that's what StoriesSection is).
 */
export default function PodcastGrid({ items }: { items: PodcastEpisode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    const w = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 8)
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  // Keyboard support — arrows advance when the track is focused.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Podcast-Folgen"
        className="scrollbar-hide flex flex-col gap-6 pb-2 outline-none sm:flex-row sm:snap-x sm:snap-mandatory sm:overflow-x-auto sm:scroll-smooth"
      >
        {items.map((ep) => (
          <article
            key={ep.id}
            data-card
            className="w-full shrink-0 sm:w-[calc(50%-12px)] sm:snap-center lg:w-[calc(33.333%-16px)]"
          >
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 transition-colors hover:border-purple-2/50 lg:p-4">
              <div className="rounded-xl border border-purple-2/40 bg-purple-2/10 p-2">
                <YouTubeLite
                  videoId={ep.id}
                  title={ep.title}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 px-1 pb-2 pt-1 lg:px-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Role badge */}
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-[1px] " +
                      (ep.role === "guest"
                        ? "bg-purple-2/20 text-purple-2"
                        : "bg-white/[0.06] text-white/70")
                    }
                  >
                    <Mic className="size-3" strokeWidth={2.5} />
                    {ep.role === "guest" ? "Als Gast" : "Gastgeber"}
                  </span>
                  {/* Show name */}
                  <span className="font-body text-[12px] uppercase tracking-[1px] text-white/45">
                    {ep.show}
                  </span>
                </div>

                <h3 className="font-serif text-[18px] leading-[1.3] text-white lg:text-[19px]">
                  {ep.title}
                </h3>

                {ep.counterpart && ep.role === "host" && (
                  <p className="font-body text-[13.5px] text-white/60">
                    Mit{" "}
                    <span className="font-semibold text-white/85">
                      {ep.counterpart}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Vorherige Folge"
            onClick={() => step(-1)}
            className="absolute -left-3 top-[35%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-bg/80 text-white backdrop-blur transition-colors hover:border-purple-2/60 md:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Nächste Folge"
            onClick={() => step(1)}
            className="absolute -right-3 top-[35%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-bg/80 text-white backdrop-blur transition-colors hover:border-purple-2/60 md:grid"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}
