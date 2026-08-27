import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Book teaser — mirrors the /buch hero at homepage scale.
 * (Figma section 3737:3492 — "Section - Ueber Selmir" (second occurrence),
 * used as the book callout row.)
 *
 * Left: title cluster + CTA. Right: full-wrap cover image.
 */
export default function BookTeaserSection() {
  return (
    <section
      id="buch-teaser"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-purple-2/20 blur-[150px]"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,500px)_minmax(0,640px)] lg:gap-16">
          {/* Left — title + CTA */}
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-10 rounded-full bg-purple-2"
                />
                Das Buch
              </span>
              <h2 className="flex flex-col text-white">
                <span className="font-serif text-[44px] leading-[0.95] tracking-[-1.5px] sm:text-[56px] lg:text-[64px] lg:tracking-[-2.4px]">
                  Sein.
                </span>
                <span className="font-display text-[40px] leading-[0.95] tracking-[-1.5px] sm:text-[50px] lg:text-[58px] lg:tracking-[-2.4px]">
                  TUN.
                </span>
                <span className="font-display text-[44px] leading-[0.95] tracking-[-1.5px] sm:text-[56px] lg:text-[64px] lg:tracking-[-2.8px]">
                  HABEN.
                </span>
              </h2>
              <p className="max-w-[420px] font-serif text-[20px] leading-[1.3] tracking-[-0.4px] text-white/85 sm:text-[22px]">
                Unaufhaltsam. Im Krieg geboren.
                <br />
                Im Vertrieb gewonnen.
              </p>
              <p className="max-w-[440px] font-body text-[15.5px] leading-[1.6] text-white/60 md:text-[16.5px]">
                Die Biografie von Selmir Suljkanovic — über Verlust, Disziplin
                und den Weg vom Kriegsflüchtling zum Unternehmer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/buch" icon={<ShoppingBag className="size-5" />}>
                Zum Buch
              </Button>
              <span className="font-body text-[13px] text-white/45">
                Hardcover · 190 Seiten · ISBN 978-3-98256066-3
              </span>
            </div>
          </Reveal>

          {/* Right — full-wrap cover */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto lg:max-w-[640px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-full bg-purple-1/25 blur-[100px]"
              />
              <div className="relative overflow-hidden rounded-2xl border border-purple-2/40 shadow-[0_30px_80px_-20px_rgba(116,84,243,0.55)]">
                <Image
                  src="/figma/buch/buchcover-v3.png"
                  alt="SEIN. TUN. HABEN. — Buchumschlag"
                  width={1125}
                  height={804}
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
