/**
 * Signed cookie for "this browser already verified phone number X".
 *
 * A returning user shouldn't have to re-do the SMS dance every visit — but
 * we can't trust a client-side flag alone (a bot would just set it). So we
 * hand the browser an HMAC-signed cookie after a successful verification:
 *
 *   sh_pv = <base64url(phone)>.<expiresMs>.<hmacSha256(...)>
 *
 * The cookie is NOT HttpOnly on purpose — the form reads it to skip the
 * SMS step in the UI. Tampering doesn't grant access because the server
 * re-computes and compares the HMAC before honouring it.
 *
 * Rotate the secret to invalidate every issued cookie at once.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "sh_pv";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Secret used to sign the cookie. Same env var name in Vercel + .env.local. */
function secret(): string {
  const s = process.env.PHONE_VERIFY_SECRET;
  if (!s || s.length < 24) {
    throw new Error(
      "PHONE_VERIFY_SECRET is required (min 24 chars). Set it in Vercel env.",
    );
  }
  return s;
}

function b64uEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64uDecode(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  ).toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", secret())
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Build the cookie value + a Set-Cookie header string.
 * Returns null if the module is not configured (missing secret) — callers
 * should treat that as "skip cookie" rather than surface an error.
 */
export function buildVerifiedCookie(
  phoneE164: string,
): { value: string; header: string } | null {
  let s: string;
  try {
    s = secret();
  } catch {
    console.warn(
      "[phoneVerify] PHONE_VERIFY_SECRET not set — cookie not issued.",
    );
    return null;
  }
  const expires = Date.now() + MAX_AGE_MS;
  const phoneB64 = b64uEncode(phoneE164);
  const payload = `${phoneB64}.${expires}`;
  const sig = sign(payload);
  const value = `${payload}.${sig}`;
  const maxAgeSec = Math.floor(MAX_AGE_MS / 1000);
  const header = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax; Secure`;
  return { value, header };
  // Note: intentionally NOT HttpOnly. The form reads the cookie for UX
  // (to pre-populate the phone and skip SMS). Tampering can't succeed
  // because the HMAC is verified server-side on every use.
  //
  // `s` is intentionally only referenced above to prove the secret is
  // configured; the actual signing already happened.
}

/**
 * Given the raw cookie header from a request, return the phone (E.164)
 * that was verified — or null if no valid cookie is present.
 */
export function readVerifiedPhone(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const raw = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  const value = raw.slice(COOKIE_NAME.length + 1);
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [phoneB64, expiresStr, sig] = parts;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  let expectedSig: string;
  try {
    expectedSig = sign(`${phoneB64}.${expiresStr}`);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return b64uDecode(phoneB64);
  } catch {
    return null;
  }
}
