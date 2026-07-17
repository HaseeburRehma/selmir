import Link from "next/link";

/** Selmir Suljkanovic brand logo (white wordmark). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="#top"
      aria-label="Selmir Suljkanovic — Startseite"
      className={`inline-flex select-none items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Selmir Suljkanovic"
        className="h-10 w-auto md:h-11"
      />
    </Link>
  );
}
