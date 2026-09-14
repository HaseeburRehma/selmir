"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays, CheckCircle2 } from "lucide-react";
import { captureAttribution, readAttribution } from "@/lib/attribution";

type Status = "idle" | "submitting" | "success" | "error";

// Same visual language as LpLeadForm — 54px inputs, 12px radius,
// 14px labels above with an 8px gap.
const inputClass =
  "h-[54px] w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-4 font-body text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-2/60 focus:bg-white/[0.05]";

const labelClass = "font-body text-[14px] leading-[17px] text-white/75";

interface LpLeadFormPainpointsProps {
  /** Optional compact variant for the hero-right slot (smaller paddings). */
  compact?: boolean;
  /**
   * Shown inside the card. Both hero + offer instances share the same
   * title, so a single default suffices. Overridable if a future ad set
   * wants a different phrasing.
   */
  title?: string;
  note?: string;
}

/**
 * Handwerker-Painpoints lead form — Vorname / Nachname / Telefon / E-Mail.
 *
 * Submits to /api/lp/handwerker-painpoints, which upserts the contact in
 * HubSpot (email dedup) and adds it to the campaign's segment list.
 * Also fires the Meta Pixel `Lead` event client-side so ad attribution
 * lands in Ads Manager immediately; server-side CAPI runs in the API
 * route when META_CAPI_ACCESS_TOKEN is set.
 */
export function LpLeadFormPainpoints({
  compact = false,
  title = "Jetzt Analyse sichern",
  note = "Kein Spam. 100 % unverbindlich.",
}: LpLeadFormPainpointsProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Remember the ad click that brought this visitor here.
  useEffect(() => {
    captureAttribution();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (data.botcheck) return; // honeypot

    setStatus("submitting");
    setError("");

    const pageUrl =
      typeof window !== "undefined" ? window.location.href : "";

    try {
      const res = await fetch("/api/lp/handwerker-painpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vorname: data.vorname,
          nachname: data.nachname,
          telefon: data.telefon,
          email: data.email,
          pageUrl,
          attribution: readAttribution(),
        }),
      })
        .then((r) => r.json())
        .catch(() => ({ ok: false }));

      if (res?.ok) {
        // Meta Pixel Lead — client-side event so the browser-side pixel
        // records the conversion immediately. Server-side CAPI (in the
        // API route) is the dedupe-safe backup for iOS / ad blockers.
        if (typeof window !== "undefined") {
          const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void })
            .fbq;
          if (typeof fbq === "function") {
            fbq("track", "Lead", {
              content_name: "Handwerk Erstgespräch – Potenzialanalyse",
              content_category: "Landingpage",
            });
          }
        }
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("error");
      setError(res?.reason || "Etwas ist schiefgelaufen.");
    } catch {
      setStatus("error");
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  const cardPadding = compact ? "p-6 md:p-7" : "p-6 md:p-8 lg:p-9";
  const successMinH = compact ? "min-h-[420px]" : "min-h-[420px] lg:min-h-[560px]";

  if (status === "success") {
    return (
      <div
        className={`flex ${successMinH} flex-col items-center justify-center gap-4 rounded-[20px] border border-purple-2/25 bg-white/[0.03] p-10 text-center`}
      >
        <CheckCircle2 className="size-12 text-purple-2" />
        <h3 className="font-serif text-[24px] text-white">Anfrage ist raus!</h3>
        <p className="max-w-[360px] font-body text-[15px] leading-[26px] text-white/60">
          Danke dir. Wir melden uns zeitnah telefonisch und schauen gemeinsam
          auf die 3 größten Hebel in deinem Betrieb.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[20px] border border-purple-2/25 bg-white/[0.02] shadow-[0_40px_120px_-60px_rgba(116,84,243,0.9)] ${cardPadding}`}
    >
      <span className="inline-flex h-[28px] items-center gap-[8px] rounded-full border border-purple-2/40 bg-purple-1/15 px-3 font-body text-[11px] font-semibold uppercase tracking-[1.2px] text-purple-2">
        <span aria-hidden className="size-[8px] rounded-full bg-purple-2" />
        Kostenlose Potenzialanalyse
      </span>
      <h3 className="mt-4 font-body text-[20px] font-semibold leading-[27px] tracking-[-0.3px] text-white">
        {title}
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-[16px]">
        {/* honeypot */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>
              Vorname <span className="text-purple-2">*</span>
            </span>
            <input
              name="vorname"
              type="text"
              required
              autoComplete="given-name"
              placeholder="Max"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>
              Nachname <span className="text-purple-2">*</span>
            </span>
            <input
              name="nachname"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Mustermann"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Telefon <span className="text-purple-2">*</span>
          </span>
          <input
            name="telefon"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+49 170 1234567"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            E-Mail <span className="text-purple-2">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="max@musterbau.de"
            className={inputClass}
          />
        </label>

        {status === "error" && (
          <p className="flex items-center gap-2 font-body text-[14px] text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-gradient group relative mt-[8px] inline-flex h-16 items-center justify-center gap-2 overflow-hidden rounded-[6px] border-[0.5px] border-purple-2 px-6 font-label text-[12px] font-bold uppercase tracking-wide text-black shadow-[0_10px_40px_-12px_rgba(116,84,243,0.7)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 md:text-[14px]"
        >
          <span className="relative z-10">
            {status === "submitting" ? "Wird gesendet…" : "Potenzialanalyse sichern"}
          </span>
          <CalendarDays className="relative z-10 size-5" strokeWidth={2} />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[6px]"
          >
            <span className="absolute left-0 top-1/2 h-[130%] w-10 -translate-y-1/2 bg-white/70 blur-[16px] mix-blend-plus-lighter animate-shine" />
          </span>
        </button>

        <p className="text-center font-body text-[12px] leading-[19px] text-white/40 lg:text-[13px]">
          {note}
        </p>
      </form>
    </div>
  );
}
