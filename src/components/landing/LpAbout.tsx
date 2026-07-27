import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ABOUT, CTA_HREF, CTA_LABEL } from "@/lib/landing-pages";
import { Eyebrow, LP_SECTION, LpContainer, LpHeading, LpLead } from "./lp-ui";

/**
 * "Über Selmir" — Figma: 500×624 portrait, 53px gutter, 647px text column
 * vertically centred against the photo. Stats sit on one line each with a
 * 48px gutter, then the 500px-wide CTA.
 */
export default function LpAbout() {
  return (
    <section id="ueber" className={LP_SECTION}>
      <LpContainer>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[500px_minmax(0,1fr)] lg:gap-[53px]">
          <Reveal>
            <div className="relative aspect-[500/624] w-full overflow-hidden rounded-[20px] border border-white/[0.08]">
              <Image
                src={ABOUT.image}
                alt="Selmir Suljkanovic auf der Bühne"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Eyebrow line>{ABOUT.eyebrow}</Eyebrow>
            <LpHeading
              serif={ABOUT.headlineSerif}
              display={ABOUT.headlineDisplay}
              /* 46px, not the 50px section default — the design keeps this
                 headline on a single line inside the 647px column. */
              className="mt-5 lg:mt-[28px] lg:!text-[46px] lg:!leading-[57px] lg:!tracking-[-1.6px]"
            />
            <LpLead className="mt-4 lg:mt-[20px]">{ABOUT.body}</LpLead>

            {/* Sized to content, not thirds — the design keeps each value on
                its own line and lets the caption wrap underneath. */}
            <dl className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-10 lg:mt-[24px] lg:gap-[48px]">
              {ABOUT.stats.map((s) => (
                <div key={s.value} className="sm:max-w-[224px]">
                  <dt className="whitespace-nowrap font-display text-[22px] leading-[33px] tracking-[-0.5px] text-white lg:text-[26px]">
                    {s.value}
                  </dt>
                  <dd className="mt-1 font-body text-[13px] leading-[16px] text-white/50 lg:mt-[6px]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 lg:mt-[28px]">
              <Button
                href={CTA_HREF}
                icon={<CalendarDays className="size-5" strokeWidth={2} />}
                className="!h-14 !px-6 !text-[12px] sm:!px-8 md:!h-16 md:!text-[14px] lg:!w-[500px]"
              >
                {CTA_LABEL}
              </Button>
            </div>
          </Reveal>
        </div>
      </LpContainer>
    </section>
  );
}
