"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, CalendarDays, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

/**
 * Seminar-Portfolio — exposed as the "Seminare" dropdown in the top
 * nav. Order matches the client's whiteboard (SMD → Elite Club).
 *
 * Item 1 links to the existing full page at /sales-mastery; items
 * 2–8 point to placeholder "In Bau" routes under /seminare/*.
 */
const SEMINARE = [
  { label: "Sales Mastery Days", href: "/sales-mastery" },
  { label: "SELL Day", href: "/seminare/sell-day" },
  { label: "Umsatz Booster", href: "/seminare/umsatz-booster" },
  { label: "Führung im Vertrieb", href: "/seminare/fuehrung-im-vertrieb" },
  { label: "Sales Academy", href: "/seminare/sales-academy" },
  { label: "Wachstums-Mentoring", href: "/seminare/wachstums-mentoring" },
  { label: "CEON", href: "/seminare/ceon" },
  { label: "Elite Club", href: "/seminare/elite-club" },
];

const LINKS = [
  { label: "Leistungen", href: "/#event" },
  { label: "Methode", href: "/#stories" },
  { label: "Case Studies", href: "/#cases" },
  { label: "Über", href: "/ueber" },
  { label: "Buch", href: "/buch" },
  { label: "Podcast", href: "/podcast" },
  { label: "Karriere", href: "/#footer" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [seminareOpen, setSeminareOpen] = useState(false);
  const [mobileSeminareOpen, setMobileSeminareOpen] = useState(false);
  const seminareRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the desktop Seminare dropdown when the user clicks outside
  // of it or presses Escape. Keeps keyboard focus predictable.
  useEffect(() => {
    if (!seminareOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!seminareRef.current) return;
      if (!seminareRef.current.contains(e.target as Node)) {
        setSeminareOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSeminareOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [seminareOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-[80px] items-center justify-between md:h-[96px]">
        <Logo />

        <ul className="hidden items-center gap-4 lg:flex xl:gap-7">
          {/* Seminare dropdown — sits first, matches the whiteboard order. */}
          <li
            ref={seminareRef}
            className="relative"
            onMouseEnter={() => setSeminareOpen(true)}
            onMouseLeave={() => setSeminareOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={seminareOpen}
              onClick={() => setSeminareOpen((v) => !v)}
              className="inline-flex items-center gap-1 font-body text-[15px] text-white/80 transition-colors hover:text-white"
            >
              Seminare
              <ChevronDown
                className={`size-4 transition-transform ${
                  seminareOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              role="menu"
              className={`absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-150 ${
                seminareOpen
                  ? "pointer-events-auto opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-1"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <ul className="py-2">
                  {SEMINARE.map((s) => (
                    <li key={s.label}>
                      <Link
                        role="menuitem"
                        href={s.href}
                        onClick={() => setSeminareOpen(false)}
                        className="block px-4 py-2.5 font-body text-[14px] text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          {LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="font-body text-[15px] text-white/80 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/betriebs-roentgen" className="!h-12 !px-4 !text-[11px] xl:!px-6 xl:!text-[13px]">
            Potenzialanalyse sichern
          </Button>
        </div>

        <button
          type="button"
          aria-label="Menü öffnen"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-bg/95 backdrop-blur-xl lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {/* Seminare accordion */}
            <li>
              <button
                type="button"
                aria-expanded={mobileSeminareOpen}
                onClick={() => setMobileSeminareOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-3 font-body text-base text-white/85 hover:bg-white/5"
              >
                <span>Seminare</span>
                <ChevronDown
                  className={`size-5 transition-transform ${
                    mobileSeminareOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileSeminareOpen && (
                <ul className="mb-1 ml-2 border-l border-white/10 pl-3">
                  {SEMINARE.map((s) => (
                    <li key={s.label}>
                      <Link
                        href={s.href}
                        onClick={() => {
                          setOpen(false);
                          setMobileSeminareOpen(false);
                        }}
                        className="block rounded-lg px-2 py-2.5 font-body text-[15px] text-white/75 hover:bg-white/5 hover:text-white"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 font-body text-base text-white/85 hover:bg-white/5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button href="/betriebs-roentgen" full icon={<CalendarDays className="size-5" />}>
                Potenzialanalyse sichern
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
