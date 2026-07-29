import Link from "next/link";

/**
 * Selmir Suljkanovic brand logo (red gradient wordmark).
 * `href` defaults to the homepage; landing pages pass "#top" so the logo
 * scrolls to the top instead of leaving the conversion page.
 */
export function Logo({
  className = "",
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Selmir Suljkanovic"
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
