import { Reveal } from "@/components/ui/Reveal";
import TeamCarousel from "@/components/team/TeamCarousel";
import { TEAM } from "@/lib/team";
import { LpContainer, Eyebrow, LpHeading, LP_SECTION } from "./lp-ui";

/**
 * Landing-page variant of the team carousel. External LinkedIn links are
 * disabled here so the page keeps visitors in the funnel (on-page rule).
 */
export default function LpTeam() {
  return (
    <section id="team" className={`${LP_SECTION} overflow-hidden`}>
      <LpContainer>
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>Our Heart</Eyebrow>
          <LpHeading
            serif="Treffen Sie unsere Besten"
            display="Talentiertes Team"
            className="mt-4 lg:mt-[22px]"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 lg:mt-[64px]">
          <TeamCarousel members={TEAM} allowExternalLinks={false} />
        </Reveal>
      </LpContainer>
    </section>
  );
}
