import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  Lock,
  Play,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import LeitfadenForm from "@/components/leitfaden/LeitfadenForm";
import FooterSection from "@/components/sections/FooterSection";
import {
  ABOUT,
  CHAPTERS,
  CHAPTERS_FOOTNOTE,
  CLOSES,
  DOWNLOAD,
  FAQ,
  FINAL_CTA,
  HERO,
  OBJECTIONS,
  TRACK_RECORD,
  TRUST_LOGOS,
} from "@/lib/leitfaden";
import LeitfadenFaq from "@/components/leitfaden/LeitfadenFaq";

export const metadata: Metadata = {
  title: "Rollenspiel-Leitfaden gratis — Selmir Suljkanovic",
  description:
    "Der Verkaufsleitfaden aus dem Rollenspiel-Video. 10 Seiten, 6 Kapitel — sofort per E-Mail als PDF. Begrüßung, Fragen, Einwandbehandlung und Abschluss.",
  alternates: { canonical: "/leitfaden" },
  openGraph: {
    title: "Rollenspiel-Leitfaden gratis — Selmir Suljkanovic",
    description:
      "Der Verkaufsleitfaden aus dem Rollenspiel-Video, sofort per E-Mail.",
    url: "/leitfaden",
    siteName: "Selmir Suljkanovic",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Stripped-down nav specific to this LP: logo + one CTA. */
function LeitfadenNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-[80px]">
        <a href="/" aria-label="Selmir Suljkanovic — Startseite">
          <Image
            src="/logo-red-dark.svg"
            alt="Selmir Suljkanovic"
            width={140}
            height={40}
            priority
            className="h-9 w-auto md:h-10"
          />
        </a>
        <Button
          href="#download"
          icon={<CalendarDays className="size-5" />}
          className="!h-11 !px-4 !text-[11px] xl:!h-12 xl:!px-6 xl:!text-[13px]"
        >
          Leitfaden sichern
        </Button>
      </div>
    </header>
  );
}

export default function LeitfadenPage() {
  return (
    <>
      <LeitfadenNav />
      <main>
        {/* ─────────── HERO — Figma node 3611:2854 ─────────── */}
        <section className="relative overflow-hidden bg-bg px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-[120px] lg:pb-[112px] lg:pt-[96px]">
          {/* faint grid + purple glows to match the Figma bg */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.035) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0 1px, transparent 1px 96px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-purple-1/25 blur-[140px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-purple-2/20 blur-[140px]"
          />

          <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-[600px_1fr] lg:gap-[120px]">
            {/* Left column: eyebrow, headline, lead, PDF chip, form, trust row */}
            <Reveal className="flex flex-col gap-6">
              <span className="flex items-center gap-[14px] font-body text-[13px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2">
                <span
                  aria-hidden
                  className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2"
                />
                {HERO.eyebrow}
              </span>
              <h1 className="font-serif text-[34px] leading-[1.15] tracking-[-1px] text-white sm:text-[42px] md:text-[48px] lg:text-[50px] lg:leading-[1.18] lg:tracking-[-1.8px]">
                {HERO.headline.line1}
                <br />
                {HERO.headline.line2Serif}{" "}
                <span className="font-display">
                  {HERO.headline.line2Display}
                </span>
              </h1>
              <p className="max-w-[560px] font-body text-[15px] leading-[1.62] text-white/60 lg:text-[16.5px]">
                {HERO.lead}
              </p>

              {/* PDF file badge (Figma "PDF File Badge") */}
              <div className="inline-flex w-fit items-center gap-3.5 rounded-[14px] border border-white/[0.09] bg-white/[0.03] px-4 py-3.5">
                <span className="grid size-[42px] place-items-center rounded-[11px] bg-purple-2/[0.16]">
                  <FileText className="size-[22px] text-purple-2" strokeWidth={1.75} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-body text-[15px] font-semibold tracking-[-0.2px] text-white">
                    {HERO.formTag.title}
                  </span>
                  <span className="font-body text-[13.5px] tracking-[-0.1px] text-white/50">
                    {HERO.formTag.subtitle}
                  </span>
                </div>
              </div>

              {/* Hero form — email + gradient CTA + security note */}
              <div className="w-full">
                <LeitfadenForm
                  variant="hero"
                  submitLabel={HERO.submitLabel}
                  showFirstName={false}
                />
              </div>

              {/* Trust row: Zum Video pill + dot + audience note */}
              <div className="flex flex-wrap items-center gap-[18px]">
                <a
                  href={HERO.video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[9px] rounded-full border border-white/[0.14] bg-white/[0.06] px-5 py-[11px] font-body text-[14px] font-semibold tracking-[-0.1px] text-white/90 transition-colors hover:border-purple-2/60 hover:bg-white/[0.10]"
                >
                  <Play className="size-[16px] fill-purple-2 text-purple-2" />
                  {HERO.video.label}
                </a>
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-white/30"
                />
                <span className="font-body text-[14px] tracking-[-0.1px] text-white/50">
                  {HERO.audience}
                </span>
              </div>
            </Reveal>

            {/* Right column: rich PDF mockup (3-sheet stack) — Figma node 3615:2885 */}
            <Reveal delay={0.1} className="mx-auto w-full max-w-[440px] lg:max-w-none">
              <div className="relative mx-auto aspect-[560/640] w-full max-w-[440px] lg:max-w-[560px]">
                {/* purple glow behind the mockup */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-[24%] size-[62%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,137,255,0.45)_0%,rgba(116,84,243,0.20)_45%,rgba(10,8,18,0)_75%)] blur-[24px]"
                />

                {/* Back sheet 2 (rightmost, offset right + down) */}
                <div
                  aria-hidden
                  className="absolute left-[32%] top-[20%] h-[64%] w-[54%] rounded-[12px] border border-white/[0.06] bg-[#161127] opacity-80"
                />
                {/* Back sheet 1 (slightly closer) */}
                <div
                  aria-hidden
                  className="absolute left-[27%] top-[16%] h-[70%] w-[59%] rounded-[13px] border border-white/[0.08] bg-[#19132d]"
                />

                {/* Main PDF cover */}
                <div
                  className="absolute left-[18%] top-[11%] flex h-[76%] w-[64%] flex-col justify-between overflow-hidden rounded-[14px] border border-purple-2/30 px-[7%] py-[6%]"
                  style={{
                    background:
                      "linear-gradient(117deg, #21183d 14%, #140e25 54%, #0b0816 86%)",
                    boxShadow: "0 34px 90px 0 rgba(112,77,255,0.36)",
                  }}
                >
                  {/* Top accent band (subtle) */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(176,137,255,0.18) 0%, rgba(176,137,255,0) 100%)",
                    }}
                  />
                  <div className="relative flex flex-col gap-4">
                    <Image
                      src="/logo-red-dark.svg"
                      alt="Selmir"
                      width={104}
                      height={34}
                      className="h-[34px] w-auto"
                    />
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="h-[2px] w-[26px] shrink-0 rounded-full bg-purple-2"
                      />
                      <span className="font-body text-[9.5px] font-semibold uppercase tracking-[1.6px] text-purple-2">
                        Vertrieb &amp; Akquise
                      </span>
                    </span>
                    <p className="font-serif text-[24px] leading-[1.2] tracking-[-0.9px] text-white lg:text-[27px]">
                      Rollenspiel-
                      <br />
                      <span className="font-display">Leitfaden:</span>
                    </p>
                    <p className="font-body text-[12.5px] leading-[1.58] tracking-[-0.1px] text-white/70">
                      Marketingagentur{" "}
                      <span className="font-bold text-purple-2">vs.</span>{" "}
                      Handwerksunternehmen
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <div aria-hidden className="h-px w-full bg-white/[0.12]" />
                    <div className="flex items-center justify-between font-body text-[10.5px] uppercase tracking-[1.3px]">
                      <span className="font-semibold text-white/70">
                        Trainingsmaterial
                      </span>
                      <span className="font-medium text-white/40">10 Seiten</span>
                    </div>
                  </div>
                </div>

                {/* Floating PDF · Gratis badge */}
                <span
                  className="absolute right-[6%] top-[6%] rounded-full bg-purple-2 px-3.5 py-2 font-body text-[11px] font-bold uppercase tracking-[0.8px] text-bg"
                  style={{ boxShadow: "0 6px 24px 0 rgba(112,77,255,0.5)" }}
                >
                  PDF · Gratis
                </span>

                {/* caption */}
                <p className="absolute inset-x-0 -bottom-8 text-center font-body text-[13px] tracking-[0.2px] text-white/45">
                  Gratis PDF-Vorschau
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── TRUST BAR ─────────── */}
        <section className="border-y border-white/[0.05] bg-bg px-6 py-8 md:px-10 lg:px-[80px] lg:py-10">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[2.5px] text-white/45">
              Selmir — bekannt aus
            </p>
            <div className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-14">
              {TRUST_LOGOS.map((l) => (
                <div
                  key={l.src}
                  className="relative h-[36px] w-[110px] shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 lg:h-[42px] lg:w-[130px]"
                >
                  <Image
                    src={l.src}
                    alt={l.alt}
                    fill
                    sizes="130px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── Section 1 · Was drin ist ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="flex flex-col items-center text-center">
              <SectionEyebrow>Was drin ist</SectionEyebrow>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:mt-[22px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.6px]">
                Das nimmst du aus dem{" "}
                <span className="font-display">Leitfaden</span> mit.
              </h2>
              <p className="mt-4 max-w-[640px] font-body text-[15px] leading-[1.6] text-white/55 lg:mt-[22px] lg:text-[16px]">
                Kein Theorie-Geschwafel — ein Gesprächsgerüst, das du beim
                nächsten Termin direkt aufs Papier legen kannst.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-[64px] lg:gap-6">
              {CHAPTERS.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal
                    key={c.title}
                    delay={i * 0.06}
                    className="flex h-full flex-col gap-6 rounded-[20px] border border-white/[0.07] bg-[radial-gradient(130%_120%_at_50%_0%,rgba(116,84,243,0.15)_0%,rgba(10,8,18,0)_72%)] p-7 lg:p-9"
                  >
                    <span className="font-body text-[12px] font-semibold uppercase tracking-[2px] text-white/40">
                      {c.n}
                    </span>
                    <div className="mx-auto grid size-[92px] place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] shadow-[inset_0_0_40px_rgba(116,84,243,0.20)]">
                      <Icon
                        className="size-9 text-purple-2"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="font-body text-[18px] font-semibold text-white lg:text-[20px]">
                        {c.title}
                      </h3>
                      <p className="font-body text-[14px] leading-[1.55] text-white/55 lg:text-[15px]">
                        {c.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <p className="mt-8 text-center font-body text-[13px] text-white/50 lg:mt-10">
              {CHAPTERS_FOOTNOTE}
            </p>
          </div>
        </section>

        {/* ─────────── Section 2 · Einwandbehandlung ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="flex flex-col items-center text-center">
              <SectionEyebrow>Die Einwandbehandlung</SectionEyebrow>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:mt-[22px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.6px]">
                Für jeden Einwand{" "}
                <span className="font-display">eine Antwort.</span>
              </h2>
              <p className="mt-4 max-w-[640px] font-body text-[15px] leading-[1.6] text-white/55 lg:mt-[22px] lg:text-[16px]">
                Fünf Einwände plus die Ankertechnik — jeweils mit fertiger
                Formulierung und der Technik dahinter.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-[64px] lg:grid-cols-3 lg:gap-6">
              {OBJECTIONS.map((o, i) => {
                const Icon = o.icon;
                return (
                  <Reveal
                    key={o.title}
                    delay={i * 0.05}
                    className="flex h-full flex-col items-center gap-5 rounded-[20px] border border-white/[0.07] bg-white/[0.02] p-6 text-center lg:p-8"
                  >
                    <div className="grid size-[76px] place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] shadow-[inset_0_0_36px_rgba(116,84,243,0.20)]">
                      <Icon
                        className="size-[30px] text-purple-2"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="font-body text-[16px] font-semibold text-white lg:text-[18px]">
                      {o.title}
                    </h3>
                    <p className="font-body text-[13px] leading-[1.55] text-white/55 lg:text-[14px]">
                      {o.body}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────── Section 3 · Abschlusstechnik ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="flex flex-col items-center text-center">
              <SectionEyebrow>Die Abschlusstechnik</SectionEyebrow>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:mt-[22px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.6px]">
                So endet das Gespräch{" "}
                <span className="font-display">mit einem Ja.</span>
              </h2>
              <p className="mt-4 max-w-[640px] font-body text-[15px] leading-[1.6] text-white/55 lg:mt-[22px] lg:text-[16px]">
                Sieben Techniken stehen im Leitfaden — das sind die drei, die
                den größten Unterschied machen.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-[64px]">
              {CLOSES.map((c, i) => (
                <Reveal
                  key={c.title}
                  delay={i * 0.06}
                  className="flex h-full flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.02]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 400px"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-purple-2/40 bg-black/50 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[1.5px] text-purple-2 backdrop-blur">
                      {c.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="font-body text-[17px] font-semibold text-white lg:text-[19px]">
                      {c.title}
                    </h3>
                    <p className="font-body text-[13px] leading-[1.55] text-white/55 lg:text-[14px]">
                      {c.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── Download / Form ─────────── */}
        <section id="download" className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-[80px]">
            <Reveal className="flex flex-col gap-6">
              <SectionEyebrow>{DOWNLOAD.eyebrow}</SectionEyebrow>
              <h2 className="font-serif text-[30px] leading-[1.15] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.6px]">
                {DOWNLOAD.headline.serif}{" "}
                <span className="font-display">{DOWNLOAD.headline.display}</span>
              </h2>
              <p className="max-w-[520px] font-body text-[15px] leading-[1.6] text-white/60 lg:text-[16px]">
                {DOWNLOAD.lead}
              </p>
              <ul className="mt-2 flex flex-col gap-4">
                {DOWNLOAD.bullets.map((b) => {
                  const Icon = b.icon;
                  return (
                    <li
                      key={b.text}
                      className="flex items-start gap-3 font-body text-[14px] leading-[1.55] text-white/70 lg:text-[15px]"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                        <Icon
                          className="size-3.5 text-purple-2"
                          strokeWidth={2.5}
                        />
                      </span>
                      {b.text}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <LeitfadenForm
                variant="full"
                submitLabel={DOWNLOAD.form.submitLabel}
                firstNamePlaceholder={DOWNLOAD.form.firstNamePlaceholder}
                emailPlaceholder={DOWNLOAD.form.emailPlaceholder}
              />
            </Reveal>
          </div>
        </section>

        {/* ─────────── About Selmir ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-10 lg:flex-row lg:gap-[64px]">
            <Reveal className="w-full max-w-[380px] shrink-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] border border-white/[0.09]">
                <Image
                  src={ABOUT.photo}
                  alt="Selmir Suljkanovic"
                  fill
                  sizes="380px"
                  className="object-cover object-top"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="w-full max-w-[540px]">
              <div className="flex flex-col gap-6">
                <SectionEyebrow>{ABOUT.eyebrow}</SectionEyebrow>
                <h2 className="font-serif text-[30px] leading-[1.15] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:text-[46px] lg:leading-[1.15] lg:tracking-[-1.4px]">
                  {ABOUT.headline.serif}{" "}
                  <span className="font-display">{ABOUT.headline.display}</span>
                </h2>
                {ABOUT.body.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="font-body text-[15px] leading-[1.6] text-white/60 lg:text-[16px]"
                  >
                    {p}
                  </p>
                ))}
                <div className="pt-2">
                  <Button href={ABOUT.cta.href}>
                    {ABOUT.cta.label}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── Track record ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-20 lg:px-[80px] lg:py-[100px]">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="flex flex-col items-center text-center">
              <SectionEyebrow>Der Trackrecord</SectionEyebrow>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:mt-[22px] lg:text-[50px] lg:leading-[59px] lg:tracking-[-1.6px]">
                Zahlen, die{" "}
                <span className="font-display">für sich sprechen.</span>
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4 lg:mt-[56px] lg:grid-cols-4 lg:gap-6">
              {TRACK_RECORD.map((s, i) => (
                <Reveal
                  key={s.value}
                  delay={i * 0.06}
                  className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-6 text-center lg:p-8"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-purple-1 via-purple-2 to-purple-1"
                  />
                  <p className="font-display text-[28px] tracking-[-1px] text-white sm:text-[34px] lg:text-[42px]">
                    {s.value}
                  </p>
                  <p className="mt-2 font-body text-[12px] leading-[1.5] text-white/55 lg:text-[13px]">
                    {s.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── FAQ ─────────── */}
        <section className="bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-[80px] lg:py-[120px]">
          <div className="mx-auto max-w-[900px]">
            <Reveal className="flex flex-col items-center gap-4 text-center">
              <SectionEyebrow>FAQ</SectionEyebrow>
              <h2 className="font-serif text-[30px] leading-[1.18] tracking-[-0.8px] text-white sm:text-[38px] md:text-[44px] lg:text-[46px] lg:leading-[1.15] lg:tracking-[-1.4px]">
                Was du noch{" "}
                <span className="font-display">wissen musst</span>
              </h2>
            </Reveal>

            <div className="mt-10 lg:mt-[56px]">
              <LeitfadenFaq items={FAQ} />
            </div>
          </div>
        </section>

        {/* ─────────── Final CTA banner ─────────── */}
        <section className="bg-bg px-6 pb-24 pt-4 md:px-10 md:pb-32 lg:px-[80px] lg:pb-[140px]">
          <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-[24px] border border-purple-2/30 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(116,84,243,0.30)_0%,rgba(10,8,18,0.85)_60%,rgba(10,8,18,0.95)_100%)] px-6 py-12 text-center md:px-10 md:py-16">
            <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5">
              <SectionEyebrow>{FINAL_CTA.eyebrow}</SectionEyebrow>
              <h2 className="font-serif text-[28px] leading-[1.15] tracking-[-0.8px] text-white sm:text-[34px] md:text-[42px] lg:text-[46px] lg:leading-[1.15] lg:tracking-[-1.4px]">
                {FINAL_CTA.headline.serif}{" "}
                <span className="font-display">
                  {FINAL_CTA.headline.display}
                </span>
              </h2>
              <p className="max-w-[520px] font-body text-[14px] leading-[1.55] text-white/60 lg:text-[15px]">
                {FINAL_CTA.body}
              </p>
              <Button href="#download" icon={<ChevronRight className="size-5" />} className="mt-2">
                {FINAL_CTA.submitLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterSection landing />
    </>
  );
}

/** Purple ruled eyebrow — inlined to keep this page self-contained. */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-[14px] font-body text-[12px] font-semibold uppercase leading-[16px] tracking-[2px] text-purple-2 lg:text-[13px]">
      <span
        aria-hidden
        className="h-[2px] w-[40px] shrink-0 rounded-full bg-purple-2"
      />
      {children}
    </span>
  );
}
