"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Route error boundary.
 *
 * Without this file a client-side exception drops the visitor onto Next's bare
 * "This page couldn't load" screen. The realistic cause here is a browser
 * translation feature rewriting text nodes under React, which throws once and
 * then recovers fine on a fresh render — so the boundary retries itself a
 * single time before it shows anything. Only if that retry also fails does the
 * visitor see a message, and it stays on brand instead of stark white.
 */

const RETRY_FLAG = "lp_error_retried";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [retrying, setRetrying] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    console.error("[error boundary]", error?.message, error?.digest);

    if (attempted.current) return;
    attempted.current = true;

    // One silent retry per session, so a transient error self-heals but a
    // genuine one can't put us in a reload loop.
    let alreadyTried = true;
    try {
      alreadyTried = window.sessionStorage.getItem(RETRY_FLAG) === "1";
      if (!alreadyTried) window.sessionStorage.setItem(RETRY_FLAG, "1");
    } catch {
      // storage blocked — skip the auto retry rather than risk a loop
    }

    if (!alreadyTried) {
      setRetrying(true);
      unstable_retry();
    }
  }, [error, unstable_retry]);

  if (retrying) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg px-6">
        <p className="font-body text-[15px] text-white/50">Wird geladen …</p>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="flex max-w-[520px] flex-col items-center text-center">
        <span className="font-body text-[12px] font-semibold uppercase tracking-[2px] text-purple-2">
          Kurz etwas schiefgelaufen
        </span>

        <h1 className="mt-5 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px]">
          Diese Seite konnte nicht{" "}
          <span className="font-display">geladen werden.</span>
        </h1>

        <p className="mt-4 font-body text-[15px] leading-[26px] text-white/55">
          Bitte lade die Seite neu. Falls es erneut passiert, erreichst du uns
          direkt telefonisch oder per E-Mail.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="btn-gradient rounded-[10px] px-6 py-[14px] font-body text-[15px] font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            Erneut versuchen
          </button>
          {/* Deliberately a plain anchor, not next/link: a hard navigation
              throws away whatever client state broke, which is the point of
              this escape hatch. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="rounded-[10px] border border-white/15 px-6 py-[14px] font-body text-[15px] text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </main>
  );
}
