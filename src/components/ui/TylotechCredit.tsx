"use client";

import { useEffect, useState } from "react";

const NORMAL = "Marketing & Betreuung durch ";
const BOLD = "TYLOTECH";
const FULL = NORMAL + BOLD;

const TYPE = 80;

/**
 * Footer credit that types itself out once on mount.
 *
 * It used to type and erase on a loop forever, which meant every page in the
 * site re-rendered these text nodes ~15 times a second for as long as the tab
 * was open. That is a crash surface as much as a battery drain: when a browser
 * translation feature swaps the text nodes underneath React, the next tick
 * tries to update nodes that are no longer there and throws, which takes the
 * whole page down to the error boundary. Hence both guards here — the
 * animation stops when it is done, and the element is excluded from
 * translation.
 */
export default function TylotechCredit() {
  const [len, setLen] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      // Deferred rather than set inline: a synchronous setState in an effect
      // body triggers a cascading render (and trips react-hooks lint).
      const jump = setTimeout(() => setLen(FULL.length), 0);
      return () => clearTimeout(jump);
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= FULL.length) clearInterval(id);
    }, TYPE);
    return () => clearInterval(id);
  }, []);

  const current = FULL.slice(0, len);
  const normalPart = current.slice(0, Math.min(len, NORMAL.length));
  const boldPart = len > NORMAL.length ? current.slice(NORMAL.length) : "";
  const done = len >= FULL.length;

  return (
    <a
      href="https://tylotech.de"
      target="_blank"
      rel="noreferrer"
      aria-label="Marketing & Betreuung durch TYLOTECH"
      /* Keep translation features away from the animated text nodes. */
      translate="no"
      className="notranslate group inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-gradient-to-r from-amber-400/10 to-amber-300/5 px-4 py-1.5 text-[13px] tracking-wide text-amber-200/90 shadow-[0_0_20px_-8px_rgba(251,191,36,0.4)] transition-colors hover:border-amber-300/50 hover:text-amber-100"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden className="shrink-0 text-amber-300">
        <path d="M12 2l2.9 6.26 6.9.5-5.23 4.52 1.64 6.72L12 16.9 5.79 20.5l1.64-6.72L2.2 8.76l6.9-.5L12 2z" />
      </svg>
      <span className="whitespace-nowrap tabular-nums">
        {normalPart}
        <strong className="font-bold tracking-wider text-amber-100">
          {boldPart}
        </strong>
        {/* The caret blinks in CSS and retires once the line is complete. */}
        {!done && <span className="tylo-caret ml-0.5 text-amber-300">|</span>}
      </span>
    </a>
  );
}
