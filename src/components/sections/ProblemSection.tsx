"use client";

import { Reveal } from "@/components/ui/Reveal";

export default function ProblemSection() {
  return (
    <section id="problem" className="relative overflow-hidden bg-bg py-24 md:py-32">
      {/* Subtle radial purple glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[520px] w-[820px] rounded-full bg-purple-1 opacity-[0.13] blur-[120px]" />
      </div>

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <div className="mb-10 inline-flex items-center rounded-full border border-purple-1/40 bg-purple-1/10 px-4 py-1.5 md:mb-14">
            <span className="font-label text-[11px] uppercase tracking-[0.2em] text-purple-2">
              Das Problem
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="max-w-[900px] font-serif text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.3] tracking-[-0.01em] text-grey/70">
            <span className="text-white">Du machst Umsatz.</span>{" "}
            <span className="text-purple-2">Aber du machst ihn selbst.</span>{" "}
            Jeder gute Monat hängt an dir. Jeder neue Auftrag, jede neue Anfrage,
            jeder neue Kunde.{" "}
            <span className="text-white">Alles läuft über dich.</span> Das ist
            kein Wachstum.{" "}
            <span className="text-purple-2">
              Das ist ein Engpass mit Briefkopf.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
