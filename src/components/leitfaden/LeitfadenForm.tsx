"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Check, Download, MessageSquare, ShieldCheck } from "lucide-react";
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
 *
 * Two-step SMS verification flow:
 *   1. User fills name + phone + email → clicks "SMS-Code senden"
 *        → POST /api/leitfaden/phone/send-code {phone, turnstileToken}
 *        → Twilio Verify sends a 6-digit code
 *   2. User types the 6-digit code → clicks "Leitfaden sichern"
 *        → POST /api/leitfaden/subscribe {name, phone, email, code}
 *        → Twilio approves the code, HubSpot upserts, Resend delivers the PDF.
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
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [msg, setMsg] = useState<string | null>(null);

  // SMS-verify state
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0); // seconds until user may re-send

  // Cloudflare Turnstile bot-check token. Used only on the send-code call;
  // the subscribe call is protected by the Twilio approval instead.
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

  // Resend cooldown: after send-code we lock the button for 60s so a user
  // can't spam Twilio and burn our budget.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function resetTurnstile() {
    if (tsWidgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(tsWidgetId.current);
      } catch {
        /* noop */
      }
    }
    setTsToken(null);
  }

  async function onSendCode() {
    if (sendingCode) return;
    if (!phone) {
      setStatus("err");
      setMsg("Bitte gib deine Telefonnummer ein.");
      return;
    }
    if (!tsToken) {
      setStatus("err");
      setMsg("Bitte warte einen Moment — die Sicherheitsprüfung läuft noch.");
      return;
    }
    setSendingCode(true);
    setStatus("idle");
    setMsg(null);
    try {
      const res = await fetch("/api/leitfaden/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, turnstileToken: tsToken }),
      }).then((r) => r.json());
      if (res?.ok) {
        setCodeSent(true);
        setNormalizedPhone(res.phone ?? phone);
        setResendIn(60);
        setMsg(null);
      } else {
        setStatus("err");
        setMsg(res?.reason ?? "SMS konnte nicht gesendet werden.");
        // Reset turnstile so the next attempt has a fresh token.
        resetTurnstile();
      }
    } catch {
      setStatus("err");
      setMsg("Netzwerkfehler. Bitte versuche es später erneut.");
    } finally {
      setSendingCode(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!email) return;
    if (!codeSent) {
      setStatus("err");
      setMsg(
        "Bitte fordere zuerst den SMS-Code an und trage ihn dann hier ein.",
      );
      return;
    }
    if (!/^\d{4,10}$/.test(code)) {
      setStatus("err");
      setMsg("Bitte gib den 6-stelligen SMS-Code ein.");
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
          phone: normalizedPhone ?? phone,
          email,
          code,
        }),
      }).then((r) => r.json());
      if (res?.ok) {
        setStatus("ok");
        setName("");
        setPhone("");
        setEmail("");
        setCode("");
      } else {
        setStatus("err");
        setMsg(res?.reason ?? "Etwas ist schiefgelaufen.");
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

  const sendCodeLabel = sendingCode
    ? "Wird gesendet…"
    : codeSent
      ? resendIn > 0
        ? `Erneut senden in ${resendIn}s`
        : "Code erneut senden"
      : "SMS-Code senden";

  const canSendCode = !!phone && !!tsToken && !sendingCode && resendIn === 0;

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
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputCls + " sm:flex-1"}
              type="tel"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                // Editing the phone invalidates any previously issued code.
                if (codeSent) {
                  setCodeSent(false);
                  setCode("");
                  setNormalizedPhone(null);
                }
              }}
              placeholder={phonePlaceholder}
              autoComplete="tel"
              pattern="[0-9+\s\-()]{6,}"
              title="Bitte gib eine gültige Telefonnummer ein."
            />
            <button
              type="button"
              onClick={onSendCode}
              disabled={!canSendCode}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-purple-2/40 bg-purple-2/[0.14] px-4 font-body text-[13.5px] font-semibold text-white transition-colors hover:bg-purple-2/[0.22] disabled:pointer-events-none disabled:opacity-50 sm:h-auto"
            >
              <MessageSquare className="size-4" />
              {sendCodeLabel}
            </button>
          </div>
          {codeSent && normalizedPhone && (
            <span className="font-body text-[12px] text-white/50">
              Code gesendet an{" "}
              <span className="font-semibold text-white/75">
                {normalizedPhone}
              </span>
              . Trag ihn unten ein.
            </span>
          )}
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
      {codeSent && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-white/75">
            SMS-Code <span className="text-purple-2">*</span>
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-purple-2/80" />
            <input
              className={inputCls + " pl-10 tracking-[0.4em]"}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="123456"
              maxLength={10}
            />
          </div>
        </div>
      )}
    </>
  );

  const Submit = (
    <button
      type="submit"
      disabled={status === "loading" || !codeSent}
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
