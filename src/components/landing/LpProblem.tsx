import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { PROBLEMS } from "@/lib/landing-pages";
import { LP_SECTION, LpContainer, LpSectionHeader } from "./lp-ui";

/**
 * "Das Problem" — six owner quotes, each with its 3D glass icon from Figma.
 * Figma cell: 399×400, icon block 262 tall (200px icon inside a 238px ring),
 * quote 38px below it with 44px side padding. Cells are split by hairlines.
 */
export default function LpProblem() {
  return (
    <section className={LP_SECTION}>
      <LpContainer className="flex flex-col items-center">
        <Reveal className="w-full">
          <LpSectionHeader
            eyebrow="Das Problem"
            serif="Kommt dir das"
            display="bekannt vor?"
          />
        </Reveal>

        <Reveal className="mt-12 w-full lg:mt-[76px]" delay={0.08}>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMS.map((p) => (
              <li key={p.quote} className="flex flex-col bg-[#0c0a14]">
                <div className="flex h-[200px] items-center justify-center md:h-[240px] lg:h-[262px]">
                  <Image
                    src={p.icon}
                    alt=""
                    width={250}
                    height={250}
                    sizes="250px"
                    className="h-auto w-[190px] max-w-full md:w-[225px] lg:w-[250px]"
                  />
                </div>
                {/* 20/23 in the design — card 1 is the one that breaks to
                    three lines inside the 315px measure. */}
                <p className="px-7 pb-9 pt-6 font-body text-[16px] font-semibold leading-[23px] tracking-[-0.2px] text-white md:text-[18px] lg:px-[44px] lg:pb-[54px] lg:pt-[38px] lg:text-[20px]">
                  {p.quote}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12 lg:mt-[76px]" delay={0.12}>
          <p className="text-balance text-center font-body text-[15px] leading-[26px] text-white/55 lg:text-[17px] lg:leading-[31px]">
            Dann liegt dein Problem nicht am Markt. Es liegt an Struktur und
            Vertrieb –{" "}
            <span className="font-semibold text-purple-2">
              und genau das ist lösbar.
            </span>
          </p>
        </Reveal>
      </LpContainer>
    </section>
  );
}
