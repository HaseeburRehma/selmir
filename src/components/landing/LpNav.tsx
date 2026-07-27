"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CTA_HREF } from "@/lib/landing-pages";

/**
 * Landing-page header. The Figma nav hides the site menu on these pages
 * (`Menu - Pages` is set to hidden) — a conversion page keeps exactly one exit:
 * the CTA.
 */
export default function LpNav() {
  const [scrolled, setScrolled] = useState(false);

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
      <nav className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:h-[96px] md:px-12">
        <Logo />
        <Button
          href={CTA_HREF}
          className="!h-11 !px-4 !text-[10.5px] sm:!h-12 sm:!px-5 sm:!text-[12px] md:!h-16 md:!px-7 md:!text-[14px]"
        >
          <span className="sm:hidden">Analyse sichern</span>
          <span className="hidden sm:inline">Potenzialanalyse sichern</span>
        </Button>
      </nav>
    </header>
  );
}
