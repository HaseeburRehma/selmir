import type { ReactNode } from "react";

/**
 * Shared primitives for the eight marketing landing pages.
 *
 * Measurements are taken 1:1 from the Figma frames (1440 artboard, 1200 content
 * column, 140px section padding). The `lg:` values are the exact design numbers;
 * smaller breakpoints scale them down.
 */

/** 1200px content column — at 1440 that is the design's 120px side margin. */
export function LpContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-[120px] ${className}`}
    >
      {children}
    </div>
  );
}

/** Vertical rhythm of a section: 140px top and bottom in the design. */
export const LP_SECTION = "bg-bg py-16 md:py-24 lg:py-[140px]";

/**
 * Uppercase purple label, 13px/16 with 2px tracking.
 * `line` prepends the 40×2 rule the design uses on left-aligned eyebrows.
 */
export function Eyebrow({
  children,
  line = false,
  className = "",
}: {
  children: ReactNode;
  line?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-[14px] font-body text-[12px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2 lg:text-[13px] ${className}`}
    >
      {line && (
        <span aria-hidden className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2" />
      )}
      {children}
    </span>
  );
}

/**
 * Section headline — Prata for the setup, Days One for the punch.
 * 50px/59 with −1.8 tracking at the design width.
 */
export function LpHeading({
  serif,
  display,
  tail,
  as: Tag = "h2",
  className = "",
}: {
  serif: string;
  display: string;
  
  /** Optional serif fragment after the display part (the offer headline). */
  tail?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.8px] ${className}`}
    >
      {serif} <span className="font-display">{display}</span>
      {tail ? <> {tail}</> : null}
    </Tag>
  );
}

/** Body copy under a headline — 16px/26. */
export function LpLead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-body text-[15px] leading-[1.62] text-white/55 lg:text-[16px] lg:leading-[26px] ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * Centred section header: eyebrow → 22px → headline → 22px → body.
 */
export function LpSectionHeader({
  eyebrow,
  line = false,
  serif,
  display,
  body,
  headingClassName = "",
  bodyClassName = "",
}: {
  eyebrow: string;
  line?: boolean;
  serif: string;
  display: string;
  body?: string;
  headingClassName?: string;
  bodyClassName?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Eyebrow line={line}>{eyebrow}</Eyebrow>
      <LpHeading
        serif={serif}
        display={display}
        className={`mt-4 lg:mt-[22px] ${headingClassName}`}
      />
      {body && (
        <LpLead className={`mt-4 lg:mt-[22px] ${bodyClassName}`}>{body}</LpLead>
      )}
    </div>
  );
}

/**
 * Purple-bloom card used by the solution and steps rows.
 * Figma: 384×195, 36px side / 40px vertical padding, 44×4 accent bar,
 * 20px/27 title, 16px/26 body.
 */
export function LpCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[18px] border border-white/[0.07] bg-[radial-gradient(130%_120%_at_50%_0%,rgba(116,84,243,0.20)_0%,rgba(10,8,18,0)_72%)] px-7 py-8 md:px-9 md:py-10">
      <span
        aria-hidden
        className="block h-[4px] w-[44px] rounded-full bg-purple-2"
      />
      <h3 className="mt-4 font-body text-[19px] font-semibold leading-[27px] tracking-[-0.3px] text-white lg:text-[20px]">
        {title}
      </h3>
      <p className="mt-4 font-body text-[15px] leading-[26px] text-white/55 lg:text-[16px]">
        {body}
      </p>
    </div>
  );
}
