import { Reveal } from "@/components/ui/Reveal";
import { VideoCarousel } from "@/components/ui/VideoCarousel";

// 6 review / success-story videos
const REVIEW_VIDEOS = [
  "kMeN9SY_Ld4",
  "PDgj_f7vJu8",
  "89Mzx7TPlzQ",
  "Ok2j8LeBYW0",
  "3fLDRD6aezg",
  "cGuRQYDw_u4",
];

export default function StoriesSection() {
  return (
    <section id="stories" className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-14 lg:gap-[76px]">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            Erfolgsgeschichten
          </span>
          <h2 className="max-w-[1000px] font-serif text-[30px] leading-[1.18] tracking-[-1px] text-white md:text-[50px] md:tracking-[-1.8px]">
            6 Erfolgsgeschichten, die zeigen:{" "}
            <span className="font-display">
              Dein Vertrieb geht auch ohne dich.
            </span>
          </h2>
        </Reveal>

        <Reveal className="w-full">
          <VideoCarousel videoIds={REVIEW_VIDEOS} />
        </Reveal>
      </div>
    </section>
  );
}
