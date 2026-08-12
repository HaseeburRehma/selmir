import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The event's guest speakers. `claim` is the pitch line — its `display` half is
 * set in Days One, the same serif → display emphasis the section headlines use.
 */
const SPEAKERS = [
  {
    name: "Tolga Toker",
    claim: { serif: "Deutschlands bester", display: "BMW Verkäufer" },
    image: "/figma/speakers/tolga-toker.jpg",
    alt: "Tolga Toker — Deutschlands bester BMW Verkäufer",
  },
  {
    name: "Noah Geerkens",
    claim: { serif: "", display: "KI Spezialist & Handwerksunternehmer" },
    image: "/figma/speakers/noah-geerkens.jpg",
    alt: "Noah Geerkens — KI Spezialist & Handwerksunternehmer",
  },
  {
    name: "Arafat Alves",
    claim: { serif: "", display: "Spezialist für digitales Marketing" },
    image: "/figma/speakers/arafat-alves.jpg",
    alt: "Arafat Alves — Spezialist für digitales Marketing",
  },
];

export default function GastSpeakerSection() {
  return (
    <section id="gast-speaker" className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px]">
      {/* subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
        }}
      />
      {/* purple glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-purple-1/20 blur-[140px]"
      />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-14 lg:gap-[72px]">
        <Reveal className="flex items-center gap-3.5">
          <span className="h-0.5 w-10 bg-purple-2" />
          <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            Gast Speaker
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:gap-[64px]">
          {SPEAKERS.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 0.1}
              className="mx-auto flex w-full max-w-[400px] flex-col gap-7"
            >
              <div className="relative">
                {/* purple bloom behind the portrait */}
                <div
                  aria-hidden
                  className="absolute -inset-5 rounded-[28px] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(116,84,243,0.50)_0%,rgba(176,137,255,0.20)_45%,rgba(10,8,18,0)_80%)]"
                />
                <div className="relative overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.04]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 640px) 90vw, 400px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-[28px] leading-[1.15] tracking-[-0.9px] text-white md:text-[34px] md:tracking-[-1.1px]">
                  {s.claim.serif && `${s.claim.serif} `}
                  <span className="font-display">{s.claim.display}</span>
                </h2>

                <p className="font-serif text-[19px] tracking-[-0.4px] text-white/85 md:text-[22px]">
                  {s.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
