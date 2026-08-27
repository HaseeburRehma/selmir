import {
  Brain,
  Compass,
  Crown,
  GraduationCap,
  MessageSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Leistungen — Womit wir dein Wachstum bauen"
 * (Figma node 3724:2875).
 *
 * Six programs in a 1/2/3-column responsive grid. Each card has a
 * purple-glow icon disc, name, and 2-line description.
 */

type Service = {
  icon: LucideIcon;
  name: string;
  body: string;
};

const SERVICES: Service[] = [
  {
    icon: MessageSquare,
    name: "Vertrieb",
    body:
      "Gesprächsstrukturen, Einwandbehandlung und Abschlusstechniken, die nicht vom Bauchgefühl abhängen, sondern vom System.",
  },
  {
    icon: Brain,
    name: "Persönlichkeitsentwicklung",
    body:
      "Management und persönliche Entwicklung gehen Hand in Hand – hier arbeitest du an Haltung, Fokus und Führung.",
  },
  {
    icon: Compass,
    name: "Wachstumsmentoring",
    body:
      "Dein Navigator in der Welt des systematisierten Erfolgs: begleitetes Wachstum vom Marketing bis zur Auslieferung.",
  },
  {
    icon: GraduationCap,
    name: "Sales Academy",
    body:
      "Über 12 Jahre Management-Wissen als Programm für dich und deine Führungskräfte – strukturiert und wiederholbar.",
  },
  {
    icon: Crown,
    name: "Elite Club",
    body:
      "Das Umfeld gewinnt immer. Ein Netzwerk aus Unternehmern, Vertrieblern und Machern, das dich weiterträgt.",
  },
  {
    icon: Users,
    name: "Führungsseminar",
    body:
      "Klare Führung, strukturierte Prozesse: so entwickelst du nicht nur ein Business, sondern auch Menschen.",
  },
];

export default function LeistungenSection() {
  return (
    <section
      id="leistungen"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-28 lg:px-[120px] lg:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-purple-1/15 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-purple-2/15 blur-[160px]"
      />

      <div className="container-page relative">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="flex items-center gap-3 font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
            <span
              aria-hidden
              className="h-[2px] w-10 rounded-full bg-purple-2"
            />
            Leistungen
          </span>
          <h2 className="max-w-[880px] font-serif text-[32px] leading-[1.15] tracking-[-1px] text-white md:text-[44px] lg:text-[52px] lg:tracking-[-1.6px]">
            Womit wir dein{" "}
            <span className="font-display">Wachstum bauen.</span>
          </h2>
          <p className="max-w-[720px] font-body text-[15.5px] leading-[1.6] text-white/60 md:text-[16.5px]">
            Vom ersten Gespräch bis zur Auslieferung: Programme, die Vertrieb,
            Führung und Prozesse zusammenbringen.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:mt-[72px] lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.name}
                delay={i * 0.05}
                className="group flex h-full flex-col gap-5 rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-purple-2/50 hover:bg-white/[0.04] lg:p-8"
              >
                <span className="grid size-[54px] shrink-0 place-items-center rounded-[14px] border border-purple-2/25 bg-purple-2/[0.14] shadow-[inset_0_0_28px_rgba(116,84,243,0.35)]">
                  <Icon
                    className="size-[22px] text-purple-2"
                    strokeWidth={1.75}
                  />
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-[22px] leading-[1.2] tracking-[-0.4px] text-white lg:text-[24px]">
                    {s.name}
                  </h3>
                  <p className="font-body text-[14.5px] leading-[1.55] text-white/60 lg:text-[15px]">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
