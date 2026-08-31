import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Homepage hero — "Erfolg durch Klarheit" (Figma node 3721:2862).
 *
 * Portrait is a transparent-background PNG downloaded from the Figma
 * design so it floats over the section without a rounded card border.
 * Buttons render in a single row on all viewports (no wrap).
 */

const PARTNER_LOGOS = [
  "/figma/hero/logo-eoptimum.png",
  "/figma/hero/logo-3.png",
  "/figma/hero/logo-4.png",
  "/figma/hero/logo-5.png",
  "/figma/hero/logo-2.png",
  "/figma/hero/logo-6.png",
];

export default function HomeHero() {
  return (
    <section
      id="home-hero"
      className="relative overflow-hidden bg-bg px-6 pb-16 pt-[120px] md:px-12 md:pb-24 md:pt-[160px] lg:px-[120px] lg:pt-[180px]"
    >
      {/* Radial vignette + faint grid + purple blooms */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 22%, rgba(116,84,243,0.30) 0%, rgba(37,20,72,0.55) 30%, rgba(15,10,28,0.85) 60%, #090711 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-16 h-[560px] w-[560px] rounded-full bg-purple-1/30 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-purple-2/25 blur-[150px]"
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-[minmax(0,720px)_minmax(0,520px)] lg:gap-[64px]">
          {/* Left — copy */}
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-[34px] leading-[1.1] tracking-[-1px] text-white sm:text-[42px] md:text-[50px] lg:text-[56px] lg:leading-[1.08] lg:tracking-[-1.8px]">
                <span className="font-serif italic font-normal">Struktur & Vertrieb</span>{" "}
                <span className="font-body font-extrabold tracking-[-1.6px]">
                  für inhabergeführte Betriebe
                </span>
              </h1>
              <p className="font-serif italic text-[20px] leading-[1.3] tracking-[-0.4px] text-white/85 sm:text-[24px] md:text-[28px] lg:text-[30px]">
                Dein Betrieb läuft. Aber nur, wenn du selbst dranstehst.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="max-w-[600px] font-body text-[15px] leading-[1.65] text-white/70 md:text-[16.5px]">
                Wir helfen Inhabern & Führungskräften, ihren Vertrieb und ihre
                Struktur so aufzustellen, dass der Betrieb wächst – ohne dass
                sie noch mehr Stunden reinstecken. Klare Prozesse, planbare
                Zahlen, ein Betrieb, der auch ohne dich funktioniert.
              </p>
            </div>

            {/* Buttons stay in one row on every viewport. Below 380px they
                shrink text/padding rather than wrap — no line-break either. */}
            <div className="flex flex-nowrap items-center gap-3 sm:gap-4">
              <Button
                href="/kontakt"
                icon={<ArrowUpRight className="size-4 shrink-0 sm:size-5" />}
                className="whitespace-nowrap !px-4 !text-[11px] sm:!px-6 sm:!text-[13px]"
              >
                Kontakt aufnehmen
              </Button>
              <Button
                href="/ueber"
                variant="secondary"
                icon={<ArrowRight className="size-4 shrink-0 sm:size-5" />}
                className="whitespace-nowrap !px-4 !text-[11px] sm:!px-6 sm:!text-[13px]"
              >
                Über Selmir
              </Button>
            </div>
          </Reveal>

          {/* Right — floating portrait (transparent PNG, no card).
              The PNG bleeds all the way to its own right edge (his
              right elbow sits on the bitmap boundary), so we give the
              container a taller aspect and a bit more inner padding on
              lg so nothing reads as a hard crop against the section
              padding — plus a soft radial fade behind the base of the
              portrait to feather the bottom edge. */}
          <Reveal
            delay={0.1}
            className="relative mx-auto w-full max-w-[400px] sm:max-w-[480px] lg:mx-0 lg:ml-auto lg:max-w-[560px]"
          >
            {/* Soft purple glow behind the portrait */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-2/30 blur-[80px]"
            />
            {/* Bottom feather — softens the natural PNG edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-4%] bottom-[-4%] h-[24%] bg-[radial-gradient(ellipse_at_center,rgba(9,7,17,0.85)_0%,rgba(9,7,17,0)_75%)]"
            />
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/figma/home/selmir-hero.png"
                alt="Selmir Suljkanovic"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 480px, 560px"
                style={{ objectPosition: "center bottom" }}
                className="object-contain"
              />
            </div>
          </Reveal>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-col items-center gap-6 md:mt-20">
          <p className="text-center font-label text-[13px] font-bold uppercase tracking-[2px] text-white/60 lg:text-[15px]">
            Vertraut von führenden Unternehmen
          </p>
          <Marquee gap={88} className="max-w-full opacity-60">
            {PARTNER_LOGOS.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex h-14 items-center justify-center px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="max-h-9 w-auto object-contain"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
