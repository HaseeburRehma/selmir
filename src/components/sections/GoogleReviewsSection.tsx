"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import {
  GOOGLE_PROFILE_URL,
  GOOGLE_REVIEW_AVERAGE,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_REVIEWS,
  type GoogleReview,
} from "@/lib/google-reviews";

/**
 * Elegant Google Reviews slider — matches the site's dark card
 * aesthetic while carrying the "verified on Google" trust signal.
 *
 * One card per viewport on mobile, three on desktop. Auto-advances
 * every 6 s (long enough to read a short quote), pauses on hover,
 * has prev/next arrows and dot pagination.
 */
export default function GoogleReviewsSection() {
  return (
    <section
      id="rezensionen"
      className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-14 lg:gap-[76px]">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            <GoogleG className="size-4" />
            Google Rezensionen
          </span>
          <h2 className="max-w-[1000px] font-serif text-[30px] leading-[1.18] tracking-[-1px] text-white md:text-[50px] md:tracking-[-1.8px]">
            {GOOGLE_REVIEW_AVERAGE.toString().replace(".", ",")}{" "}
            <span className="font-display">von 5 Sternen</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 font-body text-[15px] text-white/70 md:text-[17px]">
            <span className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-5 fill-[#f5a623] text-[#f5a623]"
                  strokeWidth={0}
                />
              ))}
            </span>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <span>
              <strong className="text-white">{GOOGLE_REVIEW_COUNT}</strong>{" "}
              verifizierte Rezensionen
            </span>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <a
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-2 underline-offset-4 hover:underline"
            >
              Alle auf Google ansehen →
            </a>
          </div>
        </Reveal>

        <Reveal className="w-full">
          <ReviewCarousel reviews={GOOGLE_REVIEWS} />
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────── Carousel ─────────────────── */

function ReviewCarousel({ reviews }: { reviews: GoogleReview[] }) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  // Autoplay — advances every 6 s, pauses on hover / focus.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((cur) => {
        const next = (cur + 1) % reviews.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [paused, reviews.length, scrollToIndex]);

  // Update the active dot when the user swipes / scrolls manually.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
      const i = Math.round(el.scrollLeft / w);
      setActive(Math.min(reviews.length - 1, Math.max(0, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [reviews.length]);

  const prev = () => {
    const i = (active - 1 + reviews.length) % reviews.length;
    setActive(i);
    scrollToIndex(i);
  };
  const next = () => {
    const i = (active + 1) % reviews.length;
    setActive(i);
    scrollToIndex(i);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent md:w-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent md:w-16"
      />

      {/* Track */}
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div
            key={r.name + i}
            className="w-[calc(100%-2rem)] shrink-0 snap-center md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      {/* Arrows — hidden on touch (users swipe) */}
      <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
        <button
          type="button"
          onClick={prev}
          aria-label="Vorherige Rezension"
          className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-colors hover:border-purple-2/60 hover:bg-white/[0.06] hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        {/* Dot pagination */}
        <div className="flex items-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Rezension ${i + 1} anzeigen`}
              onClick={() => {
                setActive(i);
                scrollToIndex(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-8 bg-purple-2" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Nächste Rezension"
          className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-colors hover:border-purple-2/60 hover:bg-white/[0.06] hover:text-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── Card ─────────────────── */

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <Link
      href={GOOGLE_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-purple-2/40 hover:bg-white/[0.04] lg:p-8"
    >
      {/* Top: stars + Google G */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-[#f5a623] text-[#f5a623]"
              strokeWidth={0}
            />
          ))}
        </div>
        <GoogleG className="size-5 opacity-80 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Quote */}
      <p className="mt-5 font-serif text-[18px] leading-[1.5] text-white/85 lg:text-[19px]">
        <span className="mr-1 text-purple-2/70">“</span>
        {review.quote}
        <span className="ml-1 text-purple-2/70">”</span>
      </p>

      {/* Footer: name + role + date */}
      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-body text-[15px] font-semibold text-white">
            {review.name}
          </span>
          {review.role && (
            <span className="font-body text-[13px] text-white/50">
              {review.role}
            </span>
          )}
        </div>
        <span className="font-body text-[12px] text-white/40">
          {review.date}
        </span>
      </div>
    </Link>
  );
}

/* Official 4-color Google G — inline SVG so it works without external assets. */
function GoogleG({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
