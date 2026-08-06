import { NextRequest, NextResponse } from "next/server";
import { sendNotification, type NotifyRow } from "@/lib/notify";

// Talks to Resend with the private API key → never prerender, never cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Landing-page lead notification. Sends a genuine German email to
 * info@sh-wachstum.de and info@tylotech.de. Replaces the Web3Forms path,
 * which added a hard-coded English preamble on the free plan.
 */
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    telefon?: string;
    firma?: string;
    entscheider?: "Ja" | "Nein";
    landingpage?: string;
    pageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid-json" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const telefon = body.telefon?.trim() ?? "";
  const firma = body.firma?.trim() ?? "";
  const entscheider = body.entscheider === "Nein" ? "Nein" : "Ja";
  const landingpage = body.landingpage?.trim() || "Unbekannt";
  const pageUrl = body.pageUrl?.trim() || "";

  if (!name || !telefon || !firma) {
    return NextResponse.json(
      { ok: false, reason: "name, telefon and firma are required" },
      { status: 400 },
    );
  }

  const rows: NotifyRow[] = [
    { label: "Name", value: name },
    { label: "Telefonnummer", value: telefon },
    { label: "Firma / Betrieb", value: firma },
    { label: "Inhaber / Entscheider", value: entscheider },
    { label: "Landingpage", value: landingpage },
  ];
  if (pageUrl) rows.push({ label: "Seiten-URL", value: pageUrl });

  try {
    const result = await sendNotification({
      subject: `Neue Potenzialanalyse-Anfrage von ${name}`,
      intro: `Über die Landingpage "${landingpage}" ist eine neue Anfrage für die kostenlose Potenzialanalyse eingegangen. Die Kontaktdaten findest du unten.`,
      rows,
    });
    if (!result.ok) {
      console.error("[notify/lead] send failed:", result.reason);
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[notify/lead] resend error:", (err as Error).message);
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 200 },
    );
  }
}
