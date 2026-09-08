import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "Führung im Vertrieb — Seminare | Selmir Suljkanovic",
  description:
    "Führung im Vertrieb — für Vertriebsleiter, die ihr Team wirklich führen wollen. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="Führung im Vertrieb"
      subtitle="Für Vertriebsleiter, die ihr Team wirklich führen wollen."
    />
  );
}
