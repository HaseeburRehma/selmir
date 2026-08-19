import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leitfaden/phone/send-code
 *
 * SMS verification is TEMPORARILY DISABLED — the client hasn't provided
 * Twilio credentials yet. The full 2-step flow (Turnstile + Twilio
 * Lookup + Twilio Verify + signed `sh_pv` skip cookie) is preserved in:
 *
 *   src/lib/twilio.ts          — Verify + Lookup wrappers
 *   src/lib/phoneVerify.ts     — HMAC cookie signer
 *   src/components/leitfaden/LeitfadenForm.tsx (git history)
 *   src/app/api/leitfaden/subscribe/route.ts   (git history)
 *
 * To re-enable, restore the two-step client + rewrite this handler back
 * to the original body (see commit `Leitfaden: add SMS verification via
 * Twilio Verify`).
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { ok: false, reason: "SMS verification is disabled." },
    { status: 503 },
  );
}
