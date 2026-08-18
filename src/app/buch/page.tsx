import type { Metadata } from "next";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "SEIN. TUN. HABEN. — Das Buch von Selmir Suljkanovic",
  description:
    "Unaufhaltsam. Im Krieg geboren. Im Vertrieb gewonnen. Die Biografie von Selmir Suljkanovic über Verlust, Disziplin und den Weg vom Kriegsflüchtling zum Unternehmer.",
};

export default function BuchPage() {
  return (
    <>
      <Navbar />
      <main>
        <section id="buch" className="relative overflow-hidden bg-bg pt-[96px]">
          {/* background + purple glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-0 h-[703px] w-[520px] opacity-70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/hero/glow-1.svg" alt="" className="h-full w-full object-contain" />
            </div>
            <div className="absolute -top-24 -left-24 h-[703px] w-[420px] opacity-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/hero/glow-2.svg" alt="" className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="container-page relative z-10 grid grid-cols-1 items-center gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,560px)_minmax(0,420px)] lg:justify-between lg:gap-10">
            {/* LEFT: title + book facts */}
            <Reveal className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3.5">
                  <span className="h-0.5 w-10 bg-purple-2" />
                  <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                    Selmir Suljkanovic präsentiert
                  </span>
                </div>

                <h1 className="flex flex-col text-white">
                  <span className="font-serif text-[48px] leading-[0.95] tracking-[-1.5px] sm:text-[60px] lg:text-[72px] lg:tracking-[-2.5px]">
                    Sein.
                  </span>
                  <span className="font-display text-[44px] leading-[0.95] tracking-[-1.5px] sm:text-[54px] lg:text-[64px] lg:tracking-[-2.5px]">
                    TUN.
                  </span>
                  <span className="font-display text-[48px] leading-[0.95] tracking-[-1.5px] sm:text-[60px] lg:text-[72px] lg:tracking-[-3px]">
                    HABEN.
                  </span>
                </h1>

                <p className="max-w-[480px] font-serif text-[22px] leading-[1.3] tracking-[-0.5px] text-white sm:text-[26px]">
                  Unaufhaltsam. Im Krieg geboren.
                  <br />
                  Im Vertrieb gewonnen.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                  Jetzt erhältlich
                </span>
                <p className="font-body text-[17px] font-semibold text-white">
                  Hardcover
                  <span className="mx-2 text-purple-2">•</span>
                  190 Seiten
                  <span className="mx-2 text-purple-2">•</span>
                  Borgmeier Media Gruppe
                </p>
                <p className="font-body text-[14px] text-white/45">
                  Mit Christian Schommers · ISBN 978-3-98256066-3
                </p>
              </div>
            </Reveal>

            {/* RIGHT: description, CTA, cover */}
            <Reveal delay={0.1} className="flex flex-col gap-8">
              <p className="max-w-[420px] font-body text-[17px] leading-[1.6] tracking-[-0.2px] text-white/70">
                Manche Geschichten beginnen mit einem Traum. Seine begann im
                Krieg. Eine Biografie über Verlust, Disziplin und den Weg vom
                Kriegsflüchtling zum Unternehmer.
              </p>

              <div>
                <Button
                  href="https://www.amazon.de/dp/3982560667"
                  icon={<ShoppingBag className="size-5" />}
                >
                  Jetzt Buch sichern
                </Button>
              </div>

              {/* Full wrap image (back + spine + front) — landscape 1125x804,
                  so the wrapper is wider than the previous portrait cover. */}
              <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-[640px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-10 rounded-full bg-purple-1/30 blur-[100px]"
                />
                <div className="relative overflow-hidden rounded-2xl border border-purple-2/40 shadow-[0_30px_80px_-20px_rgba(116,84,243,0.55)]">
                  <Image
                    src="/figma/buch/buchcover-v3.png"
                    alt="SEIN. TUN. HABEN. — Buchumschlag von Selmir Suljkanovic"
                    width={1125}
                    height={804}
                    priority
                    sizes="(max-width: 1024px) 90vw, 640px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
