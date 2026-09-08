import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "Sales Academy — Seminare | Selmir Suljkanovic",
  description:
    "Sales Academy — das mehrmonatige Ausbildungsprogramm für Vertriebsprofis. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="Sales Academy"
      subtitle="Das mehrmonatige Ausbildungsprogramm für Vertriebsprofis."
    />
  );
}
