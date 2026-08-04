import { Reveal } from "@/components/ui/Reveal";
import TeamCarousel from "@/components/team/TeamCarousel";
import { TEAM } from "@/lib/team";

/**
 * "OUR HEART — Talentiertes Team": the hover-slider team carousel from Figma
 * (node 3409:2325). Homepage variant keeps the members' LinkedIn links live.
 */
export default function TeamSection() {
  return (
    <section
      id="team"
      className="overflow-hidden bg-bg px-6 py-20 md:px-12 md:py-28 lg:px-[120px] lg:py-[120px]"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-12 flex flex-col items-center gap-5 text-center lg:mb-16">
          <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            Our Heart
          </span>
          <h2 className="max-w-[900px] font-serif text-[32px] leading-[1.18] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
            Treffen Sie unsere Besten{" "}
            <span className="font-display">Talentiertes Team</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <TeamCarousel members={TEAM} />
        </Reveal>
      </div>
    </section>
  );
}
