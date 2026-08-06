import { NextRequest, NextResponse } from "next/server";
import { sendNotification, type NotifyRow } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Site-wide contact form notification. German email to
 * info@sh-wachstum.de and info@tylotech.de.
 */
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    betreff?: string;
    nachricht?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid-json" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const betreff = body.betreff?.trim() ?? "";
  const nachricht = body.nachricht?.trim() ?? "";

  if (!name || !email || !nachricht) {
    return NextResponse.json(
      { ok: false, reason: "name, email and nachricht are required" },
      { status: 400 },
    );
  }

  const rows: NotifyRow[] = [
    { label: "Name", value: name },
    { label: "E-Mail", value: email },
  ];
  if (betreff) rows.push({ label: "Betreff", value: betreff });
  rows.push({ label: "Nachricht", value: nachricht });

  try {
    const result = await sendNotification({
      subject: `Neue Kontaktanfrage von ${name}${betreff ? ` — ${betreff}` : ""}`,
      intro: `Über das Kontaktformular auf der Website ist eine neue Nachricht eingegangen. Antworte einfach auf diese E-Mail, um direkt an ${name} zu schreiben.`,
      rows,
      replyTo: email,
    });
    if (!result.ok) {
      console.error("[notify/contact] send failed:", result.reason);
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[notify/contact] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
