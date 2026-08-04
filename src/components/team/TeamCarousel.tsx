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
 * The Figma "Card - Hover Slider": purple radial-gradient card with a portrait
 * and the name at the bottom. On hover (or keyboard focus) a frosted panel
 * slides up to reveal the role, LinkedIn and bio. Members without a bio don't
 * flip — the photo simply lifts.
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
  const handle =
    member.linkedin &&
    (allowExternalLinks ? (
      <a
        href={member.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-[16px] font-semibold tracking-[-0.5px] text-white/80 transition-colors hover:text-white"
      >
        {member.linkedin.handle}
      </a>
    ) : (
      <span className="font-body text-[16px] font-semibold tracking-[-0.5px] text-white/80">
        {member.linkedin.handle}
      </span>
    ));

  return (
    <article
      tabIndex={flips ? 0 : -1}
      className="group relative aspect-[405/459] w-full overflow-hidden rounded-[20px] outline-none [background:radial-gradient(120%_100%_at_50%_38%,#b089ff_0%,#926ff9_50%,#7454f3_100%)]"
    >
      {/* Portrait */}
      <Image
        src={member.photo}
        alt={member.name}
        fill
        sizes="(max-width: 640px) 80vw, 405px"
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Bottom fade to the card purple */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-purple-1 via-purple-1/85 to-transparent" />

      {/* Front label */}
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-1 text-white transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
        <p className="font-display text-[26px] leading-none tracking-[-0.5px] lg:text-[32px]">
          {member.name}
        </p>
        <p className="font-body text-[15px] font-semibold tracking-[-0.5px] text-white/70 lg:text-[18px]">
          {member.role}
        </p>
      </div>

      {/* Hover panel */}
      {flips && (
        <div className="absolute inset-0 flex translate-y-full flex-col justify-between rounded-[20px] bg-purple-1/[0.72] p-6 text-white backdrop-blur-xl transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
          {/* grid texture + inner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.06) 0 1px, transparent 1px 34px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0 1px, transparent 1px 34px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
          />

          <div className="relative flex flex-col gap-3">
            <p className="font-display text-[24px] leading-tight tracking-[-1px] lg:text-[30px]">
              {member.title ?? member.role}
            </p>
            {member.linkedin && (
              <div className="flex items-center gap-2.5">
                <LinkedInMark />
                {handle}
              </div>
            )}
          </div>

          <p className="relative font-body text-[15px] leading-[1.4] tracking-[-0.3px] text-white/80 lg:text-[17px]">
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

  const scrollByCard = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 32 : 420;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const scrollable = canPrev || canNext;

  return (
    <div className="relative">
      <div
        ref={scroller}
        className={`flex gap-6 overflow-x-auto scroll-smooth pb-1 lg:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          scrollable ? "snap-x snap-mandatory" : "lg:justify-center"
        }`}
      >
        {members.map((m) => (
          <div
            key={m.name}
            data-card
            className="w-[80vw] max-w-[360px] shrink-0 snap-start sm:w-[340px] lg:w-[405px]"
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
