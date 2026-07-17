import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type Case = {
  avatar: string;
  company: string;
  industry: string;
  before?: string;
  highlight: string;
  after?: string;
  desc: string;
};

const CASES: Case[] = [
  {
    avatar: "/figma/cases/avatar-1.png",
    company: "Meister Bau GmbH",
    industry: "Handwerk",
    before: "Von 80k auf ",
    highlight: "240k",
    after: " Umsatz in 9 Monaten",
    desc: "Planbarer Vertrieb statt Warten auf Empfehlungen.",
  },
  {
    avatar: "/figma/cases/avatar-2.png",
    company: "Nordlicht Agentur",
    industry: "Agentur",
    highlight: "3 neue Kunden",
    after: " pro Monat, ganz ohne Founder-Selling",
    desc: "Der Vertrieb läuft jetzt ohne den Gründer.",
  },
  {
    avatar: "/figma/cases/avatar-3.png",
    company: "Elbwerk Immobilien",
    industry: "Immobilien",
    before: "Vom Engpass zu ",
    highlight: "5 stabilen Standorten",
    desc: "Strukturen, die das Wachstum wirklich tragen.",
  },
];

export default function CaseStudiesSection() {
  return (
    <section id="cases" className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end lg:mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3.5">
              <span className="h-0.5 w-10 bg-purple-2" />
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Case Studies
              </span>
            </div>
            <h2 className="font-serif text-[32px] leading-[1.2] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
              <span className="font-display">Zahlen</span>, die für sich sprechen.
            </h2>
          </div>
          <a
            href="#tickets"
            className="flex items-center gap-2 font-body text-[15px] font-semibold tracking-[-0.2px] text-purple-2 transition-opacity hover:opacity-80"
          >
            Alle Erfolgsgeschichten
            <ChevronRight className="size-4" />
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.company} delay={i * 0.1}>
              <article className="flex h-full flex-col gap-[26px] rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-[34px] transition-colors duration-300 hover:border-purple-2/30">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={c.avatar}
                    alt={c.company}
                    width={46}
                    height={46}
                    className="size-[46px] rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1.5">
                    <p className="font-body text-[16px] font-semibold tracking-[-0.3px] text-white">
                      {c.company}
                    </p>
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[1.5px] text-purple-2">
                      {c.industry}
                    </p>
                  </div>
                </div>

                <p className="font-serif text-[25px] leading-[1.32] tracking-[-0.6px] text-white">
                  {c.before}
                  <span className="font-display text-purple-2">{c.highlight}</span>
                  {c.after}
                </p>

                <p className="font-body text-[15px] leading-[1.5] tracking-[-0.2px] text-white/60">
                  {c.desc}
                </p>

                <div className="mt-auto h-px w-full bg-white/[0.09]" />

                <a
                  href="#tickets"
                  className="flex items-center gap-2 font-body text-[14px] font-semibold tracking-[-0.2px] text-white/85 transition-colors hover:text-white"
                >
                  Case Study lesen
                  <ChevronRight className="size-4 text-purple-2" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
