"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { YouTubeLite } from "./YouTubeLite";

interface VideoCarouselProps {
  videoIds: string[];
  /** auto-advance interval in ms */
  interval?: number;
}

/**
 * Auto-advancing, snap-scrolling carousel of YouTube videos.
 * Pauses on hover and permanently once the visitor plays a video.
 */
export function VideoCarousel({ videoIds, interval = 4500 }: VideoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    const w = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && el.scrollLeft <= 8) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * w, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const enter = () => (pausedRef.current = true);
    const leave = () => (pausedRef.current = false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    const isSliderLayout = () => window.matchMedia("(min-width: 640px)").matches;
    const id = setInterval(() => {
      if (pausedRef.current || stoppedRef.current || !isSliderLayout()) return;
      step(1);
    }, interval);
    return () => {
      clearInterval(id);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [interval]);

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="scrollbar-hide flex flex-col gap-5 pb-2 sm:flex-row sm:snap-x sm:snap-mandatory sm:gap-6 sm:overflow-x-auto sm:scroll-smooth"
      >
        {videoIds.map((id, i) => (
          <div
            key={id}
            data-card
            className="w-full shrink-0 sm:w-[calc(50%-12px)] sm:snap-center lg:w-[calc(33.333%-16px)]"
          >
            <div className="rounded-2xl border border-purple-2/50 bg-purple-2/10 p-2.5 transition-colors hover:border-purple-2/80">
              <YouTubeLite
                videoId={id}
                title={`Erfolgsgeschichte ${i + 1}`}
                className="rounded-xl"
                onPlay={() => (stoppedRef.current = true)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        type="button"
        aria-label="Vorheriges Video"
        onClick={() => step(-1)}
        className="absolute -left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-bg/80 text-white backdrop-blur transition-colors hover:border-purple-2/60 md:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Nächstes Video"
        onClick={() => step(1)}
        className="absolute -right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-bg/80 text-white backdrop-blur transition-colors hover:border-purple-2/60 md:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
