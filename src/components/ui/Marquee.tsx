import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** gap between items in px */
  gap?: number;
  /** animation shorthand from theme, e.g. "marquee" | "marquee-slow" */
  speed?: "marquee" | "marquee-slow";
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}

/**
 * Infinite horizontal marquee. Duplicates its children so the loop is seamless
 * (translateX(-50%)). Matches the logo / stories rows in the Figma design.
 */
export function Marquee({
  children,
  gap = 96,
  speed = "marquee",
  reverse = false,
  className = "",
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={`fade-x w-full overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${
          speed === "marquee-slow" ? "marquee-anim-slow" : "marquee-anim"
        } ${pauseOnHover ? "marquee-track" : ""}`}
        style={{
          gap: `${gap}px`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div
          className="flex shrink-0 items-center"
          style={{ gap: `${gap}px` }}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}
