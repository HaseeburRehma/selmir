"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FAQS } from "@/lib/landing-pages";
import { LpHeading, Eyebrow } from "./lp-ui";

/**
 * "FAQs — Was du noch wissen musst". First item is open, as in the design.
 * Figma: 1280-wide list (80px page margin), 30px item padding, 16px gaps,
 * 20/26 questions and 16/26 answers; section padding 96 top / 112 bottom.
 */
export default function LpFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-bg pb-16 pt-16 md:pb-20 md:pt-24 lg:pb-[112px] lg:pt-[96px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-[80px]">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>FAQs</Eyebrow>
          <LpHeading
            serif="Was du noch"
            display="wissen musst"
            className="mt-4 text-center lg:mt-[22px]"
          />
        </Reveal>

        <div className="mt-10 flex w-full flex-col gap-4 lg:mt-[64px] lg:gap-[16px]">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-[16px] border transition-colors ${
                    isOpen
                      ? "border-purple-2/30 bg-white/[0.035]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-6 text-left lg:p-[30px]"
                  >
                    <span className="flex-1 font-body text-[16px] font-semibold leading-[26px] tracking-[-0.2px] text-white lg:text-[20px]">
                      {item.q}
                    </span>
                    <span className="grid size-5 shrink-0 place-items-center text-purple-2">
                      {isOpen ? (
                        <Minus className="size-5" />
                      ) : (
                        <Plus className="size-5" />
                      )}
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div
                      className={`overflow-hidden transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <p className="px-6 pb-6 pt-[22px] font-body text-[15px] leading-[26px] text-white/50 lg:px-[30px] lg:pb-[30px] lg:pt-0 lg:text-[16px]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
