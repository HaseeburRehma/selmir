import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export default function FinalCtaSection() {
  return (
    <section id="join" className="bg-bg px-6 pb-24 pt-16 md:px-12 md:pb-[120px] md:pt-20 lg:px-[120px]">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="relative flex flex-col items-center gap-[30px] overflow-hidden rounded-[28px] border border-purple-2/[0.18] bg-[#0e0b19] px-6 py-20 text-center md:px-20 md:py-24">
          {/* purple glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-1/25 blur-[130px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-purple-2/20 blur-[100px]"
          />

          <div className="relative z-10 flex items-center gap-2.5 rounded-full border border-purple-2/30 bg-white/5 py-2.5 pl-3 pr-4.5">
            <span className="grid size-[18px] place-items-center">
              <span className="size-2 animate-pulse rounded-full bg-purple-2" />
            </span>
            <span className="font-body text-[14px] font-semibold tracking-[-0.2px] text-white/90">
              Werde Teil davon
            </span>
          </div>

          <h2 className="relative z-10 font-serif text-[36px] leading-[1.16] tracking-[-1.2px] text-white md:text-[58px] md:tracking-[-2px]">
            Bereit, aus dem Engpass
            <br />
            <span className="text-white/[0.42]">auszubrechen?</span>
          </h2>

          <p className="relative z-10 max-w-[600px] font-body text-[16px] leading-[1.55] tracking-[-0.3px] text-white/60 md:text-[18px]">
            Zwei Tage, die deinen Vertrieb neu aufstellen – live in Düsseldorf.
            Die Plätze sind begrenzt.
          </p>

          <div className="relative z-10 pt-3">
            <Button href="#tickets">Jetzt Ticket sichern</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
