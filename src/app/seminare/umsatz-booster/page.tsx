import type { Metadata } from "next";
import { UnderConstruction } from "@/components/sections/UnderConstruction";

export const metadata: Metadata = {
  title: "Umsatz Booster — Seminare | Selmir Suljkanovic",
  description:
    "Umsatz Booster — Kurzformat, um Deals wieder ins Rollen zu bringen. Details folgen in Kürze.",
};

export default function Page() {
  return (
    <UnderConstruction
      title="Umsatz Booster"
      subtitle="Kurzformat, um Deals wieder ins Rollen zu bringen."
    />
  );
}
