import Link from "next/link";

/** Selmir Suljkanovic brand logo (white wordmark). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Selmir Suljkanovic — Startseite"
      className={`inline-flex select-none items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-red-dark.svg"
        alt="Selmir Suljkanovic"
        className="h-12 w-auto md:h-14"
      />
    </Link>
  );
}
