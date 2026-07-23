import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt — Selmir Suljkanovic",
  description:
    "Nimm Kontakt auf zu den Sales Mastery Days. Wir freuen uns auf deine Nachricht.",
};

const DETAILS = [
  {
    icon: Mail,
    label: "E-Mail",
    value: "info@sh-wachstum.de",
    href: "mailto:info@sh-wachstum.de",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "0201 49869220",
    href: "tel:020149869220",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Zweigertstraße 50, 45130 Essen",
    href: undefined,
  },
];

export default function KontaktPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-bg px-6 pt-[136px] pb-24 md:px-12 md:pt-[168px] md:pb-32 lg:px-[120px]">
          {/* subtle grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.045) 0 1px, transparent 1px 96px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-purple-1/15 blur-[150px]"
          />

          <div className="relative z-10 mx-auto max-w-[1160px]">
            {/* Header */}
            <Reveal className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-3.5">
                <span className="h-0.5 w-10 bg-purple-2" />
                <span className="font-body text-[13px] font-semibold uppercase tracking-[2px] text-purple-2">
                  Kontakt
                </span>
                <span className="h-0.5 w-10 bg-purple-2" />
              </div>
              <h1 className="font-serif text-[38px] leading-[1.12] tracking-[-1px] text-white sm:text-[52px] md:text-[64px] md:tracking-[-2px]">
                Sprich <span className="font-display">mit uns</span>
              </h1>
              <p className="max-w-[560px] font-body text-[16px] leading-[1.6] tracking-[-0.3px] text-white/65 md:text-[17px]">
                Du hast eine Frage zu den Sales Mastery Days oder möchtest mit uns
                zusammenarbeiten? Schreib uns über das Formular – wir melden uns
                schnellstmöglich zurück.
              </p>
            </Reveal>

            {/* Info + form */}
            <div className="mt-14 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
              {/* Left: contact details */}
              <Reveal className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-[26px] leading-tight text-white md:text-[30px]">
                    Direkt erreichbar
                  </h2>
                  <p className="font-body text-[15px] leading-[1.6] text-white/60">
                    Lieber klassisch? Erreiche uns auch telefonisch oder per
                    E-Mail.
                  </p>
                </div>

                <ul className="flex flex-col gap-5">
                  {DETAILS.map((d) => {
                    const Icon = d.icon;
                    const content = (
                      <>
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-purple-1/15 text-purple-2">
                          <Icon className="size-5" />
                        </span>
                        <span className="flex flex-col">
                          <span className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-white/40">
                            {d.label}
                          </span>
                          <span className="font-body text-[16px] text-white/85">
                            {d.value}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={d.label}>
                        {d.href ? (
                          <a
                            href={d.href}
                            className="group flex items-center gap-4 transition-opacity hover:opacity-80"
                          >
                            {content}
                          </a>
                        ) : (
                          <div className="flex items-center gap-4">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              {/* Right: form */}
              <Reveal delay={0.1}>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-6 md:p-9">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
