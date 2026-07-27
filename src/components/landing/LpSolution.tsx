import { Reveal } from "@/components/ui/Reveal";
import { SOLUTION } from "@/lib/landing-pages";
import { LP_SECTION, LpCard, LpContainer, LpSectionHeader } from "./lp-ui";

/** "Die Lösung" — the mechanism, plus the three pillars it rests on. */
export default function LpSolution() {
  return (
    <section id="methode" className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full">
          <LpSectionHeader
            eyebrow={SOLUTION.eyebrow}
            serif={SOLUTION.headlineSerif}
            display={SOLUTION.headlineDisplay}
            body={SOLUTION.body}
            headingClassName="max-w-[820px]"
          />
        </Reveal>

        <ul className="mt-12 grid w-full grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:mt-[76px] lg:gap-6">
          {SOLUTION.cards.map((c, i) => (
            <Reveal key={c.title} as="li" delay={i * 0.07} className="h-full">
              <LpCard title={c.title} body={c.body} />
            </Reveal>
          ))}
        </ul>
      </LpContainer>
    </section>
  );
}
