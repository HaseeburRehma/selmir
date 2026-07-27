import { Reveal } from "@/components/ui/Reveal";
import { YouTubeLite } from "@/components/ui/YouTubeLite";
import { PROOF } from "@/lib/landing-pages";
import { LP_SECTION, LpContainer, LpSectionHeader } from "./lp-ui";

/**
 * "Der Beweis" — headline claim backed by the podcast clip.
 * Figma: 1000-wide header, 980×551 video 56px below it, caption 56px below that.
 */
export default function LpProof() {
  return (
    <section className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full max-w-[1000px]">
          <LpSectionHeader
            eyebrow={PROOF.eyebrow}
            line
            serif={PROOF.headlineSerif}
            display={PROOF.headlineDisplay}
            body={PROOF.body}
            bodyClassName="max-w-[790px]"
          />
        </Reveal>

        <Reveal className="mt-12 w-full max-w-[980px] lg:mt-14" delay={0.08}>
          <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-2 md:p-3">
            <YouTubeLite
              videoId={PROOF.videoId}
              title={PROOF.caption}
              className="rounded-[14px]"
            />
          </div>
          <p className="mt-10 text-center font-body text-[13px] leading-[17px] text-white/40 lg:mt-14 lg:text-[14px]">
            {PROOF.caption}
          </p>
        </Reveal>
      </LpContainer>
    </section>
  );
}
