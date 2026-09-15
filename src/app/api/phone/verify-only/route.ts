import { NextRequest, NextResponse } from "next/server";
import { checkVerificationCode } from "@/lib/twilio";
import { buildVerifiedCookie } from "@/lib/phoneVerify";
import { submitSmsVerifiedToHubSpot } from "@/lib/hubspot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/phone/verify-only
 *
 * Fired by the client as soon as the visitor types the correct 6-digit
 * SMS code — BEFORE they've submitted the actual lead form. Captures the
 * verified phone number (with whatever fields they've already filled in)
 * so an abandoned form still leaves us a warm, dial-able lead:
 *
 *   1. Twilio VerificationCheck confirms the code. This CONSUMES the
 *      code — the follow-up submit uses the `sh_pv` cookie path instead
 *      of re-checking with Twilio (see /api/<form>/subscribe routes).
 *   2. Sets the `sh_pv` cookie so the eventual form submit skips Twilio.
 *   3. Upserts the contact in HubSpot (phone-keyed) with
 *      lead_source="SMS-Verifizierung (Abbruch)" and marker text in
 *      `message`. Optionally adds them to SMS_VERIFIED_HUBSPOT_LIST_ID.
 *   4. Appends a row to the Google Sheet's "Verifiziert – nicht
 *      abgeschickt" tab via the shared Apps Script webhook
 *      (formType: "sms-verified").
 *
 * All 4 SMS-gated forms (leitfaden, betriebs-roentgen, ebook, whitepaper)
 * call this one endpoint — the `source` field carries which page.
 */

const SHEET_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  process.env.LEITFADEN_SHEET_WEBHOOK_URL ??
  "";

async function appendToSheet(row: {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  source: string;
  pageUrl?: string;
}): Promise<void> {
  if (!SHEET_URL) {
    console.warn(
      "[verify-only] no sheet webhook configured — set GOOGLE_SHEET_WEBHOOK_URL",
    );
    return;
  }
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "sms-verified",
        phone: row.phone ? `'${row.phone}` : "",
        firstName: row.firstName ?? "",
        lastName: row.lastName ?? "",
        email: row.email ?? "",
        source: row.source,
        pageUrl: row.pageUrl ?? "",
      }),
    });
  } catch (err) {
    console.error(
      "[verify-only] sheet append failed:",
      (err as Error).message,
    );
  }
}

export async function POST(req: NextRequest) {
  let body: {
    phone?: string;
    code?: string;
    source?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    pageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }

  const rawPhone = (body.phone ?? "").trim();
  const code = (body.code ?? "").trim();
  const source = (body.source ?? "").trim() || "unbekannt";
  const email = (body.email ?? "").trim().toLowerCase();
  const pageUrl = (body.pageUrl ?? "").trim();

  // Accept either firstName/lastName pair OR a single `name` we'll split.
  let firstName = (body.firstName ?? "").trim();
  let lastName = (body.lastName ?? "").trim();
  if (!firstName && !lastName && body.name) {
    const parts = body.name.trim().split(/\s+/);
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ");
  }

  if (!rawPhone) {
    return NextResponse.json(
      { ok: false, reason: "phone is required" },
      { status: 400 },
    );
  }
  if (!/^\d{4,10}$/.test(code)) {
    return NextResponse.json(
      { ok: false, reason: "Bitte gib den 6-stelligen SMS-Code ein." },
      { status: 400 },
    );
  }

  // 1. Verify the code with Twilio. Consumes the verification.
  const twilio = await checkVerificationCode(rawPhone, code);
  if (!twilio.ok) {
    return NextResponse.json(
      { ok: false, reason: twilio.reason },
      { status: 400 },
    );
  }
  const phone = twilio.phone;

  // 2 + 3. HubSpot upsert + sheet append. AWAITED — a plain fire-and-
  // forget promise (`void ...`) can get cut short on Vercel serverless
  // when the function shuts down after the response returns, and the
  // multi-step HubSpot upsert (search → create → optional list add)
  // then never finishes. Both must finish before we return.
  //
  // Each call catches its own errors so one failure never blocks the
  // other, and the endpoint always returns 200 to the client (the code
  // is already consumed by Twilio at this point — a client-visible
  // error would be misleading).
  await Promise.all([
    submitSmsVerifiedToHubSpot({
      phone,
      source,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      pageUrl,
    }).catch((err) => {
      console.warn(
        "[verify-only] hubspot upsert failed:",
        (err as Error).message,
      );
    }),
    appendToSheet({
      phone,
      firstName,
      lastName,
      email,
      source,
      pageUrl,
    }),
  ]);

  // 4. sh_pv cookie so the eventual form submit skips a second Twilio
  //    check (the verification has already been consumed above).
  const jsonRes = NextResponse.json({ ok: true, phone });
  const cookie = buildVerifiedCookie(phone);
  if (cookie) jsonRes.headers.set("Set-Cookie", cookie.header);
  return jsonRes;
}
