import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type Quote = {
  avatar: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

const QUOTES: Quote[] = [
  {
    avatar: "/figma/testimonials/avatar-1.png",
    quote:
      "3 Tage voller wichtiger Impulse und einer Energie, die ich nirgendwo anders finde.",
    name: "Michael Braun",
    role: "Geschäftsführer",
    company: "Braun Vertrieb",
  },
  {
    avatar: "/figma/testimonials/avatar-2.png",
    quote:
      "Ein toller Tag mit viel Input – danke für deine Sichtweisen und Denkanstöße.",
    name: "Sabine Wolf",
    role: "Inhaberin",
    company: "Wolf Consulting",
  },
  {
    avatar: "/figma/testimonials/avatar-3.png",
    quote:
      "Hervorragende Umsetzung – Leidenschaft und Professionalität in jedem Detail.",
    name: "Andreas Keller",
    role: "Netzwerk-Mitglied",
    company: "Ceon-Netzwerk",
  },
  {
    avatar: "/figma/testimonials/avatar-3.png",
    quote:
      "Der Kopf hat gebrummt, im positiven Sinn! Die Termine mit dir sind absolut effektiv.",
    name: "Philipp Mayer",
    role: "Unternehmer",
    company: "Mayer Gruppe",
  },
  {
    avatar: "/figma/testimonials/avatar-1.png",
    quote:
      "Danke für die drei wahnsinnigen Tage im Office – das war großes Kino.",
    name: "Dimitri",
    role: "Unternehmer",
    company: "„Erfolg ist kein Zufall“",
  },
  {
    avatar: "/figma/testimonials/avatar-2.png",
    quote: "Du hast in den letzten drei Tagen mein Leben verändert.",
    name: "Christian Weber",
    role: "Gründer",
    company: "Weber Digital",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="stimmen" className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <span className="h-0.5 w-10 bg-purple-2" />
            <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
              Stimmen
            </span>
          </div>
          <h2 className="max-w-[860px] font-serif text-[32px] leading-[1.2] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
            Das sagen begeisterte <span className="font-display">Kunden</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col gap-[22px] rounded-2xl border border-white/[0.09] bg-white/[0.02] p-[30px] transition-colors duration-300 hover:border-purple-2/25">
                <div className="flex items-center justify-between">
                  <Image
                    src={q.avatar}
                    alt={q.name}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="font-serif text-[42px] leading-none text-purple-2/35"
                  >
                    ”
                  </span>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/testimonials/stars.svg"
                  alt="5 Sterne"
                  className="h-[15px] w-[91px]"
                />

                <blockquote className="font-body text-[16px] leading-[1.55] tracking-[-0.3px] text-white/[0.86]">
                  {q.quote}
                </blockquote>

                <figcaption className="mt-auto flex flex-col">
                  <span className="font-body text-[15px] font-semibold text-white">
                    {q.name}
                  </span>
                  <span className="font-body text-[13px] text-white/50">
                    {q.role} · {q.company}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
