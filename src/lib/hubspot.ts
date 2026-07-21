import type { TicketSale } from "./smd2026";

/**
 * Pushes a ticket sale into HubSpot ("SMD2026"):
 *   1. upsert the contact by email
 *   2. write the SMD2026 ticket properties on that contact
 *   3. add the contact to the SMD2026 static list (if a list id is configured)
 *
 * Requires a HubSpot private-app token (env HUBSPOT_TOKEN) with scopes:
 *   crm.objects.contacts.write, crm.objects.contacts.read, crm.lists.write
 */

const BASE = "https://api.hubapi.com";

function authHeaders() {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) throw new Error("HUBSPOT_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Create-or-update a contact keyed on email; returns the HubSpot contact id. */
async function upsertContact(sale: TicketSale): Promise<string> {
  const properties: Record<string, string> = {
    email: sale.email,
    firstname: sale.firstName,
    lastname: sale.lastName,
    // custom SMD2026 properties (create these once in HubSpot — see SMD2026-SETUP.md)
    smd2026_ticket_tier: sale.tier,
    smd2026_amount: String(sale.amount),
    smd2026_quantity: String(sale.quantity),
    smd2026_purchase_date: sale.purchaseDate.slice(0, 10),
    smd2026_stripe_session: sale.stripeSessionId,
    lifecyclestage: "customer",
  };

  // Try create first
  const createRes = await fetch(`${BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ properties }),
  });

  if (createRes.ok) {
    const data = (await createRes.json()) as { id: string };
    return data.id;
  }

  // 409 = already exists → find id and PATCH
  if (createRes.status === 409) {
    const searchRes = await fetch(
      `${BASE}/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                { propertyName: "email", operator: "EQ", value: sale.email },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }),
      },
    );
    const found = (await searchRes.json()) as { results?: { id: string }[] };
    const id = found.results?.[0]?.id;
    if (!id) throw new Error(`Contact exists but not found: ${sale.email}`);

    const patchRes = await fetch(`${BASE}/crm/v3/objects/contacts/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ properties }),
    });
    if (!patchRes.ok) {
      throw new Error(`HubSpot PATCH failed: ${await patchRes.text()}`);
    }
    return id;
  }

  throw new Error(`HubSpot create failed: ${await createRes.text()}`);
}

/** Add a contact to the SMD2026 static list (ILS list id, numeric). */
async function addToSmd2026List(contactId: string): Promise<void> {
  const listId = process.env.SMD2026_LIST_ID;
  if (!listId) return; // list step optional; properties still tag the contact

  const res = await fetch(
    `${BASE}/crm/v3/lists/${listId}/memberships/add`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify([contactId]),
    },
  );
  if (!res.ok) {
    throw new Error(`HubSpot list add failed: ${await res.text()}`);
  }
}

export async function trackSaleInHubSpot(sale: TicketSale): Promise<string> {
  const contactId = await upsertContact(sale);
  await addToSmd2026List(contactId);
  return contactId;
}
