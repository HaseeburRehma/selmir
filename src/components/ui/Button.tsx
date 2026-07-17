"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  icon?: ReactNode | false;
  className?: string;
  full?: boolean;
}

/**
 * CTA button matching the Figma "Button" component.
 * - primary: purple gradient fill, black uppercase label, animated shine sweep
 * - secondary: dark fill, purple border, white uppercase label
 *
 * External URLs (http…, e.g. Stripe checkout) open in a new tab.
 */
export function Button({
  children,
  href = "#tickets",
  variant = "primary",
  icon,
  className = "",
  full = false,
}: ButtonProps) {
  const showIcon = icon !== false;
  const iconNode = icon ?? <CalendarDays className="size-5" strokeWidth={2} />;
  const isExternal = /^https?:\/\//.test(href);

  const base =
    "group relative inline-flex h-16 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[6px] px-6 font-label text-[14px] font-bold uppercase tracking-wide transition-transform duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0";

  const secondaryClasses = `${base} border-[0.5px] border-purple-2 bg-bg text-ink hover:border-purple-3 ${
    full ? "w-full" : ""
  } ${className}`;

  const primaryClasses = `${base} btn-gradient border-[0.5px] border-purple-2 text-black shadow-[0_10px_40px_-12px_rgba(116,84,243,0.7)] ${
    full ? "w-full" : ""
  } ${className}`;

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {showIcon && (
        <span
          className={`relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 ${
            variant === "secondary" ? "text-purple-2" : ""
          }`}
        >
          {iconNode}
        </span>
      )}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[6px]"
        >
          <span className="absolute top-1/2 left-0 h-[130%] w-10 -translate-y-1/2 bg-white/70 blur-[16px] mix-blend-plus-lighter animate-shine" />
        </span>
      )}
    </>
  );

  const classes = variant === "secondary" ? secondaryClasses : primaryClasses;

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
