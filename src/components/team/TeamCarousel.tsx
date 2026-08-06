"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TeamMember } from "@/lib/team";

/** White rounded-square LinkedIn badge, matching the Figma hover state. */
function LinkedInMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-[7px] bg-white">
      <svg viewBox="0 0 24 24" className="size-5 fill-purple-1" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    </span>
  );
}

/**
 * Team card. Dark ground with the original studio photo shown as-is (the
 * dark studio backdrop blends into the card). A subtle purple bottom-corner
 * glow adds warmth. Hover / focus flips to a dark details panel with the
 * tile grid, role heading, LinkedIn and bio. Members without a bio don't flip.
 *
 * `allowExternalLinks=false` (landing pages) keeps the LinkedIn handle as plain
 * text so visitors aren't sent off-page.
 */
function TeamCard({
  member,
  allowExternalLinks,
}: {
  member: TeamMember;
  allowExternalLinks: boolean;
}) {
  const flips = Boolean(member.bio);
  const linkedInRow =
    member.linkedin &&
    (() => {
      const Inner = (
        <>
          <LinkedInMark />
          <span className="font-body text-[16px] font-semibold tracking-[-0.5px] text-white/80 transition-colors group-hover/link:text-white">
            {member.linkedin.handle}
          </span>
        </>
      );
      return allowExternalLinks ? (
        <a
          href={member.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex w-fit items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={(e) => e.stopPropagation()}
        >
          {Inner}
        </a>
      ) : (
        <div className="flex w-fit items-center gap-2.5">{Inner}</div>
      );
    })();

  return (
    <article
      tabIndex={flips ? 0 : -1}
      className="group relative aspect-[405/459] w-full overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#0e0918] outline-none"
    >
      {/* Original photo, full-bleed. object-position lines every subject's
          face on the same Y, so cards read as a matched set. The dark studio
          backdrop naturally blends into the dark card. */}
      <Image
        src={member.photo}
        alt={member.name}
        fill
        sizes="(max-width: 640px) 80vw, 405px"
        style={{ objectPosition: "50% 22%" }}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Warm purple ambient glow in the bottom-left corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 100%, rgba(116,84,243,0.35) 0%, rgba(116,84,243,0.10) 40%, rgba(116,84,243,0) 70%)",
        }}
      />

      {/* Bottom dark fade holds the name / role text over any photo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background:
            "linear-gradient(to top, #0e0918 0%, rgba(14,9,24,0.85) 55%, rgba(14,9,24,0) 100%)",
        }}
      />

      {/* Front label */}
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-1 text-white transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
        <p className="font-display text-[20px] leading-none tracking-[-0.5px] sm:text-[24px] lg:text-[28px] whitespace-nowrap">
          {member.name}
        </p>
        <p className="font-body text-[14px] font-semibold tracking-[-0.4px] text-white/70 lg:text-[16px]">
          {member.role}
        </p>
      </div>

      {/* Hover / focus details panel — dark frosted glass with a visible
          tile grid, matching the Figma State=Hovered variant. */}
      {flips && (
        <div className="absolute inset-0 flex translate-y-full flex-col justify-between rounded-[20px] bg-[#0a0612]/92 p-6 text-white backdrop-blur-xl backdrop-saturate-150 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
          {/* Tile grid — clearly visible, matches the Figma card texture. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.13) 1px, transparent 1px), " +
                "linear-gradient(to bottom, rgba(255,255,255,0.13) 1px, transparent 1px)",
              backgroundSize: "28px 28px, 28px 28px",
            }}
          />
          {/* Very soft warm glow behind the tile grid — the "glass" sheen. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px]"
            style={{
              background:
                "radial-gradient(60% 45% at 55% 55%, rgba(176,137,255,0.14) 0%, rgba(116,84,243,0.06) 45%, rgba(116,84,243,0) 75%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />

          <div className="relative flex flex-col gap-3">
            <p className="font-display text-[22px] leading-tight tracking-[-1px] lg:text-[28px]">
              {member.title ?? member.role}
            </p>
            {linkedInRow}
          </div>

          <p className="relative font-body text-[14px] leading-[1.4] tracking-[-0.3px] text-white/80 lg:text-[16px]">
            {member.bio}
          </p>
        </div>
      )}
    </article>
  );
}

export default function TeamCarousel({
  members,
  allowExternalLinks = true,
}: {
  members: TeamMember[];
  allowExternalLinks?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [paused, setPaused] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, members.length]);

  /** Distance to advance by one card (card width + gap). */
  const stepSize = () => {
    const el = scroller.current;
    if (!el) return 420;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
    return cards[0] ? cards[0].offsetWidth + 32 : 420;
  };

  const scrollByCard = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  };

  // Auto-advance every 2s; loops back to the start; pauses on interaction.
  useEffect(() => {
    if (paused) return;
    const el = scroller.current;
    if (!el) return;
    const id = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth + 8) return; // nothing to scroll
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: stepSize(), behavior: "smooth" });
      }
    }, 2000);
    return () => clearInterval(id);
  }, [paused, members.length]);

  const scrollable = canPrev || canNext;

  return (
    <div className="relative">
      <div
        ref={scroller}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className={`flex gap-6 overflow-x-auto scroll-smooth pb-1 lg:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          scrollable ? "snap-x snap-mandatory" : "lg:justify-center"
        }`}
      >
        {members.map((m) => (
          <div
            key={m.name}
            data-card
            className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[320px] lg:w-[389px]"
          >
            <TeamCard member={m} allowExternalLinks={allowExternalLinks} />
          </div>
        ))}
      </div>

      {/* Arrows — only when the row actually overflows */}
      {scrollable && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Vorheriges Teammitglied"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Nächstes Teammitglied"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
