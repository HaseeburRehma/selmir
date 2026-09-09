import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { lookupPhone, sendVerificationCode } from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/betriebs-roentgen/phone/send-code
 *   body: { phone: string, turnstileToken: string }
 *
 * Betriebs-Röntgen version of the shared SMS gate. Same pattern as
 * /api/leitfaden/phone/send-code:
 *
 *   1. Cloudflare Turnstile — kills scripted spammers before we spend
 *      a cent on Twilio. The token is one-shot; the widget resets on
 *      failure so the visitor's next attempt uses a fresh challenge.
 *   2. Twilio Lookup — HLR-checks that the number is a real mobile
 *      before we send an SMS. Costs ~0.5¢ per call, so it pays for
 *      itself the first time it stops a bot.
 *   3. Twilio Verify — sends the 6-digit code. Response returns the
 *      normalized E.164 so the wizard uses the same form Twilio
 *      approved on `check`.
 *
 * BR is the highest-intent form on the site (Sales calls back on
 * every submit), so the SMS gate matters here more than on any other
 * magnet.
 */
export async function POST(req: NextRequest) {
  let body: { phone?: string; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }

  const phone = (body.phone ?? "").trim();
  if (!phone) {
    return NextResponse.json(
      { ok: false, reason: "Telefonnummer fehlt." },
      { status: 400 },
    );
  }

  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    null;

  const ts = await verifyTurnstile(body.turnstileToken, ip);
  if (!ts.success) {
    console.warn("[br send-code] turnstile failed:", ts.reason, ts.errors);
    return NextResponse.json(
      {
        ok: false,
        reason:
          "Sicherheitsprüfung fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.",
      },
      { status: 400 },
    );
  }

  const lookup = await lookupPhone(phone);
  if (!lookup.ok) {
    return NextResponse.json(
      { ok: false, reason: lookup.reason },
      { status: 400 },
    );
  }

  const result = await sendVerificationCode(lookup.phone);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: result.reason, retryAfter: result.retryAfter },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    phone: result.phone,
    status: result.status,
  });
}
