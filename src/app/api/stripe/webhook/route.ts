import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveTier, splitName, type TicketSale } from "@/lib/smd2026";
import { trackSaleInHubSpot } from "@/lib/hubspot";

// Stripe needs the raw body → force the Node runtime and disable caching.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = secretKey ? new Stripe(secretKey) : null;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe env not configured" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signature verification failed: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    // Ignore everything except completed ticket purchases.
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: "not paid" });
  }

  try {
    // Line item → quantity (payment links usually have one line).
    let quantity = 1;
    try {
      const items = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1,
      });
      quantity = items.data[0]?.quantity ?? 1;
    } catch {
      /* line items optional */
    }

    const amountEur = (session.amount_total ?? 0) / 100;
    const paymentLinkId =
      typeof session.payment_link === "string"
        ? session.payment_link
        : session.payment_link?.id;

    const email =
      session.customer_details?.email || session.customer_email || "";
    const { firstName, lastName } = splitName(session.customer_details?.name);

    const sale: TicketSale = {
      email,
      firstName,
      lastName,
      tier: resolveTier(paymentLinkId, amountEur),
      amount: amountEur,
      currency: (session.currency ?? "eur").toUpperCase(),
      quantity,
      purchaseDate: new Date(
        (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
      ).toISOString(),
      stripeSessionId: session.id,
      stripePaymentLinkId: paymentLinkId,
    };

    if (!sale.email) {
      console.error("[SMD2026] sale without email", session.id);
      return NextResponse.json({ received: true, skipped: "no email" });
    }

    if (process.env.HUBSPOT_TOKEN) {
      const contactId = await trackSaleInHubSpot(sale);
      console.log(`[SMD2026] tracked ${sale.tier} · ${sale.email} → ${contactId}`);
    } else {
      // No HubSpot token yet → still log the structured sale so nothing is lost.
      console.log("[SMD2026] SALE", JSON.stringify(sale));
    }

    return NextResponse.json({ received: true, tier: sale.tier });
  } catch (err) {
    console.error("[SMD2026] processing error", err);
    // 500 → Stripe retries the webhook automatically.
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
