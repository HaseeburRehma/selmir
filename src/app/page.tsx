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
