import type { Metadata } from "next";
import Script from "next/script";
import { Prata, Days_One, Inter, Archivo, Great_Vibes } from "next/font/google";
import "./globals.css";

const GTM_ID = "GTM-NDNHKBX9";

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
  verification: {
    google: "_KS332maxCyUk5SIxQfPsbzLugkehvqpz1Hwi0fSjXU",
  },
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
