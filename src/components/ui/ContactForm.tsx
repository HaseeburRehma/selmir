"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-purple-2/60 focus:bg-white/[0.05]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // honeypot — bots fill hidden fields
    if (data.botcheck) return;

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Neue Kontaktanfrage von ${data.name || "Website"}`,
          from_name: "Sales Mastery Days — Kontaktformular",
          replyto: data.email,
          name: data.name,
          email: data.email,
          betreff: data.betreff,
          nachricht: data.nachricht,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(json.message || "Etwas ist schiefgelaufen.");
      }
    } catch {
      setStatus("error");
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[20px] border border-purple-2/25 bg-white/[0.03] p-10 text-center">
        <CheckCircle2 className="size-12 text-purple-2" />
        <h3 className="font-serif text-[24px] text-white">Nachricht gesendet!</h3>
        <p className="max-w-[360px] font-body text-[15px] leading-[1.6] text-white/60">
          Vielen Dank für deine Nachricht. Wir melden uns schnellstmöglich bei
          dir zurück.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 font-body text-[14px] font-semibold text-purple-2 hover:underline"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* honeypot */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-body text-[13px] font-semibold text-white/70">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            placeholder="Dein Name"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-body text-[13px] font-semibold text-white/70">
            E-Mail
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="name@beispiel.de"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-body text-[13px] font-semibold text-white/70">
          Betreff
        </span>
        <input
          name="betreff"
          type="text"
          required
          placeholder="Worum geht es?"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-body text-[13px] font-semibold text-white/70">
          Nachricht
        </span>
        <textarea
          name="nachricht"
          required
          rows={5}
          placeholder="Deine Nachricht an uns…"
          className={`${inputClass} resize-none`}
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
        className="btn-gradient group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-[8px] border-[0.5px] border-purple-2 px-6 font-label text-[14px] font-bold uppercase tracking-wide text-black shadow-[0_10px_40px_-12px_rgba(116,84,243,0.7)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Wird gesendet…" : "Nachricht senden"}
        <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
