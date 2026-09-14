import type { Metadata } from "next";

import LpNav from "@/components/landing/LpNav";
import LpHeroPainpoints from "@/components/landing/LpHeroPainpoints";
import LpProof from "@/components/landing/LpProof";
import LpProblemPainpoints from "@/components/landing/LpProblemPainpoints";
import LpSolution from "@/components/landing/LpSolution";
import LpSteps from "@/components/landing/LpSteps";
import LpAudience from "@/components/landing/LpAudience";
import LpAbout from "@/components/landing/LpAbout";
import LpTeam from "@/components/landing/LpTeam";
import LpCaseStudy from "@/components/landing/LpCaseStudy";
import LpOfferPainpoints from "@/components/landing/LpOfferPainpoints";
import LpFaq from "@/components/landing/LpFaq";
import LpFinalCta from "@/components/landing/LpFinalCta";
import FooterSection from "@/components/sections/FooterSection";
import GoogleReviewsSection from "@/components/sections/GoogleReviewsSection";

import { CASE_STUDIES } from "@/lib/landing-pages";

/**
 * Handwerker-Painpoints — allgemeine Painpoint-Landingpage für die
 * Erstgespräch-Videokampagne. 1:1 structural clone of the existing 8 LPs
 * (same sections, same order, same length) with three swaps only:
 *
 *   • Hero → LpHeroPainpoints (2-col, form on the right)
 *   • Problem → LpProblemPainpoints (6 painpoints, title + description)
 *   • Offer form → LpLeadFormPainpoints (Vorname / Nachname / Telefon /
 *     E-Mail, writes to the dedicated HubSpot segment
 *     "Handwerk Erstgespräch – Potenzialanalyse")
 *
 * Everything else — trust logos, Der Beweis, Nutzen, all 4 case studies
 * incl. Hörmann 4→18 Mio, Team, So läufts ab, Für wen, Über Selmir,
 * Google reviews, FAQ, Final CTA, Footer — is identical to the other LPs.
 *
 * This static route file takes precedence over /lp/[slug], so the URL
 * `/lp/handwerker-painpoints` renders THIS page and no entry needs to be
 * added to `LANDING_PAGES`.
 */

const NAME = "Achtung Handwerksunternehmer. Kostenlose Potenzialanalyse.";
const DESCRIPTION =
  "Zu wenig Aufträge trotz genug Anfragen? Alles hängt an dir? In einer kostenlosen Potenzialanalyse zeige ich dir, wo Umsatz in deinem Betrieb liegen bleibt.";

export const metadata: Metadata = {
  title: `${NAME} — Selmir Suljkanovic`,
  description: DESCRIPTION,
  alternates: { canonical: "/lp/handwerker-painpoints" },
  openGraph: {
    title: `${NAME} — Selmir Suljkanovic`,
    description: DESCRIPTION,
    url: "/lp/handwerker-painpoints",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} — Selmir Suljkanovic`,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export default function HandwerkerPainpointsPage() {
  return (
    <>
      <LpNav />
      <main>
        <LpHeroPainpoints />
        <LpProof />
        <LpProblemPainpoints />
        <LpSolution />
        {/* The four case studies land straight after "Die Lösung" — the
            proof follows the claim, before the how ("So läuft's ab"). */}
        {CASE_STUDIES.map((study) => (
          <LpCaseStudy key={study.eyebrow} study={study} />
        ))}
        <LpTeam />
        <LpSteps />
        <LpAudience />
        <LpAbout />
        {/* Google reviews land right before the offer — social proof
            primes the decision immediately before the form appears. */}
        <GoogleReviewsSection />
        <LpOfferPainpoints />
        <LpFaq />
        <LpFinalCta />
      </main>
      <FooterSection landing />
    </>
  );
}
