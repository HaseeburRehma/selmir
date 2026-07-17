"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type Item = { q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    q: "Ist das Event wirklich praxisnah oder nur Theorie?",
    a: (
      <>
        <p className="italic text-white/70">
          Die Sales Mastery Days sind zu 100 % auf Praxis ausgelegt.
        </p>
        <p>
          Du arbeitest live an echten Verkaufssituationen – von Einwandbehandlung
          bis Closing. Statt trockener Theorie bekommst du{" "}
          <span className="font-semibold text-white/[0.92]">
            konkrete Formulierungen, Gesprächsstrategien und Systeme
          </span>
          , die du direkt nach dem Event anwenden kannst.
        </p>
        <p>
          <span className="font-semibold text-white/[0.92]">Wichtig:</span> Du
          gehst nicht mit Notizen – sondern mit umsetzbaren Ergebnissen.
        </p>
      </>
    ),
  },
  {
    q: "Für wen sind die Sales Mastery Days geeignet?",
    a: (
      <p>
        Für Selbstständige, Unternehmer und Führungskräfte aus Handwerk, Agenturen
        und Immobilien, die ihren Vertrieb systematisieren wollen – vom Einsteiger
        bis zum erfahrenen Closer.
      </p>
    ),
  },
  {
    q: "Was macht das Sales Mastery Day Event einzigartig?",
    a: (
      <p>
        Kein Motivations-Feuerwerk, sondern erprobte Systeme, Gesprächsstrukturen
        und Closing-Techniken – live von Selmir Suljkanovic und seinem
        Experten-Team, direkt an echten Praxisbeispielen.
      </p>
    ),
  },
  {
    q: "Wie schnell sehe ich Ergebnisse nach dem Event?",
    a: (
      <p>
        Die Techniken sind ab Montag einsetzbar. Viele Teilnehmer führen bereits
        in der ersten Woche nach dem Event Gespräche sicherer und schließen
        planbarer ab.
      </p>
    ),
  },
  {
    q: "Lohnt sich das Investment wirklich?",
    a: (
      <p>
        Ein einziger zusätzlicher Abschluss spielt dein Ticket meist um ein
        Vielfaches wieder ein. Du investierst nicht in zwei Tage – sondern in einen
        Vertrieb, der dauerhaft ohne dich funktioniert.
      </p>
    ),
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-bg px-6 pb-28 pt-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[900px]">
        <Reveal className="mb-12 flex flex-col items-center gap-5 text-center lg:mb-16">
          <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            FAQs
          </span>
          <h2 className="font-serif text-[32px] leading-[1.18] tracking-[-1px] text-white md:text-[50px] md:tracking-[-1.8px]">
            Was du noch <span className="font-display">wissen musst</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-4">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen
                      ? "border-purple-2/30 bg-white/[0.03]"
                      : "border-white/[0.09] bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-4 p-[30px] text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 font-body text-[18px] font-semibold leading-[26px] text-white md:text-[20px]">
                      {item.q}
                    </span>
                    <span className="grid size-5 shrink-0 place-items-center text-purple-2">
                      {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="space-y-3 px-[30px] pb-[30px] font-body text-[16px] leading-[26px] text-white/50">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
