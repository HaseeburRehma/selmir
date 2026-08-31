import { Fragment, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import LpCaseStudy from "@/components/landing/LpCaseStudy";
import { CASE_STUDIES } from "@/lib/landing-pages";

/**
 * Homepage "Case Studies" section. Same four big cards used on every
 * landing page (LpCaseStudy) — ebork, Geerkens, Jürgen Hohnen, Hörmann —
 * so the story stays consistent everywhere the visitor lands.
 *
 * `insertAfter` lets the caller drop an arbitrary node between two case
 * studies (keyed by a substring of the study's eyebrow, e.g. "Hohnen").
 * The homepage uses it to slot a podcast teaser between Jürgen Hohnen
 * and Hörmann per Figma feedback.
 */
type Props = {
  insertAfter?: Record<string, ReactNode>;
};

export default function CaseStudiesSection({ insertAfter }: Props = {}) {
  return (
    <section id="cases">
      <div className="bg-bg px-6 pt-24 md:px-12 md:pt-32 lg:px-[120px] lg:pt-[140px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="flex flex-col gap-6">
            <div className="flex items-center gap-3.5">
              <span className="h-0.5 w-10 bg-purple-2" />
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Case Studies
              </span>
            </div>
            <h2 className="max-w-[900px] font-serif text-[32px] leading-[1.2] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
              <span className="font-display">Zahlen</span>, die für sich sprechen.
            </h2>
          </Reveal>
        </div>
      </div>

      {CASE_STUDIES.map((study) => {
        const injected =
          insertAfter &&
          Object.entries(insertAfter).find(([key]) =>
            study.eyebrow.includes(key),
          )?.[1];
        return (
          <Fragment key={study.eyebrow}>
            {/* CTA on each card removed — the dedicated #tickets pricing
                block that follows the last case study replaces it. */}
            <LpCaseStudy study={study} ctaHref={null} />
            {injected}
          </Fragment>
        );
      })}
    </section>
  );
}
