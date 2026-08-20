import { Reveal } from "@/components/ui/Reveal";
import { VideoCarousel } from "@/components/ui/VideoCarousel";

// 11 client success-story videos — order matches the canonical list
// Selmir sent 2026-08-20 (WhatsApp: SH Wachstumsgesellschaft mbH).
const REVIEW_VIDEOS = [
  "kMeN9SY_Ld4", // Kadir Göksu
  "3fLDRD6aezg", // Sarah Larissa Bruns
  "cGuRQYDw_u4", // Leolo Zinser
  "PDgj_f7vJu8", // Ahmet Möhür
  "89Mzx7TPlzQ", // Dominik Langerbein
  "Ok2j8LeBYW0", // Denis Alihodzic
  "4Th7wYBG-PQ", // Christian Mihm
  "w44_J-GGM7g", // Tim Segler
  "Xl7wb2rs_FI", // Vanessa Selbach
  "NIbQDPuY7nw", // Roland Compte
  "9_OKA9X5D4Y", // Ciddik Cosic
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
            11 Erfolgsgeschichten, die zeigen:{" "}
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
