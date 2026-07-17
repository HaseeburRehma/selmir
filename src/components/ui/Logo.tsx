import Link from "next/link";

/** "Selmir" signature wordmark with SULJKANOVIC underline label. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="#top"
      aria-label="Selmir Suljkanovic — Startseite"
      className={`inline-flex select-none flex-col items-center leading-none ${className}`}
    >
      <span className="font-[family-name:var(--font-script)] text-[34px] leading-[0.8] text-white">
        Selmir
      </span>
      <span className="mt-0.5 font-label text-[9px] font-semibold uppercase tracking-[0.42em] text-white/80">
        Suljkanovic
      </span>
    </Link>
  );
}
