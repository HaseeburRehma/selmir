/**
 * Minimal landing-page footer. A conversion page keeps the visitor on the
 * page, so this carries no site navigation, socials or resources — only the
 * two legally required links (Impressum, Datenschutz) and the copyright line.
 */
export default function LpFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07050e] px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 text-center font-body text-[13px] tracking-[-0.2px] text-white/45 sm:flex-row sm:justify-between sm:text-left">
        <p>© 2026 Selmir Suljkanovic. Alle Rechte vorbehalten.</p>
        <div className="flex gap-7">
          <a href="/impressum" className="transition-colors hover:text-white/70">
            Impressum
          </a>
          <a
            href="/datenschutz"
            className="transition-colors hover:text-white/70"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </footer>
  );
}
