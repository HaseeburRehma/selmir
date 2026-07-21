import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import GastSpeakerSection from "@/components/sections/GastSpeakerSection";
import StoriesSection from "@/components/sections/StoriesSection";
import PricingSection from "@/components/sections/PricingSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import AboutSection from "@/components/sections/AboutSection";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
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
        <GallerySection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <FooterSection />
    </>
  );
}
