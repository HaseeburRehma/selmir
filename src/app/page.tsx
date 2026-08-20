import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import GastSpeakerSection from "@/components/sections/GastSpeakerSection";
import StoriesSection from "@/components/sections/StoriesSection";
import PricingSection from "@/components/sections/PricingSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import AboutSection from "@/components/sections/AboutSection";
import TeamSection from "@/components/sections/TeamSection";
import GallerySection from "@/components/sections/GallerySection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <GastSpeakerSection />
        <StoriesSection />
        <PricingSection />
        <CaseStudiesSection />
        <AboutSection />
        <TeamSection />
        <GallerySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <FooterSection />
    </>
  );
}
