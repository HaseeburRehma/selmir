# Sales Mastery Days — Selmir Suljkanovic

Landing page for the **Sales Mastery Days 2026** event (21.11 & 22.11.2026, Düsseldorf).
A pixel-faithful rebuild of the TyloTech Figma design.

> Das wichtigste Event im Jahr 2026 für Selbstständige und Unternehmer!

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (theme tokens in `src/app/globals.css`)
- **Framer Motion** (scroll reveals, accordion, marquees)
- **lucide-react** (icons)

## Sections

Hero (animated video panel) · Problem · Warum du dieses Event (6 benefits) ·
Erfolgsgeschichten · Pricing · Case Studies · Über Selmir + Stats · Testimonials ·
FAQ · Final CTA · Footer.

## Pricing & checkout

Early-bird prices (valid until **31.07.**), shown with the struck-through regular price:

| Tier | Regular | Early Bird | Stripe Checkout |
|------|---------|-----------|-----------------|
| Basic | 99 € | **69 €** | `buy.stripe.com/…4ko00` |
| Business | 499 € | **379 €** | `buy.stripe.com/…4ko01` |
| First Class | 1.499 € | **1.199 €** | `buy.stripe.com/…4ko02` |

Ticket CTAs link to Stripe Checkout (`src/components/sections/PricingSection.tsx`).

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Notes

- The label/button font is **Archivo** (a stand-in for the commercial *Blauer Nue*);
  swap the real font via the `--font-label` CSS variable to match the design exactly.
- The hero "video" currently uses a still frame (`public/figma/hero/road-frame.png`);
  drop in a real `.mp4` and switch the `<Image>` to a `<video>` in `HeroSection.tsx`.
