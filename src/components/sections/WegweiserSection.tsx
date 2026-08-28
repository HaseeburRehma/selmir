import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Wegweiser — Dein Einstieg in systematisierten Erfolg"
 * (Figma node 3723:2875).
 *
 * Four numbered pillar cards on a dark section — each links to a
 * different area of the site. The number sits in a large purple
 * display font, the pillar title in serif, and a short body.
 */

const PILLARS = [
  {
    n: "01",
    title: "Über Selmir",
    body:
      "Die Reise vom Kriegsflüchtling zum Wachstumsmentor — Werte, Prinzipien und Haltung, die dieses Umfeld tragen.",
    href: "/ueber",
  },
  {
    n: "02",
    title: "Vision",
    body:
      "Visionen werden Wirklichkeit: klare Führung, strukturierte Prozesse und ein Umfeld, das immer gewinnt.",
    href: "/#leistungen",
  },
  {
    n: "03",
    title: "Leistungen",
    body:
      "Vertrieb, Persönlichkeitsentwicklung, Wachstumsmentoring und Seminare – alles aus einer Hand.",
    href: "#leistungen",
  },
  {
    n: "04",
    title: "Karriere",
    body:
      "Werde Teil eines Teams, das Menschen genauso konsequent entwickelt wie Zahlen.",
    href: "#footer",
  },
];

export default function WegweiserSection() {
  return (
    <section
      id="wegweiser"
      className="relative bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[120px]"
    >
      <div className="container-page relative">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            <span
              aria-hidden
              className="h-[2px] w-10 rounded-full bg-purple-2"
            />
            Wegweiser
          </span>
          <h2 className="max-w-[960px] text-[32px] leading-[1.12] tracking-[-1px] text-white md:text-[46px] lg:text-[56px] lg:tracking-[-1.8px]">
            <span className="font-serif italic font-normal">Dein Einstieg in</span>{" "}
            <span className="font-body font-extrabold tracking-[-1.5px]">
              systematisierten Erfolg.
            </span>
          </h2>
          <p className="max-w-[720px] font-body text-[15.5px] leading-[1.6] text-white/60 md:text-[16.5px]">
            Vier Wege, ein Ziel: Klarheit, Struktur und planbares Wachstum für
            dich und dein Unternehmen.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:mt-[72px] lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.n}
              delay={i * 0.06}
              className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-purple-2/50 hover:bg-white/[0.04] lg:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(116,84,243,0.16)_0%,rgba(10,8,18,0)_75%)]"
              />
              <span className="relative font-body font-extrabold text-[44px] leading-none tracking-[-2px] text-purple-2 lg:text-[54px]">
                {p.n}
              </span>
              <h3 className="relative font-serif italic text-[24px] leading-[1.2] tracking-[-0.6px] text-white lg:text-[28px]">
                {p.title}
              </h3>
              <p className="relative font-body text-[14.5px] leading-[1.55] text-white/60 lg:text-[15px]">
                {p.body}
              </p>
              <Link
                href={p.href}
                className="relative mt-auto inline-flex items-center gap-2 font-body text-[14px] font-semibold text-purple-2 transition-colors hover:text-white"
              >
                Mehr erfahren
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
