/**
 * SMD2026 — Sales Mastery Days 2026 ticket-sale tracking.
 *
 * Maps a completed Stripe checkout to a ticket tier, and defines the shape of
 * a tracked sale that gets pushed into HubSpot (the "SMD2026" group).
 */

export type TicketTier = "Basic" | "Business" | "First Class" | "Unbekannt";

export interface TicketSale {
  email: string;
  firstName: string;
  lastName: string;
  tier: TicketTier;
  /** amount actually paid, in EUR (e.g. 69, 379, 1199) */
  amount: number;
  currency: string;
  quantity: number;
  purchaseDate: string; // ISO
  stripeSessionId: string;
  stripePaymentLinkId?: string;
}

/**
 * Map a Stripe Payment Link ID → tier.
 * These are the 3 links wired to the ticket buttons on the site. If Stripe
 * regenerates a link, update the ID here (or set the SMD2026_PLINK_* env vars).
 */
const PAYMENT_LINK_TIER: Record<string, TicketTier> = {
  // Basic — buy.stripe.com/6oU3cveBve9u3MvcrK4ko00
  [process.env.SMD2026_PLINK_BASIC ?? "6oU3cveBve9u3MvcrK4ko00"]: "Basic",
  // Business — buy.stripe.com/14AaEXeBvaXi82LdvO4ko01
  [process.env.SMD2026_PLINK_BUSINESS ?? "14AaEXeBvaXi82LdvO4ko01"]: "Business",
  // First Class — buy.stripe.com/fZucN564Z4yU6YHbnG4ko02
  [process.env.SMD2026_PLINK_FIRSTCLASS ?? "fZucN564Z4yU6YHbnG4ko02"]:
    "First Class",
};

/** Fallback: map by the amount paid (early-bird + regular prices). */
function tierFromAmount(eur: number): TicketTier {
  if (eur === 69 || eur === 99) return "Basic";
  if (eur === 379 || eur === 499) return "Business";
  if (eur === 1199 || eur === 1499) return "First Class";
  return "Unbekannt";
}

export function resolveTier(
  paymentLinkId: string | undefined,
  amountEur: number,
): TicketTier {
  if (paymentLinkId && PAYMENT_LINK_TIER[paymentLinkId]) {
    return PAYMENT_LINK_TIER[paymentLinkId];
  }
  return tierFromAmount(amountEur);
}

/** Split a Stripe customer full name into first / last. */
export function splitName(full?: string | null): {
  firstName: string;
  lastName: string;
} {
  const name = (full ?? "").trim();
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
