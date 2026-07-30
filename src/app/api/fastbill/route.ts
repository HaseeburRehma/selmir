import { NextRequest, NextResponse } from "next/server";
import {
  createAndSendInvoice,
  fastbillConfigured,
  NOTIFY_EMAIL,
  type InvoiceCustomer,
} from "@/lib/fastbill";
import { splitName } from "@/lib/smd2026";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HS = "https://api.hubapi.com";

function hsHeaders() {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/** Fetch a deal + its primary associated contact. */
async function getDealWithContact(dealId: string) {
  const dealRes = await fetch(
    `${HS}/crm/v3/objects/deals/${dealId}?properties=amount,dealname&associations=contacts`,
    { headers: hsHeaders() },
  );
  if (!dealRes.ok) throw new Error(`HubSpot deal ${dealId}: ${await dealRes.text()}`);
  const deal = await dealRes.json();

  const contactId =
    deal.associations?.contacts?.results?.[0]?.id ?? null;
  let contact: Record<string, string> = {};
  if (contactId) {
    const cRes = await fetch(
      `${HS}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,address,zip,city,company,country`,
      { headers: hsHeaders() },
    );
    if (cRes.ok) contact = (await cRes.json()).properties ?? {};
  }
  return {
    amount: Number(deal.properties?.amount ?? 0),
    dealName: (deal.properties?.dealname as string) || "Rechnungsposition",
    contact,
  };
}

/**
 * HubSpot "deal created" → FastBill invoice.
 *
 * Configure a HubSpot webhook (private-app subscription on `deal.creation`,
 * or an Operations-Hub workflow webhook) to POST here at:
 *   https://<domain>/api/fastbill?key=<FASTBILL_WEBHOOK_SECRET>
 *
 * Required env: HUBSPOT_TOKEN, FASTBILL_EMAIL, FASTBILL_API_KEY,
 * FASTBILL_WEBHOOK_SECRET. Optional: FASTBILL_VAT (default 19),
 * FASTBILL_NOTIFY_EMAIL (default info@sh-wachstum.de).
 */
export async function POST(req: NextRequest) {
  // Shared-secret gate — never create invoices from unauthenticated calls.
  const secret = process.env.FASTBILL_WEBHOOK_SECRET;
  if (!secret || req.nextUrl.searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.HUBSPOT_TOKEN || !fastbillConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  let events: Array<{ objectId?: number | string; subscriptionType?: string }>;
  try {
    const body = await req.json();
    events = Array.isArray(body) ? body : [body];
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const results: Array<Record<string, unknown>> = [];
  for (const ev of events) {
    if (ev.subscriptionType && ev.subscriptionType !== "deal.creation") continue;
    const dealId = ev.objectId != null ? String(ev.objectId) : "";
    if (!dealId) continue;

    try {
      const { amount, dealName, contact } = await getDealWithContact(dealId);
      const { firstName, lastName } = splitName(
        [contact.firstname, contact.lastname].filter(Boolean).join(" "),
      );
      const email = contact.email || "";
      if (!email) {
        results.push({ dealId, skipped: "deal has no contact e-mail" });
        continue;
      }

      const customer: InvoiceCustomer = {
        firstName,
        lastName,
        company: contact.company || "",
        email,
        phone: contact.phone || "",
        address: contact.address || "",
        zip: contact.zip || "",
        city: contact.city || "",
        countryCode: (contact.country || "DE").slice(0, 2).toUpperCase(),
      };

      // Mapping to confirm: the deal amount is treated as the NET line total.
      // If HubSpot deals store gross (incl. 19% VAT), divide by 1.19 here.
      const { invoiceId, invoiceNumber } = await createAndSendInvoice(customer, [
        { description: dealName, unitPrice: amount, quantity: 1 },
      ]);
      results.push({ dealId, invoiceNumber, invoiceId, notified: NOTIFY_EMAIL });
    } catch (err) {
      console.error("[fastbill] deal", dealId, (err as Error).message);
      results.push({ dealId, error: (err as Error).message });
    }
  }

  return NextResponse.json({ ok: true, results });
}
