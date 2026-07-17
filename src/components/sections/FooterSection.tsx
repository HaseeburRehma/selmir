import { Logo } from "@/components/ui/Logo";

const SOCIALS: { label: string; href: string }[] = [
  {
    label: "IG",
    href: "https://www.instagram.com/selmir.suljkanovic_official/",
  },
  { label: "IN", href: "#" },
  { label: "X", href: "#" },
  { label: "YT", href: "https://www.youtube.com/@SelmirSuljkanovic" },
];

const COLUMNS = [
  {
    title: "Navigation",
    links: ["Leistungen", "Methode", "Case Studies", "Über", "Karriere", "Kontakt"],
  },
  {
    title: "Ressourcen",
    links: ["Webinare", "Blog", "Impressum", "Datenschutz"],
  },
  {
    title: "Kontakt",
    links: ["info@sh-wachstum.de", "0201 - 498 692 20"],
  },
];

/** Route legal links, mailto: for emails, tel: for phone numbers. */
function linkHref(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("impressum")) return "/impressum";
  if (l.includes("datenschutz")) return "/datenschutz";
  if (label.includes("@")) return `mailto:${label}`;
  if (/\d{3,}/.test(label)) return `tel:${label.replace(/[^\d+]/g, "")}`;
  return "#";
}

// SVGs that already include their own white card background
const FULL_CARD = [
  "pay-amex.svg",
  "pay-stripe.svg",
  "pay-applepay.svg",
  "pay-visa.svg",
  "pay-klarna.svg",
];
// SVGs that are just the brand mark and need a white chip behind them
const MARK_ONLY = ["pay-mastercard.svg", "pay-maestro.svg", "pay-paypal.svg"];

const PRESS = ["press-1.png", "press-2.png", "press-3.png"];

function CardBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-[30px] w-[44px] place-items-center overflow-hidden rounded-[4px]">
      {children}
    </span>
  );
}

function WhiteChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-[30px] w-[44px] place-items-center overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-white p-[5px]">
      {children}
    </span>
  );
}

export default function FooterSection() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#07050e] px-6 pt-24 md:px-12 lg:px-[120px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14">
        <div className="flex flex-col justify-between gap-14 lg:flex-row">
          {/* Brand + socials */}
          <div className="flex w-full max-w-[360px] flex-col gap-7">
            <Logo className="items-start" />
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="grid size-10 place-items-center rounded-full border border-purple-2/[0.22] bg-white/5 font-body text-[11px] font-semibold tracking-[0.5px] text-white/80 transition-colors hover:bg-white/10"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <p className="font-body text-[15px] leading-[1.6] tracking-[-0.2px] text-white/50">
              Struktur und Vertrieb für Handwerk, Agenturen und Immobilien. Damit
              dein Unternehmen auch ohne dich funktioniert.
            </p>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-[15px] pt-2">
              {FULL_CARD.map((p) => (
                <CardBox key={p}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/figma/footer/${p}`} alt="" className="h-full w-full object-contain" />
                </CardBox>
              ))}
              {MARK_ONLY.map((p) => (
                <WhiteChip key={p}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/figma/footer/${p}`} alt="" className="h-full w-full object-contain" />
                </WhiteChip>
              ))}
              <WhiteChip>
                <span className="flex items-center gap-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/figma/footer/pay-gpay-g.svg" alt="" className="h-[14px] w-auto" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/figma/footer/pay-gpay-pay.svg" alt="Google Pay" className="h-[11px] w-auto" />
                </span>
              </WhiteChip>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-x-16 gap-y-10 md:gap-x-[88px]">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-[18px]">
                <p className="font-body text-[15px] font-semibold tracking-[-0.2px] text-white">
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href={linkHref(l)}
                    className="font-body text-[15px] tracking-[-0.2px] text-white/[0.52] transition-colors hover:text-white/80"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Press logos */}
        <div className="flex flex-nowrap items-center justify-center gap-5 opacity-50 sm:justify-start sm:gap-8">
          {PRESS.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p}
              src={`/figma/footer/${p}`}
              alt=""
              className="h-[18px] w-auto shrink-0 object-contain sm:h-[26px]"
            />
          ))}
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col items-start justify-between gap-4 font-body text-[14px] tracking-[-0.2px] text-white/45 sm:flex-row sm:items-center">
          <p>© 2026 Selmir Suljkanovic. Alle Rechte vorbehalten.</p>
          <div className="flex gap-7">
            <a href="/impressum" className="transition-colors hover:text-white/70">Impressum</a>
            <a href="/datenschutz" className="transition-colors hover:text-white/70">Datenschutz</a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="pointer-events-none mt-8 flex h-[90px] items-start justify-center overflow-hidden md:h-[130px]">
        <span className="select-none whitespace-nowrap font-display text-[120px] leading-none tracking-[-6px] text-white/[0.08] md:text-[220px] md:tracking-[-8px]">
          Selmir
        </span>
      </div>
    </footer>
  );
}
