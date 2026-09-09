"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { Check, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import {
  CORE_QUESTIONS,
  INDUSTRIES,
  INDUSTRY_QUESTIONS,
  KEY_FIGURE_WORDING,
  REAKTIONSZEIT_OPTIONS,
  type BetriebsRoentgenSubmit,
  type Industry,
  type Question,
} from "@/lib/betriebs-roentgen";

// Cloudflare Turnstile global — matches the shape declared by every
// other form component (must stay compatible; TS merges these).
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
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Der Betriebs-Röntgen — 6-stage client wizard.
 *
 *   0  Industry pick
 *   1  Key figures (revenue, employees, leads, deal value, close-rate,
 *      response time, weekly owner hours)
 *   2  Core diagnostic (3 questions, everyone)
 *   3  Industry diagnostic (2 questions for the picked industry)
 *   4  Teaser + name/e-mail/phone gate → POST /api/betriebs-roentgen/submit
 *   5  Confirmation screen (NO auto-report — human analyst calls back)
 *
 * Everything user-facing stays in German. All state lives inside this
 * component; submit is a single API call at stage 4 → 5.
 */

const STAGES = 6;

type CoreAnswers = Record<string, number | undefined>;

// ────────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────────

function parseNum(s: string): number | undefined {
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function formatWithDots(n: number | undefined): string {
  if (n === undefined) return "";
  return n.toLocaleString("de-DE");
}

// ────────────────────────────────────────────────────────────────
//  Sub-components
// ────────────────────────────────────────────────────────────────

function OptionCard({
  q,
  answered,
  onPick,
  indexLabel,
}: {
  q: Question;
  answered: number | undefined;
  onPick: (idx: number) => void;
  indexLabel: string;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 lg:p-7">
      <p className="mb-1 font-body text-[13px] font-semibold text-white/45">
        {indexLabel}
      </p>
      <h3 className="mb-1 font-body text-[17px] font-semibold leading-snug text-white lg:text-[18px]">
        {q.q}
      </h3>
      <p className="mb-4 font-body text-[13.5px] text-white/55">{q.hint}</p>
      <div className="flex flex-col gap-2">
        {q.opts.map((opt, i) => {
          const sel = answered === i;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onPick(i)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-body text-[14.5px] transition-colors ${
                sel
                  ? "border-purple-2 bg-purple-2/[0.14] text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-white/85 hover:border-purple-2/60"
              }`}
            >
              <span
                className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 ${
                  sel ? "border-purple-2 bg-purple-2" : "border-white/40"
                }`}
              >
                {sel && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Main
// ────────────────────────────────────────────────────────────────

export default function BetriebsRoentgenTool() {
  // ───── state ─────
  const [step, setStep] = useState(0);

  // Step 0
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [industryOther, setIndustryOther] = useState("");

  // Step 1 — key figures
  const [umsatz, setUmsatz] = useState<number | undefined>();
  const [mitarbeiter, setMitarbeiter] = useState<number | undefined>();
  const [anfragen, setAnfragen] = useState<number | undefined>();
  const [auftrag, setAuftrag] = useState<number | undefined>();
  const [quote, setQuote] = useState(3); // 0–10
  const [reaktion, setReaktion] = useState<string>(""); // one of REAKTIONSZEIT_OPTIONS labels
  // Wochenstunden slider dropped per v2 brief — no longer collected.

  // Step 2 — core
  const [coreAns, setCoreAns] = useState<CoreAnswers>({});

  // Step 3 — industry
  const [indAns, setIndAns] = useState<CoreAnswers>({});

  // Step 4 — gate
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // SMS verification state — mirrors LeitfadenForm's pattern.
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeErr, setCodeErr] = useState<string | null>(null);
  const [normalizedPhone, setNormalizedPhone] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  // "This browser already verified this number" — server rechecks the
  // HMAC on every submit, so this is purely for UX (skip the SMS card
  // entirely for returning visitors, pre-populate their phone).
  const cachedPhone = useReadVerifiedPhoneCookie();
  const [skipSms, setSkipSms] = useState(false);

  // Cloudflare Turnstile — invisible bot check gating the send-code
  // call so a script can't burn our Twilio budget.
  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsContainer = useRef<HTMLDivElement | null>(null);
  const tsWidgetId = useRef<string | null>(null);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ───── derived ─────
  const industryQ = useMemo(
    () => (industry ? INDUSTRY_QUESTIONS[industry] : []),
    [industry],
  );
  const wording = industry ? KEY_FIGURE_WORDING[industry] ?? {} : {};

  // Scroll to top on stage change so the visitor lands on the fresh heading.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Render the Turnstile widget once its script has loaded. Only
  // matters on Stage 4 (contact gate) — but mounting it here keeps
  // the flow identical whether the visitor lingers on other stages
  // first. `size: invisible` means CF auto-solves in the background
  // and only escalates to a visible challenge if it really has to.
  useEffect(() => {
    if (step !== 4 || skipSms) return;
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
        tsWidgetId.current = null;
      }
    };
  }, [step, skipSms]);

  // Resend cooldown: after send-code we lock the button for 60s so a
  // user can't spam Twilio (which would rack up real €).
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Returning visitor with a valid `sh_pv` cookie for a phone — pre-
  // populate the field and enable the skip path so the SMS UI never
  // renders. Server still re-verifies the HMAC before honouring it.
  useEffect(() => {
    if (cachedPhone && !phone) {
      setPhone(cachedPhone);
      setNormalizedPhone(cachedPhone);
      setSkipSms(true);
    }
  }, [cachedPhone, phone]);

  // If the visitor edits the phone away from the verified one, we
  // must re-verify — drop the skip path and clear any prior code
  // state so the user is walked through the SMS dance again.
  useEffect(() => {
    if (!skipSms) return;
    if (phone.trim() !== (normalizedPhone ?? "").trim()) {
      setSkipSms(false);
      setCode("");
      setCodeSent(false);
      setNormalizedPhone(null);
    }
  }, [phone, normalizedPhone, skipSms]);

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
    setCodeErr(null);
    if (!phone || phone.trim().length < 5) {
      setCodeErr("Bitte gib zuerst deine Telefonnummer ein.");
      return;
    }
    if (!tsToken) {
      setCodeErr(
        "Bitte warte einen Moment — die Sicherheitsprüfung läuft noch.",
      );
      return;
    }
    setSendingCode(true);
    try {
      const res = await fetch("/api/betriebs-roentgen/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, turnstileToken: tsToken }),
      }).then((r) => r.json());
      if (res?.ok) {
        setCodeSent(true);
        setNormalizedPhone(res.phone ?? phone);
        setResendIn(60);
      } else {
        setCodeErr(res?.reason ?? "SMS konnte nicht gesendet werden.");
        resetTurnstile();
      }
    } catch {
      setCodeErr("Netzwerkfehler. Bitte versuche es später erneut.");
    } finally {
      setSendingCode(false);
    }
  }

  // ───── stage guards ─────
  const canLeaveStage0 =
    industry !== null &&
    (industry !== "Sonstiges" || industryOther.trim().length > 0);
  const canLeaveStage2 = CORE_QUESTIONS.every(
    (q) => coreAns[q.key] !== undefined,
  );
  const canLeaveStage3 = industryQ.every((q) => indAns[q.key] !== undefined);
  const hasPhoneProof = skipSms || (codeSent && /^\d{4,10}$/.test(code));
  const canSubmit =
    firstName.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    phone.trim().length >= 5 &&
    hasPhoneProof;

  // ───── submit ─────
  const submit = async () => {
    if (!industry || !canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    const body: BetriebsRoentgenSubmit = {
      industry,
      industryOther:
        industry === "Sonstiges" ? industryOther.trim() : undefined,
      umsatz,
      mitarbeiter,
      anfragenMonat: anfragen,
      auftragWert: auftrag,
      abschlussquote: quote,
      reaktionszeit: reaktion,
      coreVertrieb:
        CORE_QUESTIONS[0].opts[coreAns[CORE_QUESTIONS[0].key] ?? 0].label,
      coreProzess:
        CORE_QUESTIONS[1].opts[coreAns[CORE_QUESTIONS[1].key] ?? 0].label,
      coreNachfassen:
        CORE_QUESTIONS[2].opts[coreAns[CORE_QUESTIONS[2].key] ?? 0].label,
      industryQ1: industryQ[0].opts[indAns[industryQ[0].key] ?? 0].label,
      industryQ2: industryQ[1].opts[indAns[industryQ[1].key] ?? 0].label,
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      email: email.trim().toLowerCase(),
      // Prefer the E.164 form Twilio approved on `send`; falls back
      // to the raw input for returning visitors whose cookie carried
      // the phone directly.
      phone: (normalizedPhone ?? phone).trim(),
      // Server ignores `code` when the cookie path succeeds.
      code: skipSms ? undefined : code.trim(),
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      const res = await fetch("/api/betriebs-roentgen/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json());
      if (res?.ok) {
        // Meta Pixel Lead event — same pattern as e-book / leitfaden.
        try {
          window.fbq?.("track", "Lead", {
            content_name: "Betriebs-Röntgen",
            content_category: "lead_tool",
            value: 0,
            currency: "EUR",
          });
        } catch {
          /* noop */
        }
        setStep(5);
      } else {
        setSubmitError(
          res?.reason ?? "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
        );
        // Cookie may have expired or been tampered with — drop the
        // skip path so the SMS card renders on the next attempt.
        if (skipSms) {
          setSkipSms(false);
          setNormalizedPhone(null);
        }
      }
    } catch {
      setSubmitError("Netzwerkfehler. Bitte versuche es später erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  // ───── render ─────
  const progressPct = (step / (STAGES - 1)) * 100;
  const stepLabels = [
    "Schritt 1 von 5",
    "Schritt 2 von 5",
    "Schritt 3 von 5",
    "Schritt 4 von 5",
    "Fast fertig",
    "Fertig",
  ];

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Sub-nav — real site logo + step indicator */}
      <div className="border-b border-white/10 bg-[#140C24]">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-5 py-2.5">
          <Logo />
          <div className="font-body text-[12px] font-medium text-white/70">
            {stepLabels[step]}
          </div>
        </div>
        {/* progress rail */}
        <div className="h-1 bg-[#1C1233]">
          <div
            className="h-full bg-gradient-to-r from-purple-2 to-[#A78BFA] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <main className="mx-auto max-w-[760px] px-5 py-10 md:py-14 lg:py-16">
        {/* ═════════════════ STAGE 0 — INDUSTRY ═════════════════ */}
        {step === 0 && (
          <section>
            <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Der Betriebs-Röntgen
            </p>
            <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Wo steht dein Betrieb{" "}
              <span className="font-body font-extrabold">wirklich?</span>
            </h1>
            <p className="mt-4 font-body text-[16px] leading-[1.6] text-white/80">
              In 3 Minuten röntgen wir deinen Betrieb – und zeigen dir schwarz
              auf weiß, wo dein Wachstum blockiert, wie viel Umsatz du gerade
              verschenkst und was dich vom nächsten Level trennt.
            </p>
            <div className="mt-5 rounded-r-lg border-l-[3px] border-purple-2 bg-white/[0.03] p-4 font-body text-[13.5px] leading-[1.6] text-white/80">
              <strong className="text-white">Kein 08/15-Rechner.</strong> Unser
              Algorithmus wurde auf Basis der Betriebe entwickelt, die wir
              selbst skaliert haben. Er verrechnet deine Kennzahlen und
              Antworten mit den Mustern erfolgreicher Betriebe – und erstellt
              daraus dein individuelles Röntgenbild.
            </div>

            <p className="mt-8 font-body text-[13px] font-semibold text-white/60">
              Zuerst: In welcher Branche bist du?
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INDUSTRIES.map((ind) => {
                const sel = industry === ind.id;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setIndustry(ind.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 font-body text-[14px] font-semibold transition-all ${
                      sel
                        ? "border-purple-2 bg-purple-2 text-white shadow-[0_10px_30px_-10px_rgba(124,92,255,0.6)]"
                        : "border-white/[0.10] bg-white/[0.03] text-white/85 hover:-translate-y-0.5 hover:border-purple-2 hover:shadow-[0_12px_30px_-14px_rgba(124,92,255,0.5)]"
                    }`}
                  >
                    <span className="text-[22px]">{ind.icon}</span>
                    {ind.label}
                  </button>
                );
              })}
            </div>

            {industry === "Sonstiges" && (
              <div className="mt-4 flex flex-col gap-1.5">
                <label className="font-body text-[13px] font-semibold text-white/75">
                  Welche Branche genau?
                </label>
                <input
                  type="text"
                  value={industryOther}
                  onChange={(e) => setIndustryOther(e.target.value)}
                  placeholder="z. B. Fotografie-Studio"
                  className="rounded-xl border border-white/[0.10] bg-[#140C24] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/40 outline-none focus:border-purple-2/70"
                />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <PrimaryBtn onClick={() => setStep(1)} disabled={!canLeaveStage0}>
                Weiter →
              </PrimaryBtn>
            </div>
          </section>
        )}

        {/* ═════════════════ STAGE 1 — KEY FIGURES ═════════════════ */}
        {step === 1 && (
          <section>
            <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Deine Kennzahlen
            </p>
            <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Die harten <span className="font-body font-extrabold">Zahlen.</span>
            </h1>
            <p className="mt-3 font-body text-[16px] text-white/75">
              Grobe Schätzungen reichen völlig – der Algorithmus rechnet mit
              Bandbreiten.
            </p>

            {/* four number inputs */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumField
                  label="Jahresumsatz (€)"
                  placeholder="z. B. 800.000"
                  value={umsatz}
                  onChange={setUmsatz}
                />
                <NumField
                  label="Mitarbeiter (inkl. dir)"
                  placeholder="z. B. 6"
                  value={mitarbeiter}
                  onChange={setMitarbeiter}
                />
                <NumField
                  label={wording.anfragen ?? "Anfragen / Leads pro Monat"}
                  placeholder="z. B. 40"
                  value={anfragen}
                  onChange={setAnfragen}
                />
                <NumField
                  label={wording.auftrag ?? "Ø Auftragswert (€)"}
                  placeholder="z. B. 12.000"
                  value={auftrag}
                  onChange={setAuftrag}
                />
              </div>
            </div>

            {/* Abschlussquote */}
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="font-body text-[17px] font-semibold text-white">
                Abschlussquote
              </h3>
              <p className="mb-4 mt-1 font-body text-[13.5px] text-white/55">
                Von 10 ernsthaften Anfragen – wie viele werden am Ende Kunde?
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={quote}
                  onChange={(e) => setQuote(Number(e.target.value))}
                  className="flex-1 accent-purple-2"
                />
                <span className="min-w-[80px] text-right font-serif text-[22px] font-semibold text-[#A78BFA]">
                  {quote} von 10
                </span>
              </div>
            </div>

            {/* Reaktionszeit — heading + sub-line both come from the
                industry wording map so Immobilien reads "Interessenten"
                everywhere (previously the heading said "Interessenten"
                but the sub-line still said "Anfrage"). */}
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="font-body text-[17px] font-semibold text-white">
                {wording.reaktion ?? "Reaktionszeit auf neue Anfragen"}
              </h3>
              <p className="mb-4 mt-1 font-body text-[13.5px] text-white/55">
                {wording.reaktionSub ??
                  "Wie schnell meldet sich jemand bei einer neuen Anfrage?"}
              </p>
              <div className="flex flex-col gap-2">
                {REAKTIONSZEIT_OPTIONS.map((opt) => {
                  const sel = reaktion === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setReaktion(opt.label)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-body text-[14.5px] transition-colors ${
                        sel
                          ? "border-purple-2 bg-purple-2/[0.14] text-white"
                          : "border-white/[0.08] bg-white/[0.02] text-white/85 hover:border-purple-2/60"
                      }`}
                    >
                      <span
                        className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 ${
                          sel ? "border-purple-2 bg-purple-2" : "border-white/40"
                        }`}
                      >
                        {sel && (
                          <span className="size-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wochenstunden slider removed per v2 brief — it wasn't
                core to the diagnosis and inflated the perceived length
                of Step 1. Result-logic doesn't reference it anymore. */}

            <div className="mt-8 flex justify-between gap-4">
              <GhostBtn onClick={() => setStep(0)}>← Zurück</GhostBtn>
              <PrimaryBtn onClick={() => setStep(2)} disabled={!reaktion}>
                Weiter →
              </PrimaryBtn>
            </div>
          </section>
        )}

        {/* ═════════════════ STAGE 2 — CORE DIAGNOSTIC ═════════════════ */}
        {step === 2 && (
          <section>
            <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Diagnose · Teil 1
            </p>
            <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Wie läuft dein Betrieb –{" "}
              <span className="font-body font-extrabold">ehrlich?</span>
            </h1>
            <p className="mt-3 font-body text-[16px] text-white/75">
              Diese Fragen bekommt jeder gestellt. Antworte so ehrlich wie
              möglich – nur dann stimmt das Röntgenbild.
            </p>

            <div className="mt-6">
              {CORE_QUESTIONS.map((q, i) => (
                <OptionCard
                  key={q.key}
                  q={q}
                  answered={coreAns[q.key]}
                  onPick={(idx) => setCoreAns({ ...coreAns, [q.key]: idx })}
                  indexLabel={`Frage ${i + 1} von ${CORE_QUESTIONS.length}`}
                />
              ))}
            </div>

            <div className="mt-2 flex justify-between gap-4">
              <GhostBtn onClick={() => setStep(1)}>← Zurück</GhostBtn>
              <PrimaryBtn onClick={() => setStep(3)} disabled={!canLeaveStage2}>
                Weiter →
              </PrimaryBtn>
            </div>
          </section>
        )}

        {/* ═════════════════ STAGE 3 — INDUSTRY DIAGNOSTIC ═════════════════ */}
        {step === 3 && industry && (
          <section>
            <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Diagnose · Teil 2
            </p>
            <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Speziell für{" "}
              <span className="font-body font-extrabold">
                {industry === "Sonstiges" && industryOther
                  ? industryOther
                  : INDUSTRIES.find((i) => i.id === industry)?.label ?? industry}
                .
              </span>
            </h1>
            <p className="mt-3 font-body text-[16px] text-white/75">
              Diese Fragen sind auf deine Branche zugeschnitten – hier trennt
              sich die Spitze vom Durchschnitt.
            </p>

            <div className="mt-6">
              {industryQ.map((q, i) => (
                <OptionCard
                  key={q.key}
                  q={q}
                  answered={indAns[q.key]}
                  onPick={(idx) => setIndAns({ ...indAns, [q.key]: idx })}
                  indexLabel={`Frage ${i + 1} von ${industryQ.length}`}
                />
              ))}
            </div>

            <div className="mt-2 flex justify-between gap-4">
              <GhostBtn onClick={() => setStep(2)}>← Zurück</GhostBtn>
              <PrimaryBtn onClick={() => setStep(4)} disabled={!canLeaveStage3}>
                Röntgenbild erstellen →
              </PrimaryBtn>
            </div>
          </section>
        )}

        {/* ═════════════════ STAGE 4 — TEASER + GATE ═════════════════ */}
        {step === 4 && (
          <section>
            <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Dein Röntgenbild ist fertig
            </p>
            <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Wir haben{" "}
              <span className="font-body font-extrabold">
                3 kritische Befunde.
              </span>
            </h1>
            <p className="mt-3 font-body text-[16px] text-white/75">
              Der Algorithmus hat deine Zahlen gegen die Muster skalierter
              Betriebe gerechnet. Das kam dabei raus:
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <TeaserFinding
                bar="#F0556B"
                title="Umsatz-Leck erkannt"
                sub="Du verschenkst aktuell rund …"
              />
              <TeaserFinding
                bar="#F0B24B"
                title="Größter Engpass"
                sub="Deine kritischste Stelle im Ablauf …"
              />
              <TeaserFinding
                bar="#7C5CFF"
                title="Dein Betriebs-Typ"
                sub="So tickt dein Betrieb aktuell …"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_50px_-24px_rgba(74,21,53,0.4)]">
              <h3 className="font-body text-[18px] font-bold text-white">
                Dein vollständiges Röntgenbild
              </h3>
              <p className="mb-4 mt-1 font-body text-[13.5px] text-white/55">
                Wohin sollen wir deine persönliche Analyse schicken?
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  label="Vorname *"
                  placeholder="Dein Vorname"
                  value={firstName}
                  onChange={setFirstName}
                  autoComplete="given-name"
                />
                <TextField
                  label="Nachname"
                  placeholder="Optional"
                  value={lastName}
                  onChange={setLastName}
                  autoComplete="family-name"
                />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  label="E-Mail *"
                  placeholder="name@firma.de"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  autoComplete="email"
                />
                <TextField
                  label="Telefon *"
                  placeholder="+49 …"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  autoComplete="tel"
                />
              </div>

              {/* SMS-Verifikation — nur wenn der Besucher nicht schon
                  auf einem anderen Lead-Magnet verifiziert ist. Der
                  Cookie-Skip lässt „skipSms=true" die Karte komplett
                  überspringen. */}
              {!skipSms && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="font-body text-[13px] leading-[1.5] text-white/70">
                    Zur Sicherheit prüfen wir deine Nummer per SMS-Code —
                    so vermeiden wir Fake-Anfragen und rufen dich
                    wirklich zurück.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto]">
                    <TextField
                      label="SMS-Code *"
                      placeholder="6-stelliger Code"
                      value={code}
                      onChange={setCode}
                      type="tel"
                      autoComplete="one-time-code"
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={onSendCode}
                        disabled={
                          sendingCode ||
                          resendIn > 0 ||
                          phone.trim().length < 5
                        }
                        className="h-[46px] rounded-[10px] border border-purple-2/40 bg-purple-2/[0.12] px-4 font-body text-[13.5px] font-semibold text-white transition-colors hover:bg-purple-2/[0.20] disabled:pointer-events-none disabled:opacity-50"
                      >
                        {sendingCode
                          ? "Wird gesendet …"
                          : resendIn > 0
                            ? `Erneut in ${resendIn}s`
                            : codeSent
                              ? "Code erneut senden"
                              : "SMS-Code senden"}
                      </button>
                    </div>
                  </div>
                  {codeSent && !codeErr && (
                    <p className="mt-2 font-body text-[12.5px] text-emerald-300/90">
                      Code gesendet an {normalizedPhone ?? phone}. Bitte
                      hier eintragen.
                    </p>
                  )}
                  {codeErr && (
                    <p className="mt-2 font-body text-[12.5px] text-red-300">
                      {codeErr}
                    </p>
                  )}
                  {/* Invisible Turnstile — Cloudflare mounts here and
                      auto-solves in the background. */}
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    strategy="afterInteractive"
                    async
                    defer
                  />
                  <div ref={tsContainer} aria-hidden className="hidden" />
                </div>
              )}

              {submitError && (
                <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/[0.06] px-3 py-2 font-body text-[13.5px] text-red-200">
                  {submitError}
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="btn-gradient mt-5 w-full rounded-[10px] px-6 py-4 font-body text-[15px] font-bold text-black transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting
                  ? "Wird gesendet …"
                  : "Röntgenbild jetzt freischalten"}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 font-body text-[12.5px] text-white/55">
                <Lock className="size-3.5" />
                Deine Daten sind sicher. Kein Spam.
              </div>
            </div>

            <div className="mt-4 flex justify-start">
              <GhostBtn onClick={() => setStep(3)}>← Zurück</GhostBtn>
            </div>
          </section>
        )}

        {/* ═════════════════ STAGE 5 — CONFIRMATION ═════════════════ */}
        {step === 5 && (
          <section className="py-8 text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-purple-2/15">
              <Check className="size-10 text-purple-2" strokeWidth={2.5} />
            </div>
            <p className="mt-6 font-body text-[12px] font-bold uppercase tracking-[3px] text-purple-2/90">
              Danke, {firstName}!
            </p>
            <h1 className="mt-3 font-serif text-[30px] leading-[1.15] tracking-[-0.4px] text-white sm:text-[36px] lg:text-[42px]">
              Wir bereiten dein{" "}
              <span className="font-body font-extrabold">Röntgenbild vor.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[540px] font-body text-[16px] leading-[1.65] text-white/80">
              Unser Team analysiert deine Antworten jetzt persönlich – kein
              Autopilot, kein Standard-PDF. Wir melden uns in Kürze unter der
              angegebenen Nummer bei dir.
            </p>
            <div className="mx-auto mt-8 max-w-[420px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left">
              <p className="font-body text-[12px] font-semibold uppercase tracking-[2px] text-purple-2/90">
                Zusammenfassung
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 font-body text-[14px] text-white/75">
                <li>
                  <span className="text-white/50">Branche:</span>{" "}
                  {industry === "Sonstiges" && industryOther
                    ? industryOther
                    : INDUSTRIES.find((i) => i.id === industry)?.label}
                </li>
                <li>
                  <span className="text-white/50">Kontakt:</span> {email}
                </li>
                <li>
                  <span className="text-white/50">Telefon:</span> {phone}
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Small UI primitives kept inline to keep the file self-contained
// ────────────────────────────────────────────────────────────────

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-gradient rounded-[10px] px-6 py-3.5 font-body text-[15px] font-bold text-black transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-3 font-body text-[15px] font-semibold text-white/55 transition-colors hover:text-white"
    >
      {children}
    </button>
  );
}

function NumField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[13px] font-semibold text-white/75">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={formatWithDots(value)}
        onChange={(e) => onChange(parseNum(e.target.value))}
        placeholder={placeholder}
        className="rounded-xl border border-white/[0.10] bg-[#140C24] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/40 outline-none focus:border-purple-2/70"
      />
    </div>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (s: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[13px] font-semibold text-white/75">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-xl border border-white/[0.10] bg-[#140C24] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/40 outline-none focus:border-purple-2/70"
      />
    </div>
  );
}

function TeaserFinding({
  bar,
  title,
  sub,
}: {
  bar: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 pl-5">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: bar }}
      />
      <div className="flex-1">
        <b className="block font-body text-[15px] font-semibold text-white">
          {title}
        </b>
        <span className="font-body text-[13px] text-white/55">{sub}</span>
      </div>
      <span className="select-none font-serif text-[18px] font-semibold text-white/25 blur-[6px]">
        ● ● ●
      </span>
    </div>
  );
}

/**
 * Read the `sh_pv` cookie the server sets on a successful verify,
 * decode just the phone hint, and expose it to the wizard. Server
 * rechecks the HMAC on every submit — this hook is purely for UX
 * (pre-populate the field, skip the SMS card).
 *
 * Mirrors the same hook in LeitfadenForm/EbookForm/WhitepaperForm so
 * a visitor who verified on any of them skips SMS here too.
 */
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
