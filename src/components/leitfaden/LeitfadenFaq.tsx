"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/** Accordion FAQ — first item open by default (same pattern as LpFaq). */
export default function LeitfadenFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex w-full flex-col gap-3 lg:gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 0.04}>
            <div
              className={`overflow-hidden rounded-[14px] border transition-colors ${
                isOpen
                  ? "border-purple-2/30 bg-white/[0.035]"
                  : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-5 text-left lg:p-6"
              >
                <span className="flex-1 font-body text-[15px] font-semibold leading-[24px] tracking-[-0.2px] text-white lg:text-[17px]">
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
                  <p className="px-5 pb-5 pt-1 font-body text-[14px] leading-[22px] text-white/55 lg:px-6 lg:pb-6 lg:text-[15px]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
