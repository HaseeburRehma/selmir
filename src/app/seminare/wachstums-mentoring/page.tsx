import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "Wachstums-Mentoring — Seminare | Selmir Suljkanovic",
  description:
    "Wachstums-Mentoring — 1:1 Sparring für Unternehmer im Skalierungsmodus. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="Wachstums-Mentoring"
      subtitle="1:1 Sparring für Unternehmer im Skalierungsmodus."
    />
  );
}
