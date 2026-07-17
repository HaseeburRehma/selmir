import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
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
          {/* dimmed background portrait + grid pattern */}
          <div aria-hidden className="absolute inset-0">
            {/* subtle grid lines behind everything */}
            <div
              className="absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
              }}
            />
            {/* centered portrait band */}
            <div className="absolute inset-y-0 left-1/2 w-full max-w-[1040px] -translate-x-1/2">
              <Image
                src="/figma/about/aboutus.jpg"
                alt=""
                fill
                priority
                sizes="1040px"
                className="object-cover object-[42%_28%] opacity-40"
              />
              {/* fade the photo's side edges into the grid */}
              <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
            </div>
            {/* top + bottom vignette into the page */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/30 to-bg" />
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
                 Ticket sichern
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

        {/* Leidenschaft für Entwicklung — interview banner */}
        <section className="bg-bg px-6 pb-20 md:px-12 md:pb-28 lg:px-[120px]">
          <Reveal className="mx-auto max-w-[1440px]">
            <div className="relative overflow-hidden rounded-[20px]">
              {/* interview photo backdrop */}
              <div className="absolute inset-0">
                <Image
                  src="/figma/about/interview.jpg"
                  alt="Selmir Suljkanovic im Interview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover object-[center_30%]"
                />
                {/* scrims for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-black/20" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              </div>

              {/* thin white inset frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3 z-20 rounded-[10px] border border-white/60 md:inset-5"
              />

              <div className="relative z-10 flex min-h-[440px] flex-col justify-between gap-12 p-8 md:min-h-[560px] md:p-14">
                <div className="max-w-[560px] pt-2 md:pt-4">
                  <h2 className="text-[26px] leading-[1.3] tracking-[-0.5px] text-white md:text-[36px] md:tracking-[-0.8px]">
                    <span className="font-serif">
                      Leidenschaft für Entwicklung:
                    </span>{" "}
                    <span className="font-display">
                      Menschen und{" "}
                      <span className="rounded-md bg-purple-1 px-2">
                        Organisationen
                      </span>{" "}
                      wachsen lassen
                    </span>
                  </h2>
                  <div className="mt-6">
                    <Button
                      href="/#tickets"
                      className="h-11 px-5 text-[11px]"
                      icon={<ArrowUpRight className="size-4" />}
                    >
                      Ticket sichern
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
                  <p className="max-w-[420px] font-body text-[12px] leading-[1.6] text-white/75 md:text-[13px]">
                    Nichts erfüllt Selmir mehr als das Wachstum der Menschen um
                    ihn herum. Sein Engagement in der persönlichen und
                    professionellen Entwicklung seiner Klienten und Mitarbeiter
                    bildet den Kern seiner Philosophie. Mit maßgeschneiderten
                    Coachings und intensiven Trainingsprogrammen hilft er
                    Einzelpersonen und Teams, ihr volles Potenzial zu entfalten
                    und herausragende Ergebnisse zu erzielen.
                  </p>
                  <div className="max-w-[420px]">
                    <h3 className="font-serif text-[20px] leading-[1.3] tracking-[-0.3px] text-white md:text-[24px]">
                      Deine Reise zum Erfolg sollte nicht länger warten.
                    </h3>
                    <p className="mt-3 font-body text-[12px] leading-[1.6] text-white/75 md:text-[13px]">
                      Entdecke gemeinsam mit Selmirs Team, welches aus erfahrenen
                      Unternehmensberatern und Experten besteht, ein
                      unvergessliches Erstgespräch und beginne den Weg zu einem
                      erfüllten und erfolgreichen beruflichen Leben.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Stimmen + FAQ (wie auf der Startseite) */}
        <TestimonialsSection />
        <FaqSection />

        {/* Sprich mit Selmir — CTA */}
        <section className="bg-bg px-6 pb-24 pt-4 md:px-12 md:pb-[120px] lg:px-[120px]">
          <Reveal className="mx-auto max-w-[1440px]">
            <div className="relative flex flex-col items-center gap-7 overflow-hidden rounded-[28px] border border-purple-2/[0.18] bg-[#0e0b19] px-6 py-16 text-center md:px-20 md:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-1/25 blur-[130px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-purple-2/20 blur-[100px]"
              />

              <div className="relative z-10 flex items-center gap-2.5 rounded-full border border-purple-2/30 bg-white/5 py-2.5 pl-3 pr-4.5">
                <span className="size-2 animate-pulse rounded-full bg-purple-2" />
                <span className="font-body text-[14px] font-semibold tracking-[-0.2px] text-white/90">
                  Werde Teil davon
                </span>
              </div>

              <h2 className="relative z-10 font-serif text-[34px] leading-[1.16] tracking-[-1px] text-white md:text-[52px] md:tracking-[-1.8px]">
                Sprich mit <span className="font-display">Selmir!</span>
              </h2>

              <p className="relative z-10 max-w-[560px] font-body text-[15px] leading-[1.55] tracking-[-0.3px] text-white/60 md:text-[17px]">
                Buche dir jetzt ein kostenloses Expertengespräch
              </p>

              <div className="relative z-10 pt-2">
                <Button href="/#tickets"> Ticket sichern</Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
