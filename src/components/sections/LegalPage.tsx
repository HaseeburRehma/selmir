import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import FooterSection from "@/components/sections/FooterSection";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container-page pb-24 pt-32 md:pt-40">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-body text-[14px] text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="font-serif text-[34px] leading-[1.15] tracking-[-0.5px] text-white md:text-[52px]">
          {title}
        </h1>
        <article className="legal-prose mt-10 max-w-[820px]">{children}</article>
      </main>
      <FooterSection />
    </>
  );
}
