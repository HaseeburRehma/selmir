import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "€247M", label: "247 Mio. € Umsatz verantwortet hat." },
  { value: "47 Sales Teams", label: "Über 47 Vertriebsteams aufgebaut hat." },
  {
    value: "33 Industries",
    label: "In 33 verschiedenen Branchen aktiv war – mit messbaren Ergebnissen.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-12 lg:flex-row lg:gap-[53px]">
        {/* Portrait */}
        <Reveal className="w-full max-w-[500px] shrink-0">
          <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.04] sm:h-[560px] lg:h-[624px]">
            <div className="relative h-full w-full">
              <Image
                src="/figma/about/selmir-portrait.jpg"
                alt="Selmir Suljkanovic"
                fill
                sizes="500px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={0.1} className="w-full max-w-[647px]">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-3.5">
              <span className="h-0.5 w-10 bg-purple-2" />
              <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                Über Selmir
              </span>
            </div>

            <h2 className="font-serif text-[34px] leading-[1.18] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
              Wer ist <span className="font-display">Selmir Suljkanovic?</span>
            </h2>

            <p className="text-[17px] leading-[1.35] tracking-[-0.3px] text-white/[0.68]">
              Selmir Suljkanovic ist nicht einfach ein weiterer Marketing- oder
              Vertriebscoach.
            </p>

            <div className="space-y-4 text-[17px] leading-[1.45] tracking-[-0.3px] text-white/[0.68]">
              <p>
                Als ehemaliger Kriegsflüchtling kennt er die Kraft von Struktur,
                System und unerschütterlichem Willen. In mehr als einem Jahrzehnt
                im Vertrieb und Führung hat er Prozesse aufgebaut, die zuverlässig
                funktionieren – auch ohne den Chef.
              </p>
              <div>
                <p>Seine Mission:</p>
                <p>Kein „Verkauf nach Gefühl“ mehr.</p>
                <p>Kein Verkaufschaos, wenn der Chef nicht da ist.</p>
                <p>
                  Keine Ausreden, sondern klare Prozesse, messbare Resultate,
                  Planbarkeit.
                </p>
              </div>
              <p>
                Er arbeitet mit Führungskräften, Geschäftsführern und Unternehmern,
                die mit System führen – nicht verwalten. Denn Vertrieb ist ein
                Handwerk und Leadership ein Werkzeug.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2">
              {STATS.map((s) => (
                <div key={s.value} className="flex max-w-[190px] flex-col gap-1.5">
                  <p className="font-display text-[26px] text-white">{s.value}</p>
                  <p className="text-[13px] leading-[1.3] tracking-[-0.3px] text-white/55">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button href="#tickets">Basic Ticket ab 99€ sichern!</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
