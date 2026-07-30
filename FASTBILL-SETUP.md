# FastBill ↔ HubSpot — direct invoice automation (replaces Make)

When a **HubSpot deal is created**, HubSpot calls our endpoint, which creates a
**FastBill invoice**, sends it to the customer, and **e-mails a copy/notification
to `info@sh-wachstum.de`**. No Make, no credit limit.

```
HubSpot deal created ──▶ POST /api/fastbill?key=… ──▶ FastBill
                                                       ├─ create + complete invoice
                                                       ├─ e-mail invoice → customer
                                                       └─ e-mail copy → info@sh-wachstum.de
```

Code: `src/app/api/fastbill/route.ts`, `src/lib/fastbill.ts`.
**The endpoint is inert (401) until the env vars below are set — safe to deploy.**

## 1. Env vars (Vercel → Settings → Environment Variables)
```
FASTBILL_EMAIL=<FastBill account e-mail>
FASTBILL_API_KEY=<FastBill → Einstellungen → REST-API → API-Key>
FASTBILL_WEBHOOK_SECRET=<any long random string>   # gates the endpoint
FASTBILL_NOTIFY_EMAIL=info@sh-wachstum.de           # optional (this is the default)
FASTBILL_VAT=19                                     # optional (default 19)
# HUBSPOT_TOKEN is already set.
```

## 2. HubSpot trigger (pick one)
- **Private app webhook** (no Operations Hub needed): HubSpot → Settings →
  Integrations → Private Apps → your app → **Webhooks** → Target URL
  `https://<domain>/api/fastbill?key=<FASTBILL_WEBHOOK_SECRET>` → subscribe to
  **`deal.creation`**.
- **or Workflow webhook** (Operations Hub Pro): deal-based workflow, trigger
  "Deal created", action **Send webhook → POST** to the same URL.

## 3. Confirm the invoice mapping
Currently: one line item = **deal name** as description, **deal `amount`** as the
**net** unit price, qty 1, 19 % VAT. If your deals store **gross** amounts, or
you use HubSpot **line items / products**, tell us and we map accordingly (see
the note in `route.ts`).

## Test
After setting the env vars, create a test deal in HubSpot (with an associated
contact that has an e-mail) → a FastBill invoice should appear and both the
customer and `info@sh-wachstum.de` receive it.
