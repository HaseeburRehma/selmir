import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendVerificationCode } from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leitfaden/phone/send-code
 *   body: { phone: string, turnstileToken: string }
 *
 * Cloudflare Turnstile protects this endpoint because every hit costs an
 * SMS on Twilio — a bot spinning it would run up real money. Turnstile is
 * checked BEFORE we touch Twilio.
 *
 * After the client uses the token here, the widget resets and the next
 * subscribe call re-uses the fresh token (subscribe itself is protected
 * by Twilio's approval instead — a bot cannot forge that).
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
    console.warn("[send-code] turnstile failed:", ts.reason, ts.errors);
    return NextResponse.json(
      {
        ok: false,
        reason:
          "Sicherheitsprüfung fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.",
      },
      { status: 400 },
    );
  }

  const result = await sendVerificationCode(phone);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: result.reason, retryAfter: result.retryAfter },
      { status: 400 },
    );
  }

  // Return the normalized phone so the client can display it and use it
  // for the subsequent /subscribe call — Twilio will only approve the same
  // E.164 form we used on send.
  return NextResponse.json({
    ok: true,
    phone: result.phone,
    status: result.status,
  });
}
