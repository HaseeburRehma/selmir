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

const SITE_TITLE = "Sales Mastery Days 2026 — Selmir Suljkanovic";
const SITE_DESCRIPTION =
  "Das wichtigste Event im Jahr 2026 für Selbstständige und Unternehmer. Zwei Tage, die deinen Vertrieb neu aufstellen. Live in Düsseldorf mit Selmir Suljkanovic.";

export const metadata: Metadata = {
  metadataBase: new URL("https://selmir-suljkanovic.de"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://selmir-suljkanovic.de",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Sales Mastery Days 2026 — Selmir Suljkanovic, 21.11 & 22.11.2026, Düsseldorf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
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
