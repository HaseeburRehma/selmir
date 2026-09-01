"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Check, Download, MessageSquare, ShieldCheck } from "lucide-react";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import { HERO } from "@/lib/ebook";

/**
 * E-Book subscribe form — same 2-step SMS-verify UX as LeitfadenForm.
 *
 * Flow:
 *   1. User fills Vorname / Telefon / E-Mail, clicks "SMS-Code senden"
 *      → POST /api/leitfaden/phone/send-code (generic — same endpoint
 *        the leitfaden form uses; it just sends an SMS regardless of
 *        which form triggered it)
 *   2. User types the 6-digit code, clicks "E-Book kostenlos sichern"
 *      → POST /api/ebook/subscribe {name, phone, email, code}
 *      → Twilio approves the code, HubSpot list 816 upsert, Google
 *        Sheet2 row, Resend delivers the PDF.
 *
 * Returning visitors with a valid `sh_pv` cookie (set by any prior
 * successful verify on either form) skip the SMS UI entirely.
 */

declare global {
  interface Window {
    // Same shape as the declaration in src/components/leitfaden/LeitfadenForm.tsx
    // — TypeScript merges the two into one Window definition so they must
    // match exactly (including the optional `appearance` field).
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
    fbq?: (...args: unknown[]) => void;
  }
}

export default function EbookForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [resendIn, setResendIn] = useState(0);

  // Skip-SMS cookie — same helper used by LeitfadenForm.
  const cachedPhone = useReadVerifiedPhoneCookie();
  const [skipSms, setSkipSms] = useState(false);

  // Cloudflare Turnstile token — only needed for /send-code; subscribe
  // is protected by the Twilio approval instead.
  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsContainer = useRef<HTMLDivElement | null>(null);
  const tsWidgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const tryRender = () => {
      if (cancelled || tsWidgetId.current) return;
      if (window.turnstile && tsContainer.current) {
        tsWidgetId.current = window.turnstile.render(tsContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setTsToken(token),
          "error-callback": () => setTsToken(null),
          "expired-callback": () => setTsToken(null),
          // Invisible mode — no visible widget / Cloudflare banner.
          // See LeitfadenForm.tsx for the same choice.
          size: "invisible",
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

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (cachedPhone && !phone) {
      setPhone(cachedPhone);
      setNormalizedPhone(cachedPhone);
      setSkipSms(true);
    }
  }, [cachedPhone, phone]);

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
    if (!name || !email || !phone) return;

    if (!skipSms) {
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
    }

    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/ebook/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          lastName,
          phone: normalizedPhone ?? phone,
          email,
          code: skipSms ? undefined : code,
          pageUrl:
            typeof window !== "undefined" ? window.location.href : undefined,
        }),
      }).then((r) => r.json());
      if (res?.ok) {
        // Meta Pixel Lead event — same pattern as other LPs.
        try {
          window.fbq?.("track", "Lead", {
            content_name: "E-Book – Führungskräfte",
            content_category: "lead_magnet",
            value: 0,
            currency: "EUR",
          });
        } catch {
          /* noop */
        }
        setStatus("ok");
        setName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setCode("");
      } else {
        setStatus("err");
        setMsg(res?.reason ?? "Etwas ist schiefgelaufen.");
        if (skipSms) setSkipSms(false);
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
          Das E-Book ist unterwegs. Wenn es in ein paar Minuten nicht ankommt,
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

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />

      {/* Vorname + Nachname — same row on ≥sm, stack on mobile.
          Nachname is optional per client request; we keep it separate
          from Vorname so HubSpot's `firstname` / `lastname` fields map
          cleanly instead of guessing a split from a single string. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            placeholder="Max"
            autoComplete="given-name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-white/75">
            Nachname{" "}
            <span className="font-normal text-white/45">(optional)</span>
          </label>
          <input
            className={inputCls}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Mustermann"
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Telefon + SMS-Code senden button */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-[13px] font-semibold text-white/75">
          Telefon <span className="text-purple-2">*</span>
        </label>
        <div className={skipSms ? "" : "flex flex-col gap-2 sm:flex-row"}>
          <input
            className={inputCls + (skipSms ? "" : " sm:flex-1")}
            type="tel"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              // Editing the phone invalidates any previously issued code /
              // cookie skip so the flow can't be spoofed.
              if (codeSent) {
                setCodeSent(false);
                setCode("");
                setNormalizedPhone(null);
              }
              if (skipSms) setSkipSms(false);
            }}
            placeholder="+49 151 23456789"
            autoComplete="tel"
            pattern="[0-9+\s\-()]{6,}"
            title="Bitte gib eine gültige Telefonnummer ein."
          />
          {!skipSms && (
            <button
              type="button"
              onClick={onSendCode}
              disabled={!canSendCode}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-purple-2/40 bg-purple-2/[0.14] px-4 font-body text-[13.5px] font-semibold text-white transition-colors hover:bg-purple-2/[0.22] disabled:pointer-events-none disabled:opacity-50 sm:h-auto"
            >
              <MessageSquare className="size-4" />
              {sendCodeLabel}
            </button>
          )}
        </div>
        {skipSms && (
          <span className="inline-flex items-center gap-1.5 font-body text-[12px] text-purple-2">
            <ShieldCheck className="size-3.5" />
            Diese Nummer ist bereits verifiziert — keine SMS nötig.
          </span>
        )}
        {codeSent && !skipSms && normalizedPhone && (
          <span className="font-body text-[12px] text-white/50">
            Code gesendet an{" "}
            <span className="font-semibold text-white/75">{normalizedPhone}</span>
            . Trag ihn unten ein.
          </span>
        )}
      </div>

      {/* E-Mail */}
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
          placeholder="name@firma.de"
          autoComplete="email"
        />
      </div>

      {/* SMS-Code input — only after send-code succeeds */}
      {codeSent && !skipSms && (
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

      {/* Invisible Turnstile — no visible UI. Kept in the tree so CF
          has a mount point if it needs to render a challenge modal. */}
      {!skipSms && <div ref={tsContainer} aria-hidden className="hidden" />}

      <button
        type="submit"
        disabled={status === "loading" || (!codeSent && !skipSms)}
        className="btn-gradient group flex h-14 w-full items-center justify-center gap-2 rounded-[10px] px-5 text-center text-black transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
      >
        <span className="font-body text-[15px] font-bold uppercase tracking-[0.6px] lg:text-[16px]">
          {status === "loading" ? "Wird gesendet…" : HERO.submitLabel}
        </span>
        <Download className="size-[20px] opacity-90 transition-transform group-hover:translate-y-0.5" />
      </button>

      {status === "err" && (
        <p className="font-body text-[13px] text-red-300">{msg}</p>
      )}
      <p className="font-body text-[12px] text-white/40">
        Kein Spam. Jederzeit abbestellbar.{" "}
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

/** Read the `sh_pv` cookie (set by any prior successful verify) so
 *  returning visitors skip the SMS UI. Same helper as LeitfadenForm. */
function useReadVerifiedPhoneCookie(): string | null {
  const [phone, setPhone] = useState<string | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const raw = document.cookie
      .split(/;\s*/)
      .find((c) => c.startsWith("sh_pv="));
    if (!raw) return;
    const value = raw.slice("sh_pv=".length);
    const parts = value.split(".");
    if (parts.length !== 3) return;
    const [phoneB64, expiresStr] = parts;
    const expires = Number(expiresStr);
    if (!Number.isFinite(expires) || expires < Date.now()) return;
    try {
      const pad =
        phoneB64.length % 4 === 0 ? "" : "=".repeat(4 - (phoneB64.length % 4));
      const decoded = atob(
        (phoneB64 + pad).replace(/-/g, "+").replace(/_/g, "/"),
      );
      setPhone(decoded);
    } catch {
      /* ignore malformed cookie */
    }
  }, []);
  return phone;
}
