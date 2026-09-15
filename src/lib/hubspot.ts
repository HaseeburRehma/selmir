import { splitName, type TicketSale } from "./smd2026";
import type { LeadAttribution } from "./attribution";

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
    // Two-level origin tagging — ticket buyers are the ONE audience
    // that legitimately carries the SMD2026 label. `lead_magnet` stays
    // empty for buyers (they didn't download something, they bought).
    lead_source: "SMD2026 Ticket",
    lead_magnet: "",
  };

  // Only set these when Stripe actually collected them (don't overwrite an
  // existing HubSpot value with a blank).
  if (sale.phone) properties.phone = sale.phone;
  if (sale.address) properties.address = sale.address; // Adresszeile
  if (sale.city) properties.city = sale.city; // Stadt
  if (sale.zip) properties.zip = sale.zip; // Postleitzahl
  // Billing email — the same address, copied into the custom billing field.
  if (sale.email) properties.rechnungs_emailadresse = sale.email;

  return await createOrUpdateWithFallback(properties, sale.email);
}

/**
 * Core create-or-patch loop with a one-shot fallback for the new
 * `lead_source` / `lead_magnet` custom properties.
 *
 * If HubSpot 400s specifically because those two properties don't exist
 * yet in the portal, the tags are stripped and the write is retried
 * once — so ticket sales and LP leads keep landing while the properties
 * are being created in Settings → Properties. Any other 400 (a real
 * validation error) is surfaced verbatim.
 *
 * Dedup key is `email` when supplied, else the caller relies on the
 * default upsert behavior of the object.
 */
async function createOrUpdateWithFallback(
  properties: Record<string, string>,
  emailForDedup?: string,
): Promise<string> {
  const attempt = async (
    props: Record<string, string>,
  ): Promise<
    | { id: string }
    | { failedStatus: number; failedText: string }
  > => {
    const createRes = await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ properties: props }),
    });
    if (createRes.ok) {
      const data = (await createRes.json()) as { id: string };
      return { id: data.id };
    }
    if (createRes.status === 409 && emailForDedup) {
      const searchRes = await fetch(`${BASE}/crm/v3/objects/contacts/search`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                { propertyName: "email", operator: "EQ", value: emailForDedup },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }),
      });
      const found = (await searchRes.json()) as { results?: { id: string }[] };
      const id = found.results?.[0]?.id;
      if (!id) throw new Error(`Contact exists but not found: ${emailForDedup}`);
      const patchRes = await fetch(`${BASE}/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ properties: props }),
      });
      if (patchRes.ok) return { id };
      return { failedStatus: patchRes.status, failedText: await patchRes.text() };
    }
    return { failedStatus: createRes.status, failedText: await createRes.text() };
  };

  const first = await attempt(properties);
  if ("id" in first) return first.id;

  if (first.failedStatus === 400 && /lead_source|lead_magnet/i.test(first.failedText)) {
    console.warn(
      "[hubspot] portal missing lead_source/lead_magnet — retrying without them; create these two custom contact properties in HubSpot Settings → Properties to enable two-level tagging.",
    );
    const { lead_source: _s, lead_magnet: _m, ...rest } = properties;
    void _s;
    void _m;
    const retry = await attempt(rest);
    if ("id" in retry) return retry.id;
    throw new Error(`HubSpot retry failed: ${retry.failedStatus} ${retry.failedText}`);
  }

  throw new Error(`HubSpot failed: ${first.failedStatus} ${first.failedText}`);
}

/**
 * Tier → HubSpot list id. Every buyer is routed into the segment matching the
 * ticket they bought, so Basic/Business/First Class stay cleanly separated.
 * IDs are the "SMD26 November Teilnehmer …" segments (override via env if the
 * lists ever change).
 */
const TIER_LIST_ID: Record<TicketSale["tier"], string | undefined> = {
  Basic: process.env.SMD2026_LIST_BASIC ?? "757",
  Business: process.env.SMD2026_LIST_BUSINESS ?? "758",
  "First Class": process.env.SMD2026_LIST_FIRST ?? "760",
  Unbekannt: undefined, // unknown tier → master list only, no tier segment
};

/** Add a contact to a HubSpot list (works for MANUAL + SNAPSHOT lists). */
async function addToList(listId: string, contactId: string): Promise<void> {
  const res = await fetch(`${BASE}/crm/v3/lists/${listId}/memberships/add`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify([contactId]),
  });
  if (!res.ok) {
    throw new Error(`HubSpot list ${listId} add failed: ${await res.text()}`);
  }
}

/* ------------------------------------------------------------------ */
/* Landing-page leads ("Kostenlose Potenzialanalyse")                   */
/* ------------------------------------------------------------------ */

export interface PotenzialanalyseLead {
  name: string;
  phone: string;
  company: string;
  /** Answer to "Bist du Inhaber / Entscheider?" */
  decisionMaker: "Ja" | "Nein";
  /** Which of the eight landing pages the form was submitted from. */
  landingPage: string;
  /** Ad attribution captured on the landing page, when the click carried any. */
  attribution?: LeadAttribution;
}

/**
 * Upserts a landing-page lead as a HubSpot contact.
 *
 * The form deliberately collects no email address (the Figma design ships
 * name / phone / company only), so the usual email dedup key isn't available —
 * we match on `phone` instead. Two submissions from the same number update one
 * contact; a changed number creates a second one.
 *
 * Everything written here is a property that already exists in the portal.
 * The extra answers go into the standard `message` field because there is no
 * dedicated property for them yet — see the note in the route handler.
 */
export async function submitLeadToHubSpot(
  lead: PotenzialanalyseLead,
): Promise<string> {
  const { firstName, lastName } = splitName(lead.name);

  const properties: Record<string, string> = {
    firstname: firstName,
    lastname: lastName,
    phone: lead.phone,
    company: lead.company,
    lifecyclestage: "lead",
    // "Noch nicht erreicht" — the lead is waiting for the callback.
    hs_lead_status: "NEW",
    message: [
      "Kostenlose Potenzialanalyse angefragt",
      `Landingpage: ${lead.landingPage}`,
      `Inhaber / Entscheider: ${lead.decisionMaker}`,
    ].join(" · "),
    // "Landingpage & Ads" property group — the filterable half.
    lp_landing_page: lead.landingPage,
    lp_submitted_at: new Date().toISOString(),
    // Two-level origin tagging (custom contact properties). LP is a
    // Website form → no lead magnet; the landing page copy already
    // lives in `lp_landing_page`, so `lead_magnet` stays empty here.
    lead_source: "Website",
    lead_magnet: "",
  };

  // Ad attribution, when the click carried any. Only non-empty values are sent
  // so a later direct visit can't blank out the original campaign.
  const a = lead.attribution ?? {};
  const attributionProps: Record<string, string | undefined> = {
    lp_utm_source: a.utmSource,
    lp_utm_medium: a.utmMedium,
    lp_utm_campaign: a.utmCampaign,
    lp_utm_content: a.utmContent,
    lp_utm_term: a.utmTerm,
    lp_campaign_id: a.campaignId,
    lp_adset_id: a.adsetId,
    lp_ad_id: a.adId,
    lp_fbclid: a.fbclid,
    lp_landing_page_url: a.landingPageUrl,
    lp_referrer: a.referrer,
  };
  for (const [key, value] of Object.entries(attributionProps)) {
    if (value) properties[key] = value;
  }

  const existingId = await findContactIdByPhone(lead.phone);

  // Same retry-on-missing-property guard as ticket sales: if the portal
  // hasn't got lead_source / lead_magnet yet, we strip them and try again
  // so a phone dedup-match still lands cleanly.
  const patchOrCreate = async (
    id: string | null,
    props: Record<string, string>,
  ): Promise<{ id: string } | { failedStatus: number; failedText: string }> => {
    if (id) {
      const patchRes = await fetch(`${BASE}/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ properties: props }),
      });
      if (patchRes.ok) return { id };
      return { failedStatus: patchRes.status, failedText: await patchRes.text() };
    }
    const createRes = await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ properties: props }),
    });
    if (createRes.ok) {
      const created = (await createRes.json()) as { id: string };
      return { id: created.id };
    }
    return { failedStatus: createRes.status, failedText: await createRes.text() };
  };

  const first = await patchOrCreate(existingId, properties);
  if ("id" in first) return first.id;

  if (first.failedStatus === 400 && /lead_source|lead_magnet/i.test(first.failedText)) {
    console.warn(
      "[hubspot] portal missing lead_source/lead_magnet — retrying LP lead without them.",
    );
    const { lead_source: _s, lead_magnet: _m, ...rest } = properties;
    void _s;
    void _m;
    const retry = await patchOrCreate(existingId, rest);
    if ("id" in retry) return retry.id;
    throw new Error(
      `HubSpot lead retry failed: ${retry.failedStatus} ${retry.failedText}`,
    );
  }

  throw new Error(`HubSpot lead failed: ${first.failedStatus} ${first.failedText}`);
}

/** Finds a contact by phone number, or null. Used instead of email dedup. */
async function findContactIdByPhone(phone: string): Promise<string | null> {
  const res = await fetch(`${BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "phone", operator: "EQ", value: phone }] },
      ],
      properties: ["phone"],
      limit: 1,
    }),
  });
  if (!res.ok) return null; // search failing shouldn't block the lead
  const found = (await res.json()) as { results?: { id: string }[] };
  return found.results?.[0]?.id ?? null;
}

/* ------------------------------------------------------------------ */
/* "SMS verified, form not submitted" — abandonment capture             */
/* ------------------------------------------------------------------ */

export interface SmsVerifiedContact {
  /** Verified E.164 phone. Dedup key for the contact. */
  phone: string;
  /** Which source form / page (e.g. "leitfaden", "betriebs-roentgen"). */
  source: string;
  /** Optional identifier bits the user may already have typed. */
  firstName?: string;
  lastName?: string;
  email?: string;
  /** Full URL of the page the user was on. */
  pageUrl?: string;
}

/**
 * Upsert a contact when the phone was verified via Twilio SMS but the
 * user hasn't submitted the actual lead form yet. Keyed on phone (matches
 * findContactIdByPhone) so a later successful submit updates the SAME
 * contact instead of duplicating.
 *
 * The status property `hs_lead_status="OPEN"` and a marker note in
 * `message` make abandoners identifiable in HubSpot without needing a
 * new custom property. If SMS_VERIFIED_HUBSPOT_LIST_ID is configured,
 * the contact is also added to that list for easy retargeting.
 */
export async function submitSmsVerifiedToHubSpot(
  contact: SmsVerifiedContact,
): Promise<string> {
  const properties: Record<string, string> = {
    phone: contact.phone,
    lifecyclestage: "lead",
    // "Neu" — this is a brand-new lead that hasn't finished the form.
    hs_lead_status: "NEW",
    message: [
      "SMS verifiziert – Formular nicht abgeschickt",
      `Quelle: ${contact.source}`,
    ].join(" · "),
    lead_source: "SMS-Verifizierung (Abbruch)",
    lead_magnet: contact.source,
    lp_landing_page: contact.source,
    lp_submitted_at: new Date().toISOString(),
  };
  if (contact.firstName) properties.firstname = contact.firstName;
  if (contact.lastName) properties.lastname = contact.lastName;
  if (contact.email) properties.email = contact.email;

  const existingId = await findContactIdByPhone(contact.phone);

  const patchOrCreate = async (
    id: string | null,
    props: Record<string, string>,
  ): Promise<{ id: string } | { failedStatus: number; failedText: string }> => {
    if (id) {
      // PATCH: only overwrite the abandonment flags. Never overwrite an
      // already-set firstname / lastname / email with blanks — the user
      // may have completed the form on an earlier visit.
      const patchProps = { ...props };
      if (!contact.firstName) delete patchProps.firstname;
      if (!contact.lastName) delete patchProps.lastname;
      if (!contact.email) delete patchProps.email;
      const patchRes = await fetch(`${BASE}/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ properties: patchProps }),
      });
      if (patchRes.ok) return { id };
      return { failedStatus: patchRes.status, failedText: await patchRes.text() };
    }
    const createRes = await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ properties: props }),
    });
    if (createRes.ok) {
      const created = (await createRes.json()) as { id: string };
      return { id: created.id };
    }
    return { failedStatus: createRes.status, failedText: await createRes.text() };
  };

  const first = await patchOrCreate(existingId, properties);
  if ("id" in first) {
    // Optional: add to a segment list so the sales team can see abandoners
    // separately from other lead sources.
    const listId = process.env.SMS_VERIFIED_HUBSPOT_LIST_ID;
    if (listId) {
      await addToList(listId, first.id).catch((err) => {
        console.warn(
          "[hubspot] sms-verified list add failed:",
          (err as Error).message,
        );
      });
    }
    return first.id;
  }

  // Same tolerance for portals missing the two-level tagging properties.
  if (
    first.failedStatus === 400 &&
    /lead_source|lead_magnet/i.test(first.failedText)
  ) {
    const { lead_source: _s, lead_magnet: _m, ...rest } = properties;
    void _s;
    void _m;
    const retry = await patchOrCreate(existingId, rest);
    if ("id" in retry) return retry.id;
    throw new Error(
      `HubSpot sms-verified retry failed: ${retry.failedStatus} ${retry.failedText}`,
    );
  }

  throw new Error(
    `HubSpot sms-verified failed: ${first.failedStatus} ${first.failedText}`,
  );
}

export async function trackSaleInHubSpot(sale: TicketSale): Promise<string> {
  const contactId = await upsertContact(sale);

  // 1) master list (all buyers), if configured
  const masterList = process.env.SMD2026_LIST_ID;
  if (masterList) await addToList(masterList, contactId);

  // 2) tier segment — Basic / Business / First Class
  const tierList = TIER_LIST_ID[sale.tier];
  if (tierList) await addToList(tierList, contactId);

  return contactId;
}
