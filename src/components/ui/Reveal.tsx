"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
}

/**
 * Scroll-triggered fade + rise for section entrances.
 *
 * CSS transition + IntersectionObserver — no animation library, so this adds
 * no third-party JS to the bundle (it previously pulled in framer-motion,
 * which dominated the landing-page JS and hurt LCP/TBT).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className,
      style: {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: shown ? undefined : "opacity, transform",
      },
    },
    children,
  );
}
