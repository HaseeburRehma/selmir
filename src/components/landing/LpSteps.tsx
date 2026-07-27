import { Reveal } from "@/components/ui/Reveal";
import { STEPS } from "@/lib/landing-pages";
import { LP_SECTION, LpCard, LpContainer, LpSectionHeader } from "./lp-ui";

/** "In 3 Schritten — So läuft's ab". */
export default function LpSteps() {
  return (
    <section className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full">
          <LpSectionHeader
            eyebrow={STEPS.eyebrow}
            serif={STEPS.headlineSerif}
            display={STEPS.headlineDisplay}
          />
        </Reveal>

        <ul className="mt-12 grid w-full grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:mt-[76px]">
          {STEPS.cards.map((c, i) => (
            <Reveal key={c.title} as="li" delay={i * 0.07} className="h-full">
              <LpCard title={c.title} body={c.body} />
            </Reveal>
          ))}
        </ul>
      </LpContainer>
    </section>
  );
}
