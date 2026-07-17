import type { Metadata } from "next";
import { Prata, Days_One, Inter, Archivo, Great_Vibes } from "next/font/google";
import "./globals.css";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
  display: "swap",
});

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-daysone",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Substitute for the commercial "Blauer Nue" used on labels/buttons in the Figma file.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Signature-style wordmark logo ("Selmir")
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sales Mastery Days 2026 — Selmir Suljkanovic",
  description:
    "Das wichtigste Event im Jahr 2026 für Selbstständige und Unternehmer. Zwei Tage, die deinen Vertrieb neu aufstellen. Live in Düsseldorf mit Selmir Suljkanovic.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${prata.variable} ${daysOne.variable} ${inter.variable} ${archivo.variable} ${greatVibes.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
