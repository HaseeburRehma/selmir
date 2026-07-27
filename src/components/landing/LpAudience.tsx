import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AUDIENCE } from "@/lib/landing-pages";
import { LP_SECTION, LpContainer, LpSectionHeader } from "./lp-ui";

/**
 * "Klartext — Für wen das gedacht ist."
 * Figma card: 588×246, 40px padding, 22/28 title, list 52px below it,
 * rows 26px tall on a 44px pitch, 26px icon with a 14px gap to the 16/25 label.
 */
function Column({
  title,
  items,
  fit,
}: {
  title: string;
  items: string[];
  fit: boolean;
}) {
  return (
    <div className="h-full rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-7 md:p-9 lg:p-10">
      <h3 className="font-body text-[20px] font-semibold leading-[28px] tracking-[-0.3px] text-white lg:text-[22px]">
        {title}
      </h3>
      <ul className="mt-6 flex flex-col gap-[18px] lg:mt-[24px]">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-[14px]">
            <span
              className={`grid size-[26px] shrink-0 place-items-center rounded-full ${
                fit ? "bg-purple-1" : "bg-white/[0.09]"
              }`}
            >
              {fit ? (
                <Check className="size-[14px] text-white" strokeWidth={3} />
              ) : (
                <X className="size-[14px] text-white/45" strokeWidth={3} />
              )}
            </span>
            {/* −0.1px keeps each item on one line inside the design's 468px
                measure, as in Figma (Inter runs a hair wider than Blauer Nue). */}
            <span className="font-body text-[15px] leading-[25px] tracking-[-0.1px] text-white/70 lg:text-[16px]">
              {t}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LpAudience() {
  return (
    <section className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full">
          <LpSectionHeader
            eyebrow={AUDIENCE.eyebrow}
            line
            serif={AUDIENCE.headlineSerif}
            display={AUDIENCE.headlineDisplay}
          />
        </Reveal>

        <div className="mt-12 grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:mt-[56px]">
          <Reveal className="h-full">
            <Column title={AUDIENCE.fit.title} items={AUDIENCE.fit.items} fit />
          </Reveal>
          <Reveal className="h-full" delay={0.08}>
            <Column
              title={AUDIENCE.noFit.title}
              items={AUDIENCE.noFit.items}
              fit={false}
            />
          </Reveal>
        </div>
      </LpContainer>
    </section>
  );
}
