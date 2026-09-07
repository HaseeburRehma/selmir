import type { Metadata } from "next";
import BetriebsRoentgenTool from "@/components/betriebs-roentgen/BetriebsRoentgenTool";

export const metadata: Metadata = {
  title:
    "Der Betriebs-Röntgen — In 3 Minuten zur ehrlichen Analyse | Selmir Suljkanovic",
  description:
    "Wo steht dein Betrieb wirklich? Der Betriebs-Röntgen zeigt schwarz auf weiß, wo Wachstum blockiert, wie viel Umsatz du verschenkst und was dich vom nächsten Level trennt.",
  alternates: { canonical: "/betriebs-roentgen" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Der Betriebs-Röntgen — Selmir Suljkanovic",
    description:
      "In 3 Minuten zur ehrlichen Betriebs-Analyse. Kennzahlen, Diagnose, individuelles Röntgenbild — vom Team persönlich ausgewertet.",
    url: "https://selmir-suljkanovic.de/betriebs-roentgen",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/**
 * `/betriebs-roentgen` — the interactive lead tool that replaces the
 * old "Potenzialanalyse" subpage per the dev-handover brief. The tool
 * itself is a client component (state machine); this page just wraps
 * it with proper metadata and skips the site nav — the wizard has its
 * own minimal top bar so nothing competes for attention.
 */
export default function BetriebsRoentgenPage() {
  return (
    <main>
      <BetriebsRoentgenTool />
    </main>
  );
}
