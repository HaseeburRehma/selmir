import { Marquee } from "@/components/ui/Marquee";
import { TRUST_LINE, TRUST_LOGOS } from "@/lib/landing-pages";
import { LpLeadFormPainpoints } from "./LpLeadFormPainpoints";

/**
 * Handwerker-Painpoints Hero — two-column layout.
 *
 * Left: "Achtung" eyebrow (serif), "Handwerksunternehmer." punch (display,
 * one size up from the other LP heroes), the three-question subline, and
 * the micro-text.
 *
 * Right: the lead form (Vorname · Nachname · Telefon · E-Mail).
 *
 * The Trust-Logos strip below is identical to the other LPs so all Sales
 * Mastery pages read as one campaign.
 */
export default function LpHeroPainpoints() {
  return (
    <section id="top" className="relative overflow-hidden bg-bg">
      {/* Backdrop — identical to LpHero so the campaign visually reads as
          the same page family. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#0b0817]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        <div className="absolute -top-32 left-[18%] h-[703px] w-[300px] -rotate-6 rounded-full bg-purple-1/25 blur-[110px]" />
        <div className="absolute -top-24 right-[12%] h-[703px] w-[240px] rotate-6 rounded-full bg-purple-2/20 blur-[120px]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[420px] -translate-x-1/2 rounded-full bg-purple-1/20 blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-[120px] md:px-10 md:pt-[150px] lg:px-[120px] lg:pt-[160px]">
        <div
          lang="de"
          className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-[72px]"
        >
          {/* Left column — copy. The 2-col split only kicks in at xl
              (1280px+) so the long word "Handwerksunternehmer." never
              gets squeezed against the form on mid-size viewports. */}
          <div className="flex flex-col">
            <p className="font-serif text-[22px] leading-[1.15] tracking-[-0.3px] text-white/70 sm:text-[26px] xl:text-[30px]">
              Achtung
            </p>
            <h1 className="mt-1 font-display text-[44px] font-bold leading-[1.02] tracking-[-1.2px] text-white sm:text-[64px] md:text-[80px] lg:text-[96px] xl:mt-2 xl:text-[72px] xl:leading-[76px] xl:tracking-[-2.5px]">
              Handwerksunternehmer.
            </h1>

            <p className="mt-6 max-w-[600px] text-pretty font-serif text-[20px] leading-[1.32] tracking-[-0.3px] text-white sm:text-[24px] md:text-[28px] xl:mt-8 xl:text-[28px] xl:leading-[36px]">
              Zu wenig Aufträge trotz genug Anfragen? Alles hängt an dir?
              Voll ausgelastet – und trotzdem bleibt zu wenig?
            </p>

            <p className="mt-5 max-w-[600px] text-pretty font-body text-[14px] leading-[1.6] text-white/55 xl:mt-7 xl:text-[16px] xl:leading-[26px]">
              Der Grund ist fast immer derselbe: dir fehlt ein Vertrieb, der
              aus Anfragen planbar Aufträge macht. In einer kostenlosen
              Potenzialanalyse zeige ich dir schwarz auf weiß, wo Umsatz
              liegen bleibt.
            </p>
          </div>

          {/* Right column — form. Stacks below the copy on <xl. */}
          <div className="xl:pt-2">
            <LpLeadFormPainpoints compact />
          </div>
        </div>

        {/* Trust bar — same label + logo strip as the other LP heroes. */}
        <div className="relative z-10 mt-16 flex flex-col items-center pb-4 md:mt-24 lg:mt-[114px] lg:pb-0">
          <p className="px-6 text-center font-label text-[13px] font-bold uppercase leading-[24px] tracking-[0.5px] text-white md:text-[16px]">
            {TRUST_LINE}
          </p>
          <Marquee gap={96} className="mt-5 max-w-full opacity-55 lg:mt-6">
            {TRUST_LOGOS.map((src) => (
              <div
                key={src}
                className="flex h-[56px] items-center justify-center px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-auto object-contain ${
                    src.includes("eoptimum") ? "max-h-[42px]" : "max-h-[40px]"
                  }`}
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
