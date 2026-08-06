"use client";

import Image from "next/image";
import { Settings, TrendingUp, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { YouTubeLite } from "@/components/ui/YouTubeLite";
import { CTA_HREF, type CaseStudy } from "@/lib/landing-pages";
import { Eyebrow, LP_SECTION, LpContainer } from "./lp-ui";
import { RevenueChart } from "./RevenueChart";

/**
 * Scroll to the offer form even when the URL already contains #analyse.
 * A plain hash link is a no-op in that case, which is why the CTA in the
 * case studies felt "dead" once you'd clicked any anchor once.
 */
function scrollToAnalyse(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("analyse");
  if (!target) return; // fall through to the browser's default
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  // Keep the hash in sync so bookmarks / refresh still land here.
  if (window.location.hash !== "#analyse") {
    history.replaceState(null, "", "#analyse");
  }
}

/**
 * Result icons, in the order the Figma lists them:
 * icon/trend → icon/gear → icon/users (identical geometry to these lucide icons).
 */
const RESULT_ICONS = [TrendingUp, Settings, Users] as const;

/**
 * Team photos. The Figma uses three arrangements inside the 568px column,
 * picked by how many photos the study has:
 * 1 → a single 568×388 frame, 2 → two full-width 568×267.5 frames stacked
 * 28px apart, 4 → a 2×2 grid of 280×187.5 frames with 8px gutters.
 */
function TeamPhotos({ images }: { images: CaseStudy["images"] }) {
  if (images.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[280/187.5] overflow-hidden rounded-[20px]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 280px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  const aspect = images.length === 1 ? "aspect-[568/388]" : "aspect-[568/267.5]";

  return (
    <div className="flex flex-col gap-7 lg:gap-[28px]">
      {images.map((img) => (
        <div
          key={img.src}
          className={`relative w-full overflow-hidden rounded-[20px] ${aspect}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 568px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Case study block. Figma: two 568px columns with a 64px gutter and a 28px
 * stack inside each, eyebrow 64px above them, 40/1.18 headline, 22px subheads,
 * 17/1.5 paragraphs, 44px result rows and a two-line CTA.
 */
export default function LpCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <section className={LP_SECTION}>
      <LpContainer>
        <Reveal>
          <Eyebrow line>{study.eyebrow}</Eyebrow>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-[64px] lg:grid-cols-2 lg:gap-[64px]">
          {/* Left column — the story before, then the revenue curve */}
          <Reveal className="flex flex-col gap-7 lg:gap-[28px]">
            <h2 className="text-balance font-serif text-[28px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[34px] lg:text-[40px] lg:tracking-[-1.2px]">
              {study.headlineSerif}{" "}
              <span className="font-display">{study.headlineDisplay}</span>
            </h2>

            <div className="flex flex-col gap-3 lg:gap-[14px]">
              <h3 className="font-body text-[19px] font-semibold leading-tight text-white lg:text-[22px]">
                Vor der Zusammenarbeit
              </h3>
              <p className="font-body text-[15px] leading-[1.5] text-white/[0.72] lg:text-[17px]">
                {study.before}
              </p>
            </div>

            <RevenueChart {...study.chart} />

            {/* 16:9, not the design's 568x267 frame: a YouTube player letterboxes
                anything wider than 16:9, which left black bars down both sides and
                made the video look narrower than the chart card above it. */}
            {study.video && (
              <div className="overflow-hidden rounded-[20px] border border-white/[0.06]">
                <YouTubeLite
                  videoId={study.video.id}
                  title={study.video.title}
                />
              </div>
            )}
          </Reveal>

          {/* Right column — the proof: photos, the story after, results, CTA */}
          <Reveal className="flex flex-col gap-7 lg:gap-[28px]" delay={0.08}>
            <TeamPhotos images={study.images} />

            <div className="flex flex-col gap-3 pt-2 lg:gap-[14px]">
              <h3 className="font-body text-[19px] font-semibold leading-tight text-white lg:text-[22px]">
                Nach der Zusammenarbeit
              </h3>
              <p className="font-body text-[15px] leading-[1.5] text-white/[0.72] lg:text-[17px]">
                {study.after}
              </p>
            </div>

            <ul className="flex flex-col gap-4 pt-1 lg:gap-[16px]">
              {study.results.map((r, i) => {
                const Icon = RESULT_ICONS[i];
                return (
                  <li key={r} className="flex items-center gap-4">
                    <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] border border-white/[0.08] bg-white/[0.04]">
                      <Icon className="size-[22px] text-purple-2" strokeWidth={2} />
                    </span>
                    <span className="font-body text-[15px] leading-[19px] text-white/[0.92] lg:text-[16px]">
                      {r}
                    </span>
                  </li>
                );
              })}
            </ul>

            <a
              href={CTA_HREF}
              onClick={scrollToAnalyse}
              className="btn-gradient group flex flex-col items-center justify-center rounded-[10px] px-6 py-[18px] text-center text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="font-body text-[16px] font-semibold leading-normal lg:text-[18px]">
                Jetzt Erstgespräch vereinbaren
              </span>
              <span className="mt-[3px] font-body text-[12px] leading-normal text-black/70 lg:text-[14px]">
                Kostenlos &amp; unverbindlich in 15 Minuten
              </span>
            </a>
          </Reveal>
        </div>
      </LpContainer>
    </section>
  );
}
