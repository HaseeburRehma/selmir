import { CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTA_HREF, FINAL_CTA } from "@/lib/landing-pages";
import { LpContainer } from "./lp-ui";

/**
 * Closing CTA card with the purple bloom bleeding in from the top.
 * Figma: 1200×572 card, badge at 96, 56/67 headline at 162, 16/28 body at 326,
 * 412×64 button at 412; section padding 80 top / 120 bottom.
 */
export default function LpFinalCta() {
  return (
    <section className="bg-bg pb-16 pt-4 md:pb-24 md:pt-12 lg:pb-[120px] lg:pt-[80px]">
      <LpContainer>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[24px] border border-white/[0.09] px-6 py-14 text-center md:px-12 md:py-20 lg:py-[96px]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-1/2 top-[-63%] h-[620px] w-[1000px] max-w-[130%] -translate-x-1/2 rounded-full bg-purple-1/45 blur-[90px]" />
              <div className="absolute left-1/2 top-[-35%] h-[360px] w-[560px] max-w-[90%] -translate-x-1/2 rounded-full bg-purple-2/35 blur-[80px]" />
            </div>

            <span className="inline-flex h-[36px] items-center gap-[10px] rounded-full border border-white/15 bg-white/[0.07] pl-3 pr-[18px] font-body text-[13px] leading-[17px] text-white backdrop-blur-sm">
              <span aria-hidden className="size-[18px] rounded-full bg-purple-2" />
              {FINAL_CTA.badge}
            </span>

            <h2 className="mx-auto mt-8 max-w-[700px] text-balance font-serif text-[32px] leading-[1.2] tracking-[-1px] text-white sm:text-[42px] md:text-[50px] lg:mt-[30px] lg:text-[56px] lg:leading-[67px] lg:tracking-[-1.8px]">
              {FINAL_CTA.headlineTop}{" "}
              <span className="text-white/45 sm:block">
                {FINAL_CTA.headlineBottom}
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-[600px] text-pretty font-body text-[15px] leading-[26px] text-white/60 lg:mt-[30px] lg:text-[16px] lg:leading-[28px]">
              {FINAL_CTA.body}
            </p>

            <div className="mt-9 lg:mt-[30px]">
              <Button
                href={CTA_HREF}
                icon={<CalendarDays className="size-5" strokeWidth={2} />}
                className="!h-14 !px-6 !text-[12px] sm:!px-8 md:!h-16 md:!text-[14px]"
              >
                {FINAL_CTA.cta}
              </Button>
            </div>
          </div>
        </Reveal>
      </LpContainer>
    </section>
  );
}
