import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Über Selmir Suljkanovic — Sales Mastery Days",
  description:
    "Selmir Suljkanovic — dein Wegbereiter zum unternehmerischen Erfolg. Über 13 Jahre Vertriebserfahrung und ein Jahrzehnt in leitenden Managementpositionen.",
};

export default function UeberPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-bg pt-[96px]">
          {/* dimmed background photo */}
          <div aria-hidden className="absolute inset-0">
            <Image
              src="/gallery/g1.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_20%] opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/40 to-bg" />
          </div>

          <div className="container-page relative z-10 flex flex-col items-center gap-8 py-20 text-center md:py-28">
            <Reveal className="flex max-w-[870px] flex-col items-center gap-6">
              <h1 className="font-serif text-[40px] leading-[1.2] tracking-[-1.5px] text-white sm:text-[52px] lg:text-[64px] lg:tracking-[-2.5px]">
                Selmir Suljkanovic
              </h1>
              <p className="font-serif text-[22px] leading-[1.2] tracking-[-0.5px] text-white sm:text-[26px] lg:text-[32px]">
                dein Wegbereiter zum unternehmerischen Erfolg
              </p>
              <p className="max-w-[820px] font-body text-[15px] leading-[1.55] tracking-[-0.3px] text-white/70 md:text-[16px]">
                Seine Karriere begann unter den härtesten Bedingungen. Als
                Kriegsflüchtling erlebte Selmir früh, was es bedeutet, mit
                Unsicherheiten umzugehen und Chancen zu ergreifen, sobald sie sich
                bieten. Diese Erfahrungen schärften seinen Blick für das
                Wesentliche und stärkten seinen unerschütterlichen Willen zum
                Erfolg. Heute, mit über 13 Jahren Erfahrung im Vertrieb und einem
                Jahrzehnt in leitenden Managementpositionen, nutzt Selmir seine
                Fähigkeiten, um auch dein Unternehmen zum Erfolg zu führen.
              </p>
            </Reveal>

            <Reveal
              delay={0.1}
              className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
            >
              <Button href="/#tickets" icon={<ArrowUpRight className="size-5" />}>
                Jetzt Ticket sichern
              </Button>
              <Button
                href="/#event"
                variant="secondary"
                icon={<ArrowRight className="size-5" />}
              >
                Infos zum Event
              </Button>
            </Reveal>
          </div>
        </section>

        {/* Über Selmir — Führung & Netzwerk */}
        <section className="bg-bg px-6 py-20 md:px-12 md:py-28 lg:px-[120px] lg:py-[120px]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-[64px]">
            {/* Photo */}
            <Reveal className="w-full max-w-[420px] shrink-0 self-center">
              <div className="overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.04]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/figma/about/selmir-portrait.jpg"
                    alt="Selmir Suljkanovic auf der Bühne"
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>

            {/* Copy */}
            <Reveal delay={0.1} className="w-full max-w-[720px] self-center">
              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-3.5">
                  <span className="h-0.5 w-10 bg-purple-2" />
                  <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                    Über Selmir
                  </span>
                </div>

                <h2 className="font-serif text-[30px] leading-[1.2] tracking-[-1px] text-white md:text-[42px] md:tracking-[-1.4px]">
                  Klare Führung:{" "}
                  <span className="font-display">
                    Strukturen, die Ergebnisse liefern
                  </span>
                </h2>

                <p className="font-body text-[15px] leading-[1.65] tracking-[-0.2px] text-white/[0.68] md:text-[16px]">
                  Bekannt für seine klare und strukturierte Führung, hat Selmir es
                  immer verstanden, sowohl große Organisationen als auch Start-ups
                  mit Präzision und Effizienz zu lenken. Sein Fokus liegt auf der
                  Entwicklung robuster Systeme und Prozesse, die nicht nur die
                  täglichen Abläufe vereinfachen, sondern auch skalierbares
                  Wachstum ermöglichen. Durch seine Expertise im Aufbau und der
                  Optimierung von Vertriebsstrukturen hat er Unternehmen geholfen,
                  ihre Umsätze signifikant zu steigern.
                </p>

                <h3 className="font-serif text-[22px] leading-[1.25] tracking-[-0.5px] text-white md:text-[28px]">
                  Netzwerker aus Überzeugung: gemeinsam stärker
                </h3>

                <p className="font-body text-[15px] leading-[1.65] tracking-[-0.2px] text-white/[0.68] md:text-[16px]">
                  Der Schlüssel zum Erfolg liegt im richtigen Netzwerk. „Das
                  Umfeld gewinnt immer“ – dieses Motto lebt er und fördert die
                  Kultur des kontinuierlichen Austauschs und der gegenseitigen
                  Unterstützung. Selmirs umfangreiches Netzwerk aus
                  Branchenexperten und Unternehmern ermöglicht es ihm, exklusive
                  Einblicke und Chancen zu bieten, die sonst verdeckt bleiben
                  würden.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
