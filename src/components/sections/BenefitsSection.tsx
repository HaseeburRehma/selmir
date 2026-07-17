import { Reveal } from "@/components/ui/Reveal";

const BENEFITS = [
  {
    icon: "/icons/benefit-1.png",
    title: "Verkaufstechniken, die heute wirklich funktionieren",
    desc: "Lerne moderne Methoden, um Gespräche klar zu führen, Einwände souverän zu lösen und Kunden gezielt zum Abschluss zu bringen.",
  },
  {
    icon: "/icons/benefit-2.png",
    title: "Verkaufstechniken, die Abschlüsse planbar machen",
    desc: "Beherrsche Fragen, Einwand-Engineering und Follow-ups, die wirken. Führe Gespräche, die abschließen, nicht diskutieren.",
  },
  {
    icon: "/icons/benefit-3.png",
    title: "Einwand-Engineering auf höchstem Niveau",
    desc: "Erkenne Kaufmotive, löse Widerstände gezielt auf und verwandle Unsicherheit in Vertrauen, live mit echten Praxisbeispielen.",
  },
  {
    icon: "/icons/benefit-4.png",
    title: "Abschlussstärke durch klare Gesprächsführung",
    desc: "Trainiere, wie du mit Timing, Emotion und Klarheit den entscheidenden Moment im Verkauf meisterst, ohne Druck, aber mit Wirkung.",
  },
  {
    icon: "/icons/benefit-5.png",
    title: "Mindset, das dich durch jede Herausforderung trägt",
    desc: "Erlebe, wie du mit mentaler Stärke, Routinen und Fokus auch in stressigen Phasen deine Performance konstant hoch hältst.",
  },
  {
    icon: "/icons/benefit-6.png",
    title: "Netzwerk & Austausch mit echten Machern",
    desc: "Triff andere Unternehmer, Vertriebler und Führungskräfte, die auf Wachstum setzen, Inspiration und neue Partnerschaften garantiert.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="event" className="relative bg-bg py-24 md:py-32">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 flex max-w-[760px] flex-col items-center text-center md:mb-20">
          <span className="mb-6 inline-flex items-center rounded-full border border-purple-1/40 bg-purple-1/10 px-4 py-1.5 font-label text-[11px] uppercase tracking-[0.2em] text-purple-2">
            Über Event
          </span>
          <h2 className="font-serif text-[34px] leading-[1.15] tracking-[-0.5px] text-white md:text-[48px]">
            Warum du dieses Event auf keinen Fall verpassen solltest
          </h2>
          <p className="mt-5 max-w-[620px] font-body text-[16px] leading-[1.6] text-white/60">
            Dieses Wissen bekommst du nur live vor Ort, direkt von Selmir
            Suljkanovic und seinem Experten-Team.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-purple-2/40 hover:bg-white/[0.04]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.icon}
                  alt=""
                  className="mb-4 -ml-2 h-[84px] w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="mb-3 font-serif text-[20px] leading-[1.3] text-white">
                  {b.title}
                </h3>
                <p className="font-body text-[15px] leading-[1.6] text-white/60">
                  {b.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
