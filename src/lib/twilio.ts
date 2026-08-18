/**
 * Twilio Verify — SMS one-time-code helper.
 *
 * We use Twilio's managed Verify service instead of rolling our own store:
 * Twilio holds the code, expiries, and retry limits per phone number. We
 * only ever call two endpoints:
 *
 *   POST /Services/{sid}/Verifications        → send a code to a phone
 *   POST /Services/{sid}/VerificationCheck    → confirm a code the user entered
 *
 * Auth is HTTP Basic with account SID + auth token.
 *
 * Env required (Vercel + .env.local):
 *   TWILIO_ACCOUNT_SID        — starts with AC…
 *   TWILIO_AUTH_TOKEN         — 32-char hex
 *   TWILIO_VERIFY_SERVICE_SID — starts with VA… (Console → Verify → Services)
 */

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

function isConfigured(): boolean {
  return !!(ACCOUNT_SID && AUTH_TOKEN && SERVICE_SID);
}

function authHeader(): string {
  return "Basic " + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64");
}

function verifyBase(): string {
  return `https://verify.twilio.com/v2/Services/${SERVICE_SID}`;
}

/**
 * Normalize a phone number the user typed into E.164 (the format Twilio
 * requires). Handles the common German inputs:
 *   "+49 151 12345678"  → "+4915112345678"
 *   "0049 151 12345678" → "+4915112345678"
 *   "0151 12345678"     → "+4915112345678"
 * Returns null when the input can't be turned into a plausible E.164.
 */
export function normalizeE164(raw: string): string | null {
  const cleaned = raw.replace(/[\s()\-]/g, "");
  if (/^\+\d{7,15}$/.test(cleaned)) return cleaned;
  if (/^00\d{7,15}$/.test(cleaned)) return "+" + cleaned.slice(2);
  if (/^0\d{6,14}$/.test(cleaned)) return "+49" + cleaned.slice(1);
  return null;
}

export type SendCodeResult =
  | { ok: true; phone: string; status: string }
  | { ok: false; reason: string; retryAfter?: number };

export type CheckCodeResult =
  | { ok: true; phone: string }
  | { ok: false; reason: string };

/** Trigger Twilio Verify to send an SMS with a 6-digit code. */
export async function sendVerificationCode(
  rawPhone: string,
): Promise<SendCodeResult> {
  if (!isConfigured()) {
    return {
      ok: false,
      reason:
        "SMS-Verifizierung ist noch nicht konfiguriert. Bitte informiere den Betreiber.",
    };
  }
  const phone = normalizeE164(rawPhone);
  if (!phone) {
    return { ok: false, reason: "Ungültige Telefonnummer." };
  }
  const body = new URLSearchParams();
  body.set("To", phone);
  body.set("Channel", "sms");

  try {
    const res = await fetch(`${verifyBase()}/Verifications`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // Twilio returns 60203 = "Max send attempts reached" — surface a
      // friendlier error and a suggested wait so the client can back off.
      if (text.includes("60203")) {
        return {
          ok: false,
          reason:
            "Zu viele Anfragen. Bitte warte ein paar Minuten und versuche es erneut.",
          retryAfter: 300,
        };
      }
      console.warn("[twilio] send failed:", res.status, text);
      return { ok: false, reason: `SMS konnte nicht gesendet werden (${res.status}).` };
    }
    const json = (await res.json()) as { status?: string };
    return { ok: true, phone, status: json.status ?? "pending" };
  } catch (err) {
    console.error("[twilio] send network error:", (err as Error).message);
    return { ok: false, reason: "Netzwerkfehler beim SMS-Versand." };
  }
}

/**
 * Twilio Lookup v2 — HLR check to confirm the number is a real, active
 * mobile before we spend an SMS on it. Adds `line_type_intelligence` so
 * we can reject landline / voip / non-existent numbers up-front.
 *
 * https://www.twilio.com/docs/lookup/v2-api/line-type-intelligence
 */
export type LookupResult =
  | { ok: true; phone: string; lineType: string }
  | { ok: false; reason: string };

export async function lookupPhone(rawPhone: string): Promise<LookupResult> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    return { ok: false, reason: "Twilio credentials are missing." };
  }
  const phone = normalizeE164(rawPhone);
  if (!phone) return { ok: false, reason: "Ungültige Telefonnummer." };
  const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(
    phone,
  )}?Fields=line_type_intelligence`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // 404 = number does not exist on any carrier
      if (res.status === 404) {
        return {
          ok: false,
          reason:
            "Diese Telefonnummer scheint nicht zu existieren. Bitte prüfe die Eingabe.",
        };
      }
      console.warn("[twilio] lookup failed:", res.status, text);
      return { ok: false, reason: "Nummernprüfung fehlgeschlagen." };
    }
    const json = (await res.json()) as {
      line_type_intelligence?: { type?: string };
      valid?: boolean;
    };
    const lineType = json.line_type_intelligence?.type ?? "unknown";
    // Accept mobile lines; reject anything obviously not able to receive SMS.
    const smsCapable =
      lineType === "mobile" ||
      lineType === "nonFixedVoip" ||
      lineType === "personal" ||
      lineType === "unknown"; // some carriers don't report; be lenient
    if (!smsCapable) {
      return {
        ok: false,
        reason:
          "Bitte gib eine Mobilnummer ein — an diese Nummer können wir keinen SMS-Code senden.",
      };
    }
    return { ok: true, phone, lineType };
  } catch (err) {
    console.error("[twilio] lookup network error:", (err as Error).message);
    return { ok: false, reason: "Netzwerkfehler bei der Nummernprüfung." };
  }
}

/** Verify a code the user typed. Returns `ok: true` iff Twilio replies `approved`. */
export async function checkVerificationCode(
  rawPhone: string,
  code: string,
): Promise<CheckCodeResult> {
  if (!isConfigured()) {
    return { ok: false, reason: "SMS-Verifizierung ist nicht konfiguriert." };
  }
  const phone = normalizeE164(rawPhone);
  if (!phone) return { ok: false, reason: "Ungültige Telefonnummer." };
  if (!/^\d{4,10}$/.test(code)) {
    return { ok: false, reason: "Bitte gib den 6-stelligen Code ein." };
  }

  const body = new URLSearchParams();
  body.set("To", phone);
  body.set("Code", code);

  try {
    const res = await fetch(`${verifyBase()}/VerificationCheck`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // 404 = the verification expired or was already consumed.
      if (res.status === 404) {
        return {
          ok: false,
          reason:
            "Der Code ist abgelaufen oder wurde bereits verwendet. Bitte fordere einen neuen Code an.",
        };
      }
      console.warn("[twilio] check failed:", res.status, text);
      return { ok: false, reason: `Prüfung fehlgeschlagen (${res.status}).` };
    }
    const json = (await res.json()) as { status?: string; valid?: boolean };
    if (json.status === "approved" || json.valid === true) {
      return { ok: true, phone };
    }
    return { ok: false, reason: "Der Code ist nicht korrekt." };
  } catch (err) {
    console.error("[twilio] check network error:", (err as Error).message);
    return { ok: false, reason: "Netzwerkfehler bei der Code-Prüfung." };
  }
}
