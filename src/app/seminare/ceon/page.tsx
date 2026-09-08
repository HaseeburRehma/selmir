import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "CEON — Seminare | Selmir Suljkanovic",
  description:
    "CEON — exklusives Format für Geschäftsführer & CEOs. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="CEON"
      subtitle="Exklusives Format für Geschäftsführer & CEOs."
    />
  );
}
