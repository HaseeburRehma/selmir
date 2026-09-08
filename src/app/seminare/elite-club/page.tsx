import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "Elite Club — Seminare | Selmir Suljkanovic",
  description:
    "Elite Club — handverlesenes Netzwerk. Nur auf Einladung. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="Elite Club"
      subtitle="Handverlesenes Netzwerk. Nur auf Einladung."
    />
  );
}
