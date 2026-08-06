import { Reveal } from "@/components/ui/Reveal";
import TeamCarousel from "@/components/team/TeamCarousel";
import { TEAM } from "@/lib/team";
import { LpContainer, Eyebrow, LP_SECTION } from "./lp-ui";

/**
 * Landing-page variant of the team carousel. LinkedIn links open in a new tab
 * (target=_blank) so the LP itself is not left. Heading uses two display
 * highlights (Menschen + Wachstum), so it inlines the h2 instead of using the
 * single-span `LpHeading` primitive.
 */
export default function LpTeam() {
  return (
    <section id="team" className={`${LP_SECTION} overflow-hidden`}>
      <LpContainer>
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>Unser Team</Eyebrow>
          <h2 className="mt-4 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:mt-[22px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.8px]">
            Die <span className="font-display">Menschen</span> hinter deinem{" "}
            <span className="font-display">Wachstum</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 lg:mt-[64px]">
          <TeamCarousel members={TEAM} allowExternalLinks />
        </Reveal>
      </LpContainer>
    </section>
  );
}
