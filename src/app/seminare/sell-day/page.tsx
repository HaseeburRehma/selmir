import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "SELL Day — Seminare | Selmir Suljkanovic",
  description:
    "SELL Day — kompaktes Ein-Tages-Seminar für konkrete Verkaufstechniken. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="SELL Day"
      subtitle="Ein Tag. Konkrete Verkaufstechniken. Sofort umsetzbar."
    />
  );
}
