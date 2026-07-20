"use client";

import { useEffect, useState } from "react";

const NORMAL = "Marketing & Betreuung durch ";
const BOLD = "TYLOTECH";
const FULL = NORMAL + BOLD;

const TYPE = 80;
const ERASE = 40;
const HOLD_FULL = 1600;
const HOLD_EMPTY = 600;

export default function TylotechCredit() {
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Only run the typing effect if the user hasn't asked for reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setLen(FULL.length);
      return;
    }
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (!animate) return;
    let t: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (len < FULL.length) t = setTimeout(() => setLen(len + 1), TYPE);
      else t = setTimeout(() => setDeleting(true), HOLD_FULL);
    } else {
      if (len > 0) t = setTimeout(() => setLen(len - 1), ERASE);
      else t = setTimeout(() => setDeleting(false), HOLD_EMPTY);
    }
    return () => clearTimeout(t);
  }, [animate, len, deleting]);

  const current = FULL.slice(0, len);
  const normalPart = current.slice(0, Math.min(len, NORMAL.length));
  const boldPart = len > NORMAL.length ? current.slice(NORMAL.length) : "";

  return (
    <a
      href="https://tylotech.de"
      target="_blank"
      rel="noreferrer"
      aria-label="Marketing & Betreuung durch TYLOTECH"
      className="group inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-gradient-to-r from-amber-400/10 to-amber-300/5 px-4 py-1.5 text-[13px] tracking-wide text-amber-200/90 shadow-[0_0_20px_-8px_rgba(251,191,36,0.4)] transition-colors hover:border-amber-300/50 hover:text-amber-100"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden className="shrink-0 text-amber-300">
        <path d="M12 2l2.9 6.26 6.9.5-5.23 4.52 1.64 6.72L12 16.9 5.79 20.5l1.64-6.72L2.2 8.76l6.9-.5L12 2z" />
      </svg>
      <span className="whitespace-nowrap tabular-nums">
        {normalPart}
        <strong className="font-bold tracking-wider text-amber-100">
          {boldPart}
        </strong>
        <span className="tylo-caret ml-0.5 text-amber-300">|</span>
      </span>
    </a>
  );
}
