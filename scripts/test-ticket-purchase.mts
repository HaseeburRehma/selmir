import { readFileSync } from "node:fs";
import { createHmac } from "node:crypto";

// load .env.local
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}

const WEBHOOK =
  process.env.WEBHOOK_URL ?? "http://localhost:3000/api/stripe/webhook";
const BASE = "https://api.hubapi.com";
const secret = process.env.STRIPE_WEBHOOK_SECRET!;
const H = {
  Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
  "Content-Type": "application/json",
};
const MASTER = process.env.SMD2026_LIST_ID ?? "761";

// --- build a realistic checkout.session.completed event (First Class + phone)
const ts = Math.floor(Date.now() / 1000);
const email = `stripe-webhook-test-${Date.now()}@example.com`;
const phone = "+49 170 1234567";
const event = {
  id: `evt_test_${Date.now()}`,
  object: "event",
  type: "checkout.session.completed",
  created: ts,
  data: {
    object: {
      id: `cs_test_${Date.now()}`,
      object: "checkout.session",
      payment_status: "paid",
      amount_total: 119900, // 1199 € → First Class
      currency: "eur",
      created: ts,
      customer_details: {
        name: "Muhammed Mehmet Sahin",
        email,
        phone,
        address: {
          line1: "Zweigertstraße 50",
          line2: "",
          city: "Essen",
          postal_code: "45130",
          state: "",
          country: "DE",
        },
      },
      payment_link: "fZucN564Z4yU6YHbnG4ko02", // First Class payment link
    },
  },
};

const body = JSON.stringify(event);
const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");

console.log("→ POSTing signed checkout.session.completed to the webhook…");
const res = await fetch(WEBHOOK, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Stripe-Signature": `t=${ts},v1=${sig}` },
  body,
});
console.log(`   webhook responded ${res.status}:`, await res.text());

if (res.status !== 200) {
  console.log("❌ Webhook did not accept the event — stopping.");
  process.exit(1);
}

// --- give HubSpot a moment, then verify the contact
await new Promise((r) => setTimeout(r, 1500));

const search = await fetch(`${BASE}/crm/v3/objects/contacts/search`, {
  method: "POST",
  headers: H,
  body: JSON.stringify({
    filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
    properties: [
      "email", "firstname", "lastname", "phone",
      "address", "city", "zip", "rechnungs_emailadresse",
      "smd2026_ticket_tier", "smd2026_amount", "smd2026_quantity",
      "smd2026_purchase_date", "smd2026_stripe_session", "lifecyclestage",
    ],
    limit: 1,
  }),
});
const found: any = await search.json();
const contact = found.results?.[0];
if (!contact) {
  console.log("❌ Contact NOT found in HubSpot for", email);
  process.exit(1);
}
const p = contact.properties;
const id = contact.id;

// --- which lists is it in?
const memb = await fetch(`${BASE}/crm/v3/lists/records/0-1/${id}/memberships`, { headers: H });
const membJson: any = await memb.json();
const listIds = new Set((membJson.results ?? []).map((x: any) => String(x.listId)));

console.log("\n=== HubSpot contact created ===");
const rows: [string, string, boolean][] = [
  ["Vorname (firstname)", p.firstname, p.firstname === "Muhammed"],
  ["Nachname (lastname)", p.lastname, p.lastname === "Mehmet Sahin"],
  ["E-Mail", p.email, p.email === email],
  ["Telefon (phone)", p.phone, !!p.phone && p.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")],
  ["Adresszeile (address)", p.address, p.address === "Zweigertstraße 50"],
  ["Stadt (city)", p.city, p.city === "Essen"],
  ["Postleitzahl (zip)", p.zip, p.zip === "45130"],
  ["Rechnungs-E-Mail", p.rechnungs_emailadresse, p.rechnungs_emailadresse === email],
  ["Ticket-Tier", p.smd2026_ticket_tier, p.smd2026_ticket_tier === "First Class"],
  ["Betrag (amount)", p.smd2026_amount, String(p.smd2026_amount) === "1199"],
  ["Kaufdatum", p.smd2026_purchase_date, !!p.smd2026_purchase_date],
  ["Stripe-Session", p.smd2026_stripe_session, !!p.smd2026_stripe_session],
  ["Lifecycle", p.lifecyclestage, p.lifecyclestage === "customer"],
  ["In First-Class-Liste (760)", [...listIds].join(",") || "—", listIds.has("760")],
  ["In Master-Liste (" + MASTER + ")", [...listIds].join(","), listIds.has(MASTER)],
];
let allOk = true;
for (const [label, value, ok] of rows) {
  if (!ok) allOk = false;
  console.log(`  ${ok ? "✅" : "❌"}  ${label.padEnd(30)} = ${value ?? "(leer)"}`);
}

// --- cleanup
console.log("\n— Testkontakt wird entfernt —");
for (const l of ["757", "758", "760", MASTER]) {
  await fetch(`${BASE}/crm/v3/lists/${l}/memberships/remove`, {
    method: "PUT", headers: H, body: JSON.stringify([id]),
  });
}
await fetch(`${BASE}/crm/v3/objects/contacts/${id}`, { method: "DELETE", headers: H });
console.log("  Testkontakt aus Listen entfernt + archiviert (id " + id + ")");

console.log(allOk ? "\nRESULT: ✅ ALLE DATEN LANDEN KORREKT IN HUBSPOT" : "\nRESULT: ❌ EINIGE FELDER FEHLEN");
process.exit(allOk ? 0 : 1);
