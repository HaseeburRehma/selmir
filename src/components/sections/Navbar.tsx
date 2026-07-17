"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, CalendarDays } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { label: "Leistungen", href: "#event" },
  { label: "Methode", href: "#stories" },
  { label: "Case Studies", href: "#cases" },
  { label: "Über", href: "#about" },
  { label: "Karriere", href: "#footer" },
  { label: "Kontakt", href: "#footer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <ul className="hidden items-center gap-8 lg:flex">
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
          <Button href="#tickets" className="h-12 px-6 text-[13px]">
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
              <Button href="#tickets" full icon={<CalendarDays className="size-5" />}>
                Potenzialanalyse sichern
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
