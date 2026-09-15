import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendNotification, type NotifyRow } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Meta Instant Forms → HubSpot bridge.
 *
 * When a lead submits a Facebook/Instagram Instant Form (Meta Ads Lead
 * objective), Meta posts the change to this webhook. We fetch the full
 * lead data from Meta's Graph API using the page-access token, upsert
 * the contact in HubSpot, add it to the Painpoints segment list, and
 * fire a sales-notification email — same downstream landing as a
 * website submit on `/lp/handwerker-painpoints`, so Meta leads and
 * web leads end up in the same funnel.
 *
 * Two handlers on this route:
 *
 *   GET  → Meta's one-time subscription handshake.
 *          Meta calls it with `hub.mode=subscribe`, `hub.verify_token`,
 *          `hub.challenge`. We echo `hub.challenge` back verbatim when
 *          `hub.verify_token` matches `META_WEBHOOK_VERIFY_TOKEN`.
 *
 *   POST → the actual leadgen event. Meta signs the body with
 *          `X-Hub-Signature-256: sha256=<hmac(body, META_APP_SECRET)>`.
 *          We verify that signature before doing anything else — an
 *          unsigned or wrong-secret request is dropped with 401.
 *
 * Env vars (all required for the POST path, optional for GET-verify):
 *   META_WEBHOOK_VERIFY_TOKEN   Random shared string used only during
 *                               the subscription handshake. Any string
 *                               you paste into the webhook config in
 *                               Meta Business — must match here.
 *   META_APP_SECRET             Your Meta App's client secret. Used to
 *                               verify the HMAC signature on every POST
 *                               so no one can spoof leads into HubSpot.
 *   META_PAGE_TOKEN             Long-lived page access token for
 *                               Selmir's FB Page — required to fetch
 *                               the actual lead field values via Graph.
 *                               Needs `leads_retrieval` +
 *                               `pages_show_list` +
 *                               `pages_read_engagement` scopes.
 *
 *   HUBSPOT_TOKEN                (already set)
 *   HANDWERKER_PAINPOINTS_LIST_ID (already set — the segment leads land in)
 *   RESEND_API_KEY               (already set — sales notification)
 *
 * Meta setup steps (once, in Meta Business Manager):
 *   1. Business Settings → Data sources → Webhooks → add Page webhook
 *      pointing to https://www.selmir-suljkanovic.de/api/meta/lead-webhook
 *      with the same verify token as above.
 *   2. Subscribe to the `leadgen` field on Selmir's Page.
 *   3. In Ads Manager → Instant Forms → each form: no per-form config
 *      needed; every submit fires the Page-level webhook once.
 */

const GRAPH_VERSION = "v20.0";
const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;
const SEGMENT_LIST_ID = process.env.HANDWERKER_PAINPOINTS_LIST_ID;
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET;
const PAGE_TOKEN = process.env.META_PAGE_TOKEN;

const NOTIFY_TO = (process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
void NOTIFY_TO; // read by sendNotification via env

/* ============================================================ */
/* GET — Meta subscription handshake                             */
/* ============================================================ */

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (!VERIFY_TOKEN) {
    console.error("[meta/lead-webhook] META_WEBHOOK_VERIFY_TOKEN not set");
    return new NextResponse("misconfigured", { status: 500 });
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    // Meta expects the challenge echoed back verbatim as plain text.
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn(
    "[meta/lead-webhook] verify handshake rejected:",
    { mode, tokenMatch: token === VERIFY_TOKEN, hasChallenge: !!challenge },
  );
  return new NextResponse("forbidden", { status: 403 });
}

/* ============================================================ */
/* POST — actual leadgen event                                   */
/* ============================================================ */

interface MetaFieldValue {
  name: string;
  values: string[];
}
interface MetaLead {
  id: string;
  created_time?: string;
  form_id?: string;
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  field_data: MetaFieldValue[];
}

/** Verify Meta's HMAC signature on the raw body. Returns true if valid. */
function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!APP_SECRET) {
    // If we can't verify, we must refuse — anyone could POST otherwise.
    return false;
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const provided = signatureHeader.slice("sha256=".length);
  const expected = crypto
    .createHmac("sha256", APP_SECRET)
    .update(rawBody)
    .digest("hex");
  // constant-time compare so timing can't reveal correct signature
  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Fetch a single lead's full field data from Meta Graph. */
async function fetchLead(leadgenId: string): Promise<MetaLead | null> {
  if (!PAGE_TOKEN) {
    console.error("[meta/lead-webhook] META_PAGE_TOKEN not set — cannot fetch lead");
    return null;
  }
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}`);
  url.searchParams.set(
    "fields",
    "id,created_time,form_id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,field_data",
  );
  url.searchParams.set("access_token", PAGE_TOKEN);
  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(
      "[meta/lead-webhook] Graph fetch failed:",
      res.status,
      await res.text(),
    );
    return null;
  }
  return (await res.json()) as MetaLead;
}

/**
 * Meta's Instant Form field names are configurable per-form but the
 * standard "Prefilled" fields keep predictable names. This maps the
 * ones Selmir's forms actually collect onto our HubSpot property model.
 * Anything unmapped lands in the free-text `message` field so the sales
 * team never loses a field even if the form adds a custom question.
 */
function mapFields(fields: MetaFieldValue[]): {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  extras: Record<string, string>;
} {
  const get = (names: string[]): string => {
    for (const n of names) {
      const f = fields.find((x) => x.name?.toLowerCase() === n);
      if (f?.values?.[0]) return f.values[0].trim();
    }
    return "";
  };

  let firstname = get(["first_name", "vorname"]);
  let lastname = get(["last_name", "nachname"]);
  const fullName = get(["full_name", "name"]);
  if (!firstname && !lastname && fullName) {
    const parts = fullName.split(/\s+/);
    firstname = parts.shift() ?? "";
    lastname = parts.join(" ");
  }

  const email = get(["email"]).toLowerCase();
  const phone = get(["phone_number", "phone", "telefon"]);

  // Any remaining fields are dumped verbatim into `extras` so sales sees them.
  const mapped = new Set([
    "first_name", "vorname", "last_name", "nachname",
    "full_name", "name", "email", "phone_number", "phone", "telefon",
  ]);
  const extras: Record<string, string> = {};
  for (const f of fields) {
    const key = (f.name ?? "").toLowerCase();
    if (mapped.has(key)) continue;
    const val = (f.values ?? []).join(", ").trim();
    if (val) extras[f.name] = val;
  }

  return { firstname, lastname, email, phone, extras };
}

/** Upsert to HubSpot with the same tags/segment as website Painpoints leads. */
async function pushHubspot(
  lead: MetaLead,
  mapped: ReturnType<typeof mapFields>,
): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const props: Record<string, string> = {
    email: mapped.email,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Origin tagging — MATCHES the website Painpoints route so the sales
    // team can filter by `lead_magnet` and see both channels together.
    lead_source: "Meta Ads",
    lead_magnet: "Handwerk Erstgespräch – Potenzialanalyse",
    lp_landing_page: "Meta Instant Form",
    lp_submitted_at: lead.created_time || new Date().toISOString(),
    lp_utm_source: "facebook",
    lp_utm_medium: "paid-social",
    // Ad-level attribution straight from the leadgen payload so Sales
    // knows which video / adset drove this lead.
    ...(lead.campaign_id ? { lp_campaign_id: lead.campaign_id } : {}),
    ...(lead.campaign_name ? { lp_utm_campaign: lead.campaign_name } : {}),
    ...(lead.adset_id ? { lp_adset_id: lead.adset_id } : {}),
    ...(lead.ad_id ? { lp_ad_id: lead.ad_id } : {}),
    message: [
      "Meta Instant Form",
      lead.form_id ? `Form: ${lead.form_id}` : "",
      lead.ad_name ? `Ad: ${lead.ad_name}` : "",
      ...Object.entries(mapped.extras).map(([k, v]) => `${k}: ${v}`),
    ]
      .filter(Boolean)
      .join(" · "),
  };
  if (mapped.firstname) props.firstname = mapped.firstname;
  if (mapped.lastname) props.lastname = mapped.lastname;
  if (mapped.phone) props.phone = mapped.phone;

  const attempt = async (
    body: Record<string, string>,
  ): Promise<{ status: number; text: string; contactId?: string }> => {
    const c = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ properties: body }),
    });
    if (c.ok) {
      const j = (await c.json()) as { id: string };
      return { status: c.status, text: "", contactId: j.id };
    }
    if (c.status === 409 && mapped.email) {
      const p = await fetch(
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(mapped.email)}?idProperty=email`,
        { method: "PATCH", headers, body: JSON.stringify({ properties: body }) },
      );
      if (p.ok) {
        const j = (await p.json()) as { id: string };
        return { status: p.status, text: "", contactId: j.id };
      }
      return { status: p.status, text: await p.text() };
    }
    return { status: c.status, text: await c.text() };
  };

  const first = await attempt(props);
  let contactId = first.contactId;
  if (!contactId) {
    // Same guard as the other routes: if the portal doesn't have
    // lead_source / lead_magnet, strip and retry once so the contact
    // still lands.
    if (first.status === 400 && /lead_source|lead_magnet/i.test(first.text)) {
      const { lead_source: _s, lead_magnet: _m, ...rest } = props;
      void _s;
      void _m;
      const retry = await attempt(rest);
      if (!retry.contactId) {
        return { ok: false, reason: `hubspot retry: ${retry.status} ${retry.text}` };
      }
      contactId = retry.contactId;
    } else {
      return { ok: false, reason: `hubspot: ${first.status} ${first.text}` };
    }
  }

  if (contactId && SEGMENT_LIST_ID) {
    const add = await fetch(
      `${HS_BASE}/crm/v3/lists/${SEGMENT_LIST_ID}/memberships/add`,
      { method: "PUT", headers, body: JSON.stringify([contactId]) },
    );
    if (!add.ok) {
      console.warn(
        "[meta/lead-webhook] list add failed:",
        add.status,
        await add.text(),
      );
    }
  }
  return { ok: true, contactId };
}

/** Fire the internal sales notification e-mail. */
async function notifySales(
  lead: MetaLead,
  mapped: ReturnType<typeof mapFields>,
  hubspotContactId: string | null,
): Promise<void> {
  const rows: NotifyRow[] = [];
  if (mapped.firstname) rows.push({ label: "Vorname", value: mapped.firstname });
  if (mapped.lastname) rows.push({ label: "Nachname", value: mapped.lastname });
  if (mapped.phone) rows.push({ label: "Telefonnummer", value: mapped.phone });
  if (mapped.email) rows.push({ label: "E-Mail", value: mapped.email });
  rows.push({ label: "Kanal", value: "Meta Instant Form" });
  if (lead.campaign_name)
    rows.push({ label: "Kampagne", value: lead.campaign_name });
  if (lead.ad_name) rows.push({ label: "Ad", value: lead.ad_name });
  if (lead.form_id) rows.push({ label: "Form ID", value: lead.form_id });
  if (hubspotContactId)
    rows.push({ label: "HubSpot Contact", value: hubspotContactId });
  for (const [k, v] of Object.entries(mapped.extras)) rows.push({ label: k, value: v });

  try {
    await sendNotification({
      subject: `Neuer Meta-Ads-Lead${
        mapped.firstname ? ` von ${mapped.firstname}${mapped.lastname ? " " + mapped.lastname : ""}` : ""
      }`,
      intro: `Über eine Meta Instant Form ist ein neuer Lead eingegangen (${lead.ad_name ?? "Ad unbekannt"}). Die Details stehen unten.`,
      rows,
      replyTo: mapped.email || undefined,
    });
  } catch (err) {
    console.error(
      "[meta/lead-webhook] notify send error:",
      (err as Error).message,
    );
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, sig)) {
    console.warn(
      "[meta/lead-webhook] rejected — bad signature or missing APP_SECRET",
    );
    // Return 200 anyway per Meta's guidance so they don't disable the
    // subscription on repeated 401s from a mis-configured secret window.
    // Signature failure is logged; the payload is dropped.
    return NextResponse.json({ ok: false, reason: "bad-signature" }, { status: 200 });
  }

  let body: {
    object?: string;
    entry?: Array<{
      id?: string;
      time?: number;
      changes?: Array<{
        field?: string;
        value?: {
          leadgen_id?: string;
          form_id?: string;
          page_id?: string;
          adgroup_id?: string;
          ad_id?: string;
          created_time?: number;
        };
      }>;
    }>;
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid-json" }, { status: 200 });
  }

  // Enumerate every leadgen change across every entry.
  const leadgenIds: string[] = [];
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field === "leadgen" && change.value?.leadgen_id) {
        leadgenIds.push(change.value.leadgen_id);
      }
    }
  }

  if (leadgenIds.length === 0) {
    return NextResponse.json({ ok: true, note: "no leadgen changes" });
  }

  // Process each lead. Log per-lead outcomes but always 200 back to Meta —
  // per Meta docs, a 5xx here triggers exponential-backoff retries which
  // can duplicate leads.
  const results: Array<{
    leadgenId: string;
    ok: boolean;
    hubspotContactId?: string | null;
    reason?: string;
  }> = [];

  for (const leadgenId of leadgenIds) {
    try {
      const lead = await fetchLead(leadgenId);
      if (!lead) {
        results.push({ leadgenId, ok: false, reason: "graph-fetch-failed" });
        continue;
      }
      const mapped = mapFields(lead.field_data || []);
      if (!mapped.email && !mapped.phone) {
        // Neither dedup key present — nothing we can do downstream.
        results.push({ leadgenId, ok: false, reason: "no-email-or-phone" });
        continue;
      }
      const hs = await pushHubspot(lead, mapped);
      if (!hs.ok) console.warn("[meta/lead-webhook] hubspot failed:", hs.reason);
      void notifySales(lead, mapped, hs.ok ? hs.contactId ?? null : null);
      results.push({
        leadgenId,
        ok: hs.ok,
        hubspotContactId: hs.ok ? hs.contactId : null,
        reason: hs.ok ? undefined : hs.reason,
      });
    } catch (err) {
      console.error(
        "[meta/lead-webhook] lead processing error:",
        (err as Error).message,
      );
      results.push({ leadgenId, ok: false, reason: (err as Error).message });
    }
  }

  return NextResponse.json({ ok: true, processed: results });
}
