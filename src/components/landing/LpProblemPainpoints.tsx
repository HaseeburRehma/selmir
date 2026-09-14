import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { LP_SECTION, LpContainer, LpSectionHeader } from "./lp-ui";

/**
 * Six painpoints from the Handwerker campaign brief. Same 3-column grid,
 * same 3D glass icons and hairlines as LpProblem, but each cell renders a
 * bold title + short description instead of a single quote — this matches
 * the "Title – Text" shape TyloTech supplied in the copy.
 *
 * Icons are re-used from `/figma/lp/problem-*.webp` in visual order so the
 * grid still reads as the same section family.
 */

const PAINPOINTS: {
  icon: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "/figma/lp/problem-1.webp",
    title: "Genug Anfragen, zu wenig Aufträge",
    body: "Leute fragen an, aber es wird zu wenig draus. Kein Nachfassen, kein Prozess.",
  },
  {
    icon: "/figma/lp/problem-6.webp",
    title: "Alles hängt an dir",
    body: "Urlaub = Stillstand. Betrieb läuft nur, weil du selbst verkaufst.",
  },
  {
    icon: "/figma/lp/problem-3.webp",
    title: "Ausgelastet – ohne Marge",
    body: "Volle Bücher, Team rennt, trotzdem bleibt zu wenig.",
  },
  {
    icon: "/figma/lp/problem-5.webp",
    title: "Werbung ohne Ergebnis",
    body: "Geld reingesteckt, nichts kam zurück. Problem ist der Vertrieb dahinter.",
  },
  {
    icon: "/figma/lp/problem-4.webp",
    title: "Unplanbare Auslastung",
    body: "Mal Bude ein, mal Funkstille. Kein planbarer Zufluss.",
  },
  {
    icon: "/figma/lp/problem-2.webp",
    title: "„In meiner Branche ist das anders“",
    body: "Ist es nicht. SHK, Elektro, Bau: gleiche Hebel.",
  },
];

export default function LpProblemPainpoints() {
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
            {PAINPOINTS.map((p) => (
              <li key={p.title} className="flex flex-col bg-[#0c0a14]">
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
                <div className="flex flex-col gap-3 px-7 pb-9 pt-6 lg:px-[44px] lg:pb-[54px] lg:pt-[38px]">
                  <h3 className="font-body text-[17px] font-semibold leading-[24px] tracking-[-0.2px] text-white md:text-[18px] lg:text-[20px] lg:leading-[27px]">
                    {p.title}
                  </h3>
                  <p className="font-body text-[14px] leading-[22px] text-white/60 md:text-[15px] lg:text-[16px] lg:leading-[26px]">
                    {p.body}
                  </p>
                </div>
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
