# SMD2026 — Ticket-sale tracking (Stripe → HubSpot)

Every completed Stripe ticket purchase is sent to HubSpot as a contact tagged
with its **tier + amount + buyer** and (optionally) added to the **SMD2026**
list. This runs as a webhook at:

```
POST  https://<your-domain>/api/stripe/webhook
```

Code: `src/app/api/stripe/webhook/route.ts`, `src/lib/hubspot.ts`,
`src/lib/smd2026.ts`.

Why this instead of a HubSpot Workflow: the `dev@tylotech.de` HubSpot user has
**no access to Lists or Workflows**, and Stripe Payment Links can't reach HubSpot
on their own. This webhook + the HubSpot API does the same job and only needs a
one-time token.

---

## ✅ Already done (built live in HubSpot)

The HubSpot side is fully set up and tested:

- **Service key** `SMD2026 Tracking` created with scopes
  `crm.objects.contacts.read/write`, `crm.lists.read/write`,
  `crm.schemas.contacts.read/write`. Token is stored locally in `.env.local`
  (view it any time: HubSpot → Development → Keys → Service-Schlüssel).
- **5 contact properties** created: `smd2026_ticket_tier`, `smd2026_amount`,
  `smd2026_quantity`, `smd2026_purchase_date`, `smd2026_stripe_session`.
- **Static list "SMD2026"** created → **`SMD2026_LIST_ID = 761`** (master list,
  every buyer).
- **Per-tier routing**: on top of the master list, each buyer is added to the
  segment matching the ticket they bought:
  | Tier | Segment | List ID | env override |
  |---|---|---|---|
  | Basic | SMD26 November Teilnehmer Basic | `757` | `SMD2026_LIST_BASIC` |
  | Business | SMD26 November Teilnehmer Business | `758` | `SMD2026_LIST_BUSINESS` |
  | First Class | SMD26 November Teilnehmer First | `760` | `SMD2026_LIST_FIRST` |

  IDs are hardcoded fallbacks in `src/lib/hubspot.ts`; set the env vars only if
  the segments are ever recreated with new IDs.
- Verified end-to-end: a test buyer was written with tier + amount + date,
  added to the SMD2026 list, then removed.

**Remaining to go live = only the Stripe side + deploy env (steps 4 & 5 below).**

---

## What YOU (a HubSpot Super-Admin) do once — ~10 min

### 1. Create a HubSpot private app → get a token
HubSpot ⚙️ **Settings → Integrations → Private Apps → Create a private app**
- Name: `SMD2026 Tracking`
- Scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`,
  `crm.lists.read`, `crm.lists.write`
- Create → copy the **Access token** → this is `HUBSPOT_TOKEN`.

### 2. Create the SMD2026 contact properties
HubSpot **Settings → Properties → Contact properties → Create property** (group
"Contact information"). Create these (type shown):
| Internal name | Label | Type |
|---|---|---|
| `smd2026_ticket_tier` | SMD2026 Ticket-Tier | Single-line text (or dropdown Basic/Business/First Class) |
| `smd2026_amount` | SMD2026 Betrag (EUR) | Number |
| `smd2026_quantity` | SMD2026 Anzahl | Number |
| `smd2026_purchase_date` | SMD2026 Kaufdatum | Date picker |
| `smd2026_stripe_session` | SMD2026 Stripe-Session | Single-line text |

### 3. (Optional) SMD2026 list
Create a **static list** named `SMD2026` (Contacts → Lists → Create static list).
Open it and copy the numeric **list ID** from the URL → `SMD2026_LIST_ID`.
(If you skip this, buyers are still fully tagged with the properties above and
findable via a filter on `smd2026_ticket_tier`.)

### 4. Create the Stripe webhook
Stripe Dashboard → **Developers → Webhooks → Add endpoint**
- URL: `https://<your-domain>/api/stripe/webhook`
- Event: **`checkout.session.completed`**
- Create → copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.
- Also grab your **Secret key** (`sk_live_…`) from Developers → API keys →
  `STRIPE_SECRET_KEY`.

### 5. Add the env vars to the deployment (Vercel → Settings → Environment Variables)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
HUBSPOT_TOKEN=pat-eu1-...
SMD2026_LIST_ID=123          # optional
```
Redeploy.

---

## Test it
Stripe Dashboard → your webhook → **Send test event** → `checkout.session.completed`,
or make a €0 test purchase. A new contact appears in HubSpot with the SMD2026
tier/amount/date filled in (and in the SMD2026 list if configured).

## Notes
- If HubSpot properties don't exist yet, the API returns an error naming the
  missing property — create it (step 2) and Stripe will auto-retry.
- Tier is resolved by Stripe Payment Link ID (see `src/lib/smd2026.ts`), with a
  price-amount fallback (69/99 → Basic, 379/499 → Business, 1199/1499 → First
  Class). If the links change, update `SMD2026_PLINK_*` env or the map.
