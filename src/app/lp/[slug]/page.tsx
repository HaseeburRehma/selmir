import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LpNav from "@/components/landing/LpNav";
import LpHero from "@/components/landing/LpHero";
import LpProof from "@/components/landing/LpProof";
import LpProblem from "@/components/landing/LpProblem";
import LpSolution from "@/components/landing/LpSolution";
import LpSteps from "@/components/landing/LpSteps";
import LpAudience from "@/components/landing/LpAudience";
import LpAbout from "@/components/landing/LpAbout";
import LpStories from "@/components/landing/LpStories";
import LpCaseStudy from "@/components/landing/LpCaseStudy";
import LpOffer from "@/components/landing/LpOffer";
import LpFaq from "@/components/landing/LpFaq";
import LpFinalCta from "@/components/landing/LpFinalCta";
import FooterSection from "@/components/sections/FooterSection";

import { CASE_STUDIES, LANDING_PAGES, getLandingPage } from "@/lib/landing-pages";

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};

  const title = `${page.name} — Selmir Suljkanovic`;
  return {
    title,
    description: page.metaDescription,
    alternates: { canonical: `/lp/${page.slug}` },
    openGraph: {
      title,
      description: page.metaDescription,
      url: `/lp/${page.slug}`,
      siteName: "Selmir Suljkanovic",
      locale: "de_DE",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: page.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.metaDescription,
      images: ["/og.jpg"],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  return (
    <>
      <LpNav />
      <main>
        <LpHero hero={page.hero} />
        <LpProof />
        <LpProblem />
        <LpSolution />
        <LpSteps />
        <LpAudience />
        <LpAbout />
        <LpStories />
        {CASE_STUDIES.map((study) => (
          <LpCaseStudy key={study.eyebrow} study={study} />
        ))}
        <LpOffer pageName={page.name} />
        <LpFaq />
        <LpFinalCta />
      </main>
      <FooterSection />
    </>
  );
}
