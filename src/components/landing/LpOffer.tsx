import { Check, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { OFFER } from "@/lib/landing-pages";
import { Eyebrow, LP_SECTION, LpContainer, LpLead } from "./lp-ui";
import { LpLeadForm } from "./LpLeadForm";

const ASSURANCE_ICONS = [Check, Clock] as const;

/**
 * "Kostenlose Vertriebs-Potenzialanalyse".
 * Figma: 568px value column, 72px gutter, 560px form card.
 */
export default function LpOffer({ pageName }: { pageName: string }) {
  return (
    <section id="analyse" className={`scroll-mt-24 ${LP_SECTION}`}>
      <LpContainer>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[568px_minmax(0,1fr)] lg:gap-[72px]">
          <Reveal>
            <Eyebrow line>{OFFER.eyebrow}</Eyebrow>

            <h2 className="mt-5 text-balance font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] lg:mt-[28px] lg:text-[46px] lg:leading-[54.3px] lg:tracking-[-1.6px]">
              {OFFER.headlineSerif}{" "}
              <span className="font-display">{OFFER.headlineDisplay}</span>{" "}
              {OFFER.headlineSerifTail}
            </h2>

            <LpLead className="mt-4 lg:mt-[20px]">{OFFER.body}</LpLead>

            <ul className="mt-8 flex flex-col gap-6 lg:mt-[53px] lg:gap-[28px]">
              {OFFER.assurances.map((a, i) => {
                const Icon = ASSURANCE_ICONS[i];
                return (
                  <li key={a} className="flex items-start gap-[14px]">
                    <span
                      className={`grid size-[26px] shrink-0 place-items-center rounded-full ${
                        i === 0 ? "bg-purple-1" : "bg-purple-1/25"
                      }`}
                    >
                      <Icon
                        className={`size-[14px] ${
                          i === 0 ? "text-white" : "text-purple-2"
                        }`}
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="font-body text-[15px] leading-[23px] text-white/60 lg:text-[16px]">
                      {a}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <LpLeadForm pageName={pageName} />
          </Reveal>
        </div>
      </LpContainer>
    </section>
  );
}
