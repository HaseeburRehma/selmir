import Image from "next/image";
import { Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type Tier = {
  name: string;
  price: string;
  oldPrice: string;
  ticket: string;
  features: string[];
  cta: string;
  checkout: string;
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Basic",
    price: "69€",
    oldPrice: "99€",
    ticket: "/figma/pricing/ticket-basic.webp",
    cta: "Basic Ticket sichern",
    checkout: "https://buy.stripe.com/6oU3cveBve9u3MvcrK4ko00",
    features: ["Eintritt für beide Tage", "Sitzplätze im hinteren Bereich"],
  },
  {
    name: "First Class",
    price: "1.199€",
    oldPrice: "1.499€",
    ticket: "/figma/pricing/ticket-firstclass.webp",
    cta: "First Class Ticket sichern",
    checkout: "https://buy.stripe.com/fZucN564Z4yU6YHbnG4ko02",
    highlight: true,
    features: [
      "Fast Lane Zugang",
      "Sitzplätze in der ersten Reihe",
      "Wachstum bedeutet mehr Chaos statt mehr Freiheit.",
      "Mittag- und Abendessen mit First Class Teilnehmern und Selmir Suljkanovic",
      "Goodiebag mit exklusiven Seminarunterlagen",
      "Roundtable und Q&A mit Selmir Suljkanovic",
    ],
  },
  {
    name: "Business",
    price: "379€",
    oldPrice: "499€",
    ticket: "/figma/pricing/ticket-business.webp",
    cta: "Business Ticket sichern",
    checkout: "https://buy.stripe.com/14AaEXeBvaXi82LdvO4ko01",
    features: [
      "Goodiebag mit Seminarunterlagen",
      "Sitzplätze direkt hinter First Class",
      "Direkter Kontakt zu First Class Teilnehmern",
      "Explizite Netzwerkmöglichkeiten",
      "Mittagessen inkl. Softgetränke und Kaffee",
      "Pitchmöglichkeiten durch Mikroübergabe",
    ],
  },
];

function PriceHeading({
  name,
  price,
  oldPrice,
  dark,
}: {
  name: string;
  price: string;
  oldPrice: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${
        dark ? "items-center text-center text-[#0e101c]" : "items-start text-white"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <p className="tracking-[-0.5px]">
          <span className="font-serif text-[34px]">{name} </span>
          <span className="font-display text-[34px]">{price}</span>
        </p>
        <span
          className={`font-serif text-[20px] line-through ${
            dark ? "text-[#0e101c]/45" : "text-white/40"
          }`}
        >
          {oldPrice}
        </span>
      </div>
      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-label text-[11px] font-bold uppercase tracking-[0.08em] ${
          dark
            ? "bg-[#0e101c] text-[#ffbf00]"
            : "bg-purple-2/15 text-purple-2 ring-1 ring-purple-2/30"
        }`}
      >
        <Sparkles className="size-3" />
        Early Bird · bis 31.07.
      </span>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="tickets" className="bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-[120px] lg:py-[140px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:gap-[72px]">
        <Reveal className="flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <span className="h-0.5 w-10 bg-purple-2" />
            <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
              Für wen
            </span>
          </div>
          <h2 className="max-w-[900px] font-serif text-[32px] leading-[1.2] tracking-[-1px] text-white md:text-[48px] md:tracking-[-1.6px]">
            Zwei Wege. Ein Ziel: dein Unternehmen{" "}
            <span className="font-display">ohne dich</span>.
          </h2>
          <div className="flex w-fit items-center gap-2.5 rounded-full border border-[#ffbf00]/40 bg-[#ffbf00]/10 px-4 py-2">
            <Clock className="size-4 text-[#ffbf00]" />
            <span className="font-body text-[14px] font-semibold tracking-[-0.2px] text-[#ffbf00]">
              Early-Bird-Preise – nur noch bis zum 31.07. sichern
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center">
          {TIERS.map((tier, i) => {
            const gold = tier.highlight;
            return (
              <Reveal
                key={tier.name}
                delay={i * 0.1}
                className={`flex-1 ${gold ? "lg:order-2" : i === 0 ? "lg:order-1" : "lg:order-3"}`}
              >
                <div
                  className={`flex h-full flex-col justify-between overflow-hidden rounded-[20px] p-9 ${
                    gold
                      ? "border-[1.5px] border-[#ffeaac] bg-[#ffbf00] lg:h-[894px]"
                      : "border border-white/[0.09] bg-white/[0.02] lg:h-[858px]"
                  }`}
                >
                  <div
                    className={`flex flex-col gap-7 ${gold ? "items-center text-center" : "items-start"}`}
                  >
                    <a
                      href={tier.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${tier.name} Ticket sichern`}
                      className={`group/ticket relative block aspect-[2000/850] w-full overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-1 ${
                        gold ? "max-w-[372px]" : ""
                      }`}
                    >
                      <Image
                        src={tier.ticket}
                        alt={`${tier.name} Ticket — Sales Mastery Days`}
                        fill
                        sizes="400px"
                        className="object-contain transition-transform duration-500 group-hover/ticket:scale-[1.03]"
                      />
                    </a>

                    <PriceHeading
                      name={tier.name}
                      price={tier.price}
                      oldPrice={tier.oldPrice}
                      dark={gold}
                    />
                    <p
                      className={`text-[17px] leading-[1.55] tracking-[-0.3px] ${
                        gold ? "text-[#0e101c]/65" : "text-white/65"
                      } ${gold ? "text-center" : "text-left"} w-full`}
                    >
                      zzgl.&nbsp; MwSt.
                    </p>

                    <ul className="w-full">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className={`flex items-center gap-3.5 border-t py-4 text-left ${
                            gold ? "border-[#0e101c]/[0.08]" : "border-white/[0.08]"
                          }`}
                        >
                          <span
                            className={`size-1.5 shrink-0 rounded-[1px] ${
                              gold ? "bg-[#0e101c]" : "bg-purple-2"
                            }`}
                          />
                          <span
                            className={`text-[15px] leading-[1.4] tracking-[-0.2px] ${
                              gold ? "text-[#0e101c]/[0.82]" : "text-white/[0.78]"
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 w-full">
                    <Button
                      href={tier.checkout}
                      full
                      className="mx-auto w-full max-w-[328px] px-4 text-[13px]"
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
