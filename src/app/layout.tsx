import type { Metadata } from "next";
import Script from "next/script";
import { Prata, Days_One, Inter, Archivo, Great_Vibes } from "next/font/google";
import "./globals.css";

const GTM_ID = "GTM-NDNHKBX9";
const META_PIXEL_ID = "1677666316641507";

// Microsoft Clarity — click / scroll / rage-click heatmaps + session
// recordings for EVERY page on the site (root layout wraps them all).
// The id is a public token (Clarity's snippet is shipped in every
// page's HTML), so it's baked in here alongside GTM_ID / META_PIXEL_ID
// — no separate env var to keep in sync across environments. To swap
// projects, replace the string below (or set
// NEXT_PUBLIC_CLARITY_PROJECT_ID in Vercel to override without a
// code change).
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "yiqkjah7vn";

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
    other: {
      "facebook-domain-verification": "5kdghk1yknkvjc8jyn8mdvdd7ygd6l",
    },
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
        {/* Google Tag Manager — deferred to browser idle so ~130KB of GTM/GA
            JS doesn't block the LCP paint. Still fires the pageview on load. */}
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Meta Pixel — deferred to browser idle for the same reason. */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        {/* End Meta Pixel */}

        {/* Microsoft Clarity — heatmaps + session recordings on every
            page. Only rendered when NEXT_PUBLIC_CLARITY_PROJECT_ID is
            configured, so local dev + preview branches without the env
            var stay clean. `strategy="lazyOnload"` keeps ~40KB of
            Clarity JS out of the LCP critical path. */}
        {CLARITY_PROJECT_ID && (
          <Script id="ms-clarity" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
          </Script>
        )}
        {/* End Microsoft Clarity */}
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

        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}
        {children}
      </body>
    </html>
  );
}
