/**
 * Server-side Cloudflare Turnstile verification.
 *
 * The client widget solves a challenge in the browser and hands us a
 * short-lived token via the form POST. We forward that token to
 * challenges.cloudflare.com/turnstile/v0/siteverify with the site's
 * SECRET, along with the requester's IP — Cloudflare replies with
 * { success: true|false }.
 *
 * Defaults use Cloudflare's public test keys, which ALWAYS pass in
 * development. Set the real keys in Vercel env vars to enable actual
 * bot protection:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   — the site key (safe to expose)
 *   TURNSTILE_SECRET_KEY             — the secret (server-only)
 *
 * Test keys reference:
 *   1x00000000000000000000AA          / 1x0000000000000000000000000000000AA
 *     → widget always passes, siteverify always returns success
 *   2x00000000000000000000AB          / 2x0000000000000000000000000000000AA
 *     → widget always fails
 *   3x00000000000000000000FF          / 3x0000000000000000000000000000000AA
 *     → widget shows an interactive challenge
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Public site key — safe to embed in the page. Falls back to the
 *  test key that always passes. */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

const SECRET =
  process.env.TURNSTILE_SECRET_KEY ?? "1x0000000000000000000000000000000AA";

export type TurnstileResult =
  | { success: true }
  | { success: false; reason: string; errors?: string[] };

/**
 * Verify a token returned by the client-side widget.
 * @param token  cf-turnstile-response value from the form
 * @param ip     optional visitor IP (from x-forwarded-for)
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string | null,
): Promise<TurnstileResult> {
  if (!token) return { success: false, reason: "missing-token" };

  const body = new URLSearchParams();
  body.set("secret", SECRET);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (json.success) return { success: true };
    return {
      success: false,
      reason: "verify-failed",
      errors: json["error-codes"] ?? [],
    };
  } catch (err) {
    return {
      success: false,
      reason: `verify-network: ${(err as Error).message}`,
    };
  }
}
