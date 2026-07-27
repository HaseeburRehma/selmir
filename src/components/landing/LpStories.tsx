import { Reveal } from "@/components/ui/Reveal";
import { VideoCarousel } from "@/components/ui/VideoCarousel";
import { STORIES } from "@/lib/landing-pages";
import { LP_SECTION, LpContainer, LpSectionHeader } from "./lp-ui";

/** "Erfolgsgeschichten" — the six customer video testimonials. */
export default function LpStories() {
  return (
    <section id="stories" className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full">
          <LpSectionHeader
            eyebrow={STORIES.eyebrow}
            serif={STORIES.headlineSerif}
            display={STORIES.headlineDisplay}
          />
        </Reveal>

        <Reveal className="mt-12 w-full lg:mt-[76px]" delay={0.08}>
          <VideoCarousel videoIds={STORIES.videoIds} />
        </Reveal>
      </LpContainer>
    </section>
  );
}
