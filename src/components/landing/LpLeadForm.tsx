"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays, CheckCircle2 } from "lucide-react";
import { OFFER } from "@/lib/landing-pages";
import { captureAttribution, readAttribution } from "@/lib/attribution";

// Web3Forms access keys are public by design (client-side, spam-protected by
// Web3Forms). One key = one recipient on the free plan, so we submit once per
// inbox — same setup as the site-wide contact form.
const ACCESS_KEYS = [
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
    "65a97f92-403e-415e-b686-a721097a8368",
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY_2 ??
    "42fa7773-555f-40c9-9afb-a17a8049df7c",
].filter((k) => k && !k.startsWith("REPLACE"));

type Status = "idle" | "submitting" | "success" | "error";

// Figma: 54px inputs, 16px inner padding, 14px labels above with an 8px gap.
const inputClass =
  "h-[54px] w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-4 font-body text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-2/60 focus:bg-white/[0.05]";

const labelClass = "font-body text-[14px] leading-[17px] text-white/75";

/**
 * "Jetzt Analyse anfordern" — the lead form from the Figma offer section.
 * The hidden Jahresumsatz / Mitarbeiterzahl / Gewerk layers stay out: the
 * design ships the short version (Name, Telefon, Firma, Entscheider).
 */
export function LpLeadForm({ pageName }: { pageName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [decider, setDecider] = useState<"Ja" | "Nein">("Ja");

  // Remember the ad click that brought this visitor here, before they navigate.
  useEffect(() => {
    captureAttribution();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // honeypot — bots fill hidden fields
    if (data.botcheck) return;

    setStatus("submitting");
    setError("");

    const pageUrl =
      typeof window !== "undefined" ? window.location.href : "";

    // Web3Forms payload — used as a fallback until RESEND_API_KEY is live.
    // Once Resend is configured in prod it becomes redundant, but leaving it
    // in means a form submission is never lost during the transition.
    const web3Payload = {
      subject: `Neue Potenzialanalyse-Anfrage von ${data.name || "Website"}`,
      from_name: "Selmir Suljkanovic — Potenzialanalyse",
      Kurzhinweis: `Neue Potenzialanalyse-Anfrage über die Landingpage "${pageName}". Details unten.`,
      Name: data.name,
      Telefonnummer: data.telefon,
      "Firma / Betrieb": data.firma,
      "Inhaber / Entscheider": decider,
      Landingpage: pageName,
    };

    // Primary: our own /api/notify/lead (Resend). Sends a genuine German
    // e-mail to both info@sh-wachstum.de and info@tylotech.de.
    const notify = fetch("/api/notify/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        telefon: data.telefon,
        firma: data.firma,
        entscheider: decider,
        landingpage: pageName,
        pageUrl,
      }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }));

    // CRM write runs in parallel; its outcome is logged, never surfaced.
    const hubspot = fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        phone: data.telefon,
        company: data.firma,
        decisionMaker: decider,
        landingPage: pageName,
        pageUrl,
        attribution: readAttribution(),
      }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }));

    try {
      // Wait for Resend first — if it succeeds, we're done.
      const notifyRes = await notify;
      void hubspot.then((res) => {
        if (!res?.ok) console.warn("[lead] CRM sync did not complete", res);
      });

      if (notifyRes?.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      // Resend not configured yet (or transient failure) — fall back to
      // Web3Forms so the lead still reaches the inboxes.
      const results = await Promise.allSettled(
        ACCESS_KEYS.map((access_key) =>
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ access_key, ...web3Payload }),
          }).then((r) => r.json()),
        ),
      );
      const anySuccess = results.some(
        (r) => r.status === "fulfilled" && r.value?.success,
      );
      const firstError = results.find(
        (r) => r.status === "fulfilled" && !r.value?.success,
      );

      if (anySuccess) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        const msg =
          firstError?.status === "fulfilled"
            ? firstError.value?.message
            : undefined;
        setError(msg || "Etwas ist schiefgelaufen.");
      }
    } catch {
      setStatus("error");
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[20px] border border-purple-2/25 bg-white/[0.03] p-10 text-center lg:min-h-[687px]">
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
    <div className="rounded-[20px] border border-purple-2/25 bg-white/[0.02] p-6 shadow-[0_40px_120px_-60px_rgba(116,84,243,0.9)] md:p-8 lg:p-9">
      <h3 className="font-body text-[20px] font-semibold leading-[27px] tracking-[-0.3px] text-white">
        {OFFER.form.title}
      </h3>
      <p className="mt-2 font-body text-[14px] leading-[21px] text-white/45 lg:text-[15px]">
        {OFFER.form.note}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-[18px]">
        {/* honeypot */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Name <span className="text-purple-2">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Max Mustermann"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Telefonnummer <span className="text-purple-2">*</span>
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
            Firma / Betrieb <span className="text-purple-2">*</span>
          </span>
          <input
            name="firma"
            type="text"
            required
            autoComplete="organization"
            placeholder="Musterbau GmbH"
            className={inputClass}
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className={labelClass}>Bist du Inhaber / Entscheider?</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["Ja", "Nein"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDecider(v)}
                aria-pressed={decider === v}
                className={`h-[50px] rounded-[12px] border font-body text-[15px] transition-colors ${
                  decider === v
                    ? "border-purple-2/60 bg-purple-1/20 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>

        {status === "error" && (
          <p className="flex items-center gap-2 font-body text-[14px] text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-gradient group relative mt-[24px] inline-flex h-16 items-center justify-center gap-2 overflow-hidden rounded-[6px] border-[0.5px] border-purple-2 px-6 font-label text-[12px] font-bold uppercase tracking-wide text-black shadow-[0_10px_40px_-12px_rgba(116,84,243,0.7)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 md:text-[14px]"
        >
          <span className="relative z-10">
            {status === "submitting" ? "Wird gesendet…" : OFFER.form.submit}
          </span>
          <CalendarDays className="relative z-10 size-5" strokeWidth={2} />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[6px]"
          >
            <span className="absolute left-0 top-1/2 h-[130%] w-10 -translate-y-1/2 bg-white/70 blur-[16px] mix-blend-plus-lighter animate-shine" />
          </span>
        </button>

        <p className="text-center font-body text-[12px] leading-[19px] text-white/35 lg:text-[13px]">
          {OFFER.form.consent}
        </p>
      </form>
    </div>
  );
}
