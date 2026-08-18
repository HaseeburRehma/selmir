"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Check, Download } from "lucide-react";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";

/**
 * Cloudflare Turnstile — invisible bot check. When the widget renders,
 * Cloudflare either auto-solves it in the background or shows the tiny
 * managed challenge. On success it calls the global callback we register
 * with the widget's data-callback attribute.
 *
 * The widget's script exposes a `window.turnstile` API — see
 * https://developers.cloudflare.com/turnstile/ for the full surface.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          size?: "normal" | "compact" | "flexible" | "invisible";
          theme?: "auto" | "light" | "dark";
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    __turnstileOnLoad?: () => void;
  }
}

/**
 * Shared subscribe form for the /leitfaden page.
 * POSTs { name, email } to /api/leitfaden/subscribe which:
 *   – upserts the contact in HubSpot into list 793,
 *   – sends the PDF via Resend to the submitter.
 */
export default function LeitfadenForm({
  variant = "hero",
  submitLabel = "Leitfaden jetzt zuschicken",
  showFirstName = true,
  showPhone = false,
  firstNamePlaceholder = "Max",
  emailPlaceholder = "name@firma.de",
  phonePlaceholder = "+49 151 23456789",
}: {
  /** hero = single-line, full-width; full = boxed card with header. */
  variant?: "hero" | "full";
  submitLabel?: string;
  showFirstName?: boolean;
  showPhone?: boolean;
  firstNamePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [msg, setMsg] = useState<string | null>(null);

  // Cloudflare Turnstile bot-check token. The widget writes here when it
  // solves; we resend the same token to the API and it re-verifies with
  // Cloudflare's siteverify endpoint.
  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsContainer = useRef<HTMLDivElement | null>(null);
  const tsWidgetId = useRef<string | null>(null);

  // Render the widget once the script has loaded (retried a few times
  // because the script tag is `strategy=afterInteractive` and may still
  // be evaluating when this effect first runs).
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const tryRender = () => {
      if (cancelled || tsWidgetId.current) return;
      if (window.turnstile && tsContainer.current) {
        tsWidgetId.current = window.turnstile.render(tsContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTsToken(token),
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
    return () => {
      cancelled = true;
      if (tsWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(tsWidgetId.current);
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    if (!tsToken) {
      setStatus("err");
      setMsg(
        "Bitte warte einen Moment — die Sicherheitsprüfung läuft noch.",
      );
      return;
    }
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/leitfaden/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          turnstileToken: tsToken,
        }),
      }).then((r) => r.json());
      if (res?.ok) {
        setStatus("ok");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        setStatus("err");
        setMsg(res?.reason ?? "Etwas ist schiefgelaufen.");
        // Ask Cloudflare to re-issue a fresh token so the next submit works.
        if (tsWidgetId.current && window.turnstile) {
          try {
            window.turnstile.reset(tsWidgetId.current);
          } catch {
            /* noop */
          }
        }
        setTsToken(null);
      }
    } catch {
      setStatus("err");
      setMsg("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  const inputCls =
    "w-full rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-purple-2/60";

  if (status === "ok") {
    return (
      <div className="flex flex-col items-start gap-2 rounded-[14px] border border-purple-2/30 bg-purple-2/[0.06] p-5 text-white">
        <div className="flex items-center gap-2 font-body text-[16px] font-semibold">
          <Check className="size-5 text-purple-2" />
          Check dein Postfach!
        </div>
        <p className="font-body text-[14px] leading-[1.55] text-white/70">
          Die PDF ist unterwegs. Wenn sie in ein paar Minuten nicht ankommt,
          schau bitte in den Spam-Ordner.
        </p>
      </div>
    );
  }

  const Fields = (
    <>
      {showFirstName && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-white/75">
            Vorname <span className="text-purple-2">*</span>
          </label>
          <input
            className={inputCls}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={firstNamePlaceholder}
            autoComplete="given-name"
          />
        </div>
      )}
      {showPhone && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-white/75">
            Telefon <span className="text-purple-2">*</span>
          </label>
          <input
            className={inputCls}
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={phonePlaceholder}
            autoComplete="tel"
            pattern="[0-9+\s\-()]{6,}"
            title="Bitte gib eine gültige Telefonnummer ein."
          />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-[13px] font-semibold text-white/75">
          E-Mail <span className="text-purple-2">*</span>
        </label>
        <input
          className={inputCls}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          autoComplete="email"
        />
      </div>
    </>
  );

  const Submit = (
    <button
      type="submit"
      disabled={status === "loading"}
      className="btn-gradient group flex h-14 w-full items-center justify-center gap-2 rounded-[10px] px-5 text-center text-black transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
    >
      <span className="font-body text-[15px] font-bold uppercase tracking-[0.6px] lg:text-[16px]">
        {status === "loading" ? "Wird gesendet…" : submitLabel}
      </span>
      <Download className="size-[20px] opacity-90 transition-transform group-hover:translate-y-0.5" />
    </button>
  );

  // Cloudflare Turnstile widget slot + loader script — reused in both
  // form variants below.
  const TurnstileWidget = (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
      <div
        ref={tsContainer}
        className="min-h-[65px] w-full"
        aria-label="Sicherheitsprüfung"
      />
    </>
  );

  if (variant === "hero") {
    return (
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        {Fields}
        {TurnstileWidget}
        {Submit}
        {status === "err" && (
          <p className="font-body text-[13px] text-red-300">{msg}</p>
        )}
        <p className="font-body text-[12px] text-white/40">
          Deine Daten sind sicher. Kein Spam.
        </p>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-5 rounded-[18px] border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-body text-[20px] font-semibold text-white lg:text-[22px]">
          PDF gratis sichern
        </h3>
        <p className="font-body text-[14px] leading-[1.55] text-white/60">
          Trag dich ein — die PDF landet sofort in deinem Postfach.
        </p>
      </div>
      {Fields}
      {TurnstileWidget}
      {Submit}
      {status === "err" && (
        <p className="font-body text-[13px] text-red-300">{msg}</p>
      )}
      <p className="text-center font-body text-[12px] text-white/40">
        Deine Daten sind sicher. Kein Spam.
      </p>
    </form>
  );
}
