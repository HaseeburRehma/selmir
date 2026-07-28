import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

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

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-12 lg:flex-row lg:items-center lg:gap-[64px]">
        {/* Photo */}
        <Reveal className="w-full max-w-[440px] shrink-0">
          <div className="overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.04]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/figma/speakers/tolga-toker.jpg"
                alt="Tolga Toker — Deutschlands bester BMW Verkäufer"
                fill
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={0.1} className="w-full max-w-[680px]">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-3.5">
              <span className="h-0.5 w-10 bg-purple-2" />
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Gast Speaker
              </span>
            </div>

            <h2 className="font-serif text-[34px] leading-[1.15] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
              Deutschlands bester{" "}
              <span className="font-display">BMW Verkäufer</span>
            </h2>

            <p className="font-serif text-[22px] tracking-[-0.4px] text-white/85 md:text-[26px]">
              Tolga Toker
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
