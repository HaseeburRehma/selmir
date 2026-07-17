import Image from "next/image";
import { Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const VIDEOS = [
  { src: "/figma/stories/video-1.jpg", name: "Meister Bau GmbH" },
  { src: "/figma/stories/video-2.jpg", name: "Nordlicht Agentur" },
  { src: "/figma/stories/video-3.jpg", name: "Elbwerk Immobilien" },
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

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.1}>
              <div className="group rounded-2xl border-[1px] border-purple-2/50 bg-purple-2/10 p-2.5 transition-colors hover:border-purple-2/80">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={v.src}
                    alt={`Erfolgsgeschichte — ${v.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    type="button"
                    aria-label={`Video abspielen — ${v.name}`}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="grid size-16 place-items-center rounded-full border border-white/40 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 size-6 fill-white text-white" />
                    </span>
                  </button>
                  <span className="absolute bottom-3 left-4 font-body text-sm font-semibold text-white drop-shadow">
                    {v.name}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
