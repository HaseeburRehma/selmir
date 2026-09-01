import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import HomeHero from "@/components/sections/HomeHero";
import WegweiserSection from "@/components/sections/WegweiserSection";
import LeistungenSection from "@/components/sections/LeistungenSection";
import NetzwerkerSection from "@/components/sections/NetzwerkerSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import PodcastTeaserSection from "@/components/sections/PodcastTeaserSection";
import PricingSection from "@/components/sections/PricingSection";
import BookTeaserSection from "@/components/sections/BookTeaserSection";
import GallerySection from "@/components/sections/GallerySection";
import TeamSection from "@/components/sections/TeamSection";
import GoogleReviewsSection from "@/components/sections/GoogleReviewsSection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import FooterSection from "@/components/sections/FooterSection";

/**
 * Homepage — follows the Figma design at:
 *   figma.com/design/F1g6IZRLXPVfVXfoufAPj3?node-id=3721-2861
 *
 * The Sales-Mastery-event flow (previously at /) now lives at
 * /sales-mastery — this root focuses on Selmir's overall brand and
 * services with a clearer wayfinding structure.
 */

// SEO metadata for `/`. Overrides the site-wide defaults set in
// `src/app/layout.tsx` (which target the SMD event flow) so the root
// document reflects Selmir's current brand positioning instead.
const HOME_TITLE =
  "Vertriebsberatung & Struktur für Unternehmer | Selmir Suljkanovic";
const HOME_DESCRIPTION =
  "Mehr Abschlüsse, planbarer Umsatz, ein Betrieb der ohne dich läuft. Selmir Suljkanovic systematisiert Vertrieb und Führung in inhabergeführten Unternehmen.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://selmir-suljkanovic.de/",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Selmir Suljkanovic — Vertriebsberatung & Struktur für Unternehmer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomeHero />
        <WegweiserSection />
        <LeistungenSection />
        <NetzwerkerSection />
        {/*
          Case studies with the podcast teaser slotted between the
          Jürgen Hohnen and Hörmann cases (Figma comment: "we need a
          section linking to podcast pages"). Ticket pricing comes
          straight after the last case study (Figma comment: "Add Ticket
          section here from sales mastery page").
        */}
        <CaseStudiesSection
          insertAfter={{ Hohnen: <PodcastTeaserSection /> }}
        />
        <PricingSection />
        <BookTeaserSection />
        <GallerySection />
        <TeamSection />
        <GoogleReviewsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <FooterSection />
    </>
  );
}
