"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Check, Download } from "lucide-react";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import { EBOOK_COPY } from "@/lib/ebook";

/**
 * Cloudflare Turnstile — invisible bot check. Same widget the leitfaden
 * page uses; loaded once here.
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * E-Book subscribe form. Simpler than LeitfadenForm — no SMS layer,
 * just Turnstile + submit. On success:
 *   • Meta Pixel Lead event fires (client-side, same setup as other LPs)
 *   • Success card replaces the form
 */
export default function EbookForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [msg, setMsg] = useState<string | null>(null);

  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsContainer = useRef<HTMLDivElement | null>(null);
  const tsWidgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const tryRender = () => {
      if (cancelled || tsWidgetId.current) return;
      // Reuse the global window.turnstile that the leitfaden loader registers;
      // this page loads its own script tag as well so it works standalone.
      const w = window as unknown as {
        turnstile?: {
          render: (
            el: HTMLElement,
            opts: {
              sitekey: string;
              callback?: (t: string) => void;
              "error-callback"?: () => void;
              "expired-callback"?: () => void;
              size?: "flexible" | "normal" | "compact" | "invisible";
              theme?: "auto" | "light" | "dark";
            },
          ) => string;
          reset: (id?: string) => void;
          remove: (id?: string) => void;
        };
      };
      if (w.turnstile && tsContainer.current) {
        tsWidgetId.current = w.turnstile.render(tsContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t) => setTsToken(t),
          "error-callback": () => setTsToken(null),
          "expired-callback": () => setTsToken(null),
          size: "flexible",
          theme: "dark",
        });
        return;
      }
      if (tries++ < 40) setTimeout(tryRender, 250);
    };
    tryRender();
  }, []);

  function resetTurnstile() {
    const w = window as unknown as {
      turnstile?: { reset: (id?: string) => void };
    };
    if (tsWidgetId.current && w.turnstile) {
      try {
        w.turnstile.reset(tsWidgetId.current);
      } catch {
        /* noop */
      }
    }
    setTsToken(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!name || !email || !phone) return;
    if (!tsToken) {
      setStatus("err");
      setMsg("Bitte warte einen Moment — die Sicherheitsprüfung läuft noch.");
      return;
    }
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/ebook/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          turnstileToken: tsToken,
          pageUrl:
            typeof window !== "undefined" ? window.location.href : undefined,
        }),
      }).then((r) => r.json());
      if (res?.ok) {
        // Meta Pixel Lead event — client-side fires here on submit success.
        // Server-side CAPI can mirror this once META_CAPI_ACCESS_TOKEN is
        // provisioned; see the note in /api/ebook/subscribe/route.ts.
        try {
          window.fbq?.("track", "Lead", {
            content_name: "E-Book – Führungskräfte",
            content_category: "lead_magnet",
            value: 0,
            currency: "EUR",
          });
        } catch {
          /* pixel not loaded — ignore */
        }
        setStatus("ok");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        setStatus("err");
        setMsg(res?.reason ?? "Etwas ist schiefgelaufen.");
        resetTurnstile();
      }
    } catch {
      setStatus("err");
      setMsg("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  const inputCls =
    "w-full rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-3.5 font-body text-[15px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-purple-2/60";

  if (status === "ok") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[16px] border border-purple-2/40 bg-purple-2/[0.08] p-6 text-white">
        <div className="flex items-center gap-2 font-body text-[17px] font-semibold">
          <Check className="size-5 text-purple-2" />
          Check dein Postfach!
        </div>
        <p className="font-body text-[14px] leading-[1.55] text-white/70">
          Das E-Book ist unterwegs. Falls es in ein paar Minuten nicht ankommt,
          schau bitte kurz in den Spam-Ordner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      {/* Load Turnstile script once (harmless if the leitfaden page has
          already loaded it — Script dedupes by src). */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />

      <input
        className={inputCls}
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Vorname"
        autoComplete="given-name"
        aria-label="Vorname"
      />
      <input
        className={inputCls}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail-Adresse"
        autoComplete="email"
        aria-label="E-Mail-Adresse"
      />
      <input
        className={inputCls}
        type="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefonnummer"
        autoComplete="tel"
        pattern="[0-9+\s\-()]{6,}"
        title="Bitte gib eine gültige Telefonnummer ein."
        aria-label="Telefonnummer"
      />

      <div
        ref={tsContainer}
        className="min-h-[65px] w-full"
        aria-label="Sicherheitsprüfung"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gradient group mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-[12px] px-5 text-center text-black transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
      >
        <span className="font-body text-[15px] font-bold uppercase tracking-[0.6px] lg:text-[16px]">
          {status === "loading" ? "Wird gesendet…" : EBOOK_COPY.submitLabel}
        </span>
        <Download className="size-[20px] opacity-90 transition-transform group-hover:translate-y-0.5" />
      </button>

      {status === "err" && (
        <p className="font-body text-[13px] text-red-300">{msg}</p>
      )}
      <p className="text-center font-body text-[12px] text-white/45">
        {EBOOK_COPY.footerNote}{" "}
        <a
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-white/70"
        >
          Datenschutz
        </a>
      </p>
    </form>
  );
}
