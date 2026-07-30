/**
 * FastBill API 1.0 client — enough to turn a HubSpot deal into a sent invoice
 * without Make in the middle.
 *
 * Flow: get-or-create customer → create invoice → complete (assigns a number)
 * → email the invoice to the customer → email a copy to the notify address
 * (info@sh-wachstum.de) so sales is informed of every invoice.
 *
 * Auth is HTTP Basic with the account e-mail + API key (FastBill → Settings →
 * REST-API). All of this is inert until FASTBILL_EMAIL + FASTBILL_API_KEY are
 * set, so the route is safe to ship before it is configured.
 */

const API_URL = "https://my.fastbill.com/api/1.0/api.php";
const VAT_PERCENT = Number(process.env.FASTBILL_VAT ?? "19");

export const NOTIFY_EMAIL =
  process.env.FASTBILL_NOTIFY_EMAIL ?? "info@sh-wachstum.de";

export function fastbillConfigured(): boolean {
  return Boolean(process.env.FASTBILL_EMAIL && process.env.FASTBILL_API_KEY);
}

function authHeader(): string {
  const token = Buffer.from(
    `${process.env.FASTBILL_EMAIL}:${process.env.FASTBILL_API_KEY}`,
  ).toString("base64");
  return `Basic ${token}`;
}

interface FbResponse {
  RESPONSE?: Record<string, unknown>;
  ERRORS?: string[];
}

async function fbCall(
  service: string,
  payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ SERVICE: service, ...payload }),
  });
  const json = (await res.json()) as FbResponse;
  if (json.ERRORS?.length) {
    throw new Error(`FastBill ${service}: ${json.ERRORS.join("; ")}`);
  }
  return json.RESPONSE ?? {};
}

export interface InvoiceCustomer {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string; // street + number
  zip: string;
  city: string;
  countryCode: string; // ISO-2, e.g. "DE"
}

export interface InvoiceLine {
  description: string;
  /** net unit price in EUR */
  unitPrice: number;
  quantity: number;
  vatPercent?: number;
}

/** Find an existing FastBill customer by e-mail, or create one. */
async function getOrCreateCustomer(c: InvoiceCustomer): Promise<string> {
  const found = await fbCall("customer.get", { FILTER: { TERM: c.email } });
  const existing = (found.CUSTOMERS as { CUSTOMER_ID: string }[] | undefined)?.[0];
  if (existing?.CUSTOMER_ID) return String(existing.CUSTOMER_ID);

  const created = await fbCall("customer.create", {
    DATA: {
      CUSTOMER_TYPE: c.company ? "business" : "consumer",
      ORGANIZATION: c.company || `${c.firstName} ${c.lastName}`.trim(),
      FIRST_NAME: c.firstName,
      LAST_NAME: c.lastName,
      ADDRESS: c.address,
      ZIPCODE: c.zip,
      CITY: c.city,
      COUNTRY_CODE: c.countryCode || "DE",
      EMAIL: c.email,
      PHONE: c.phone,
    },
  });
  const id = created.CUSTOMER_ID;
  if (!id) throw new Error("FastBill customer.create returned no CUSTOMER_ID");
  return String(id);
}

/** Create → complete → email invoice; then email a copy to the notify address. */
export async function createAndSendInvoice(
  customer: InvoiceCustomer,
  lines: InvoiceLine[],
): Promise<{ invoiceId: string; invoiceNumber: string }> {
  const customerId = await getOrCreateCustomer(customer);

  const created = await fbCall("invoice.create", {
    DATA: {
      CUSTOMER_ID: customerId,
      ITEMS: lines.map((l) => ({
        DESCRIPTION: l.description,
        UNIT_PRICE: l.unitPrice,
        VAT_PERCENT: l.vatPercent ?? VAT_PERCENT,
        QUANTITY: l.quantity,
      })),
    },
  });
  const invoiceId = String(created.INVOICE_ID ?? "");
  if (!invoiceId) throw new Error("FastBill invoice.create returned no INVOICE_ID");

  const completed = await fbCall("invoice.complete", {
    DATA: { INVOICE_ID: invoiceId },
  });
  const invoiceNumber = String(completed.INVOICE_NUMBER ?? invoiceId);

  // 1) the real invoice to the customer
  if (customer.email) {
    await fbCall("invoice.sendbyemail", {
      DATA: {
        INVOICE_ID: invoiceId,
        RECIPIENT: { TO: customer.email },
        SUBJECT: `Ihre Rechnung ${invoiceNumber}`,
        MESSAGE:
          "Guten Tag,\n\nanbei erhalten Sie Ihre Rechnung. Vielen Dank für Ihren Kauf.\n\nMit freundlichen Grüßen",
      },
    });
  }

  // 2) notification copy to sales (info@sh-wachstum.de)
  await fbCall("invoice.sendbyemail", {
    DATA: {
      INVOICE_ID: invoiceId,
      RECIPIENT: { TO: NOTIFY_EMAIL },
      SUBJECT: `Neue Rechnung ${invoiceNumber} erstellt (${customer.company || customer.lastName})`,
      MESSAGE: `Automatisch erstellte Rechnung ${invoiceNumber} für ${customer.firstName} ${customer.lastName}${
        customer.company ? ` (${customer.company})` : ""
      }.\nKunde: ${customer.email}`,
    },
  });

  return { invoiceId, invoiceNumber };
}
