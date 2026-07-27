import { NextRequest, NextResponse } from "next/server";
import { submitLeadToHubSpot, type PotenzialanalyseLead } from "@/lib/hubspot";

// Talks to HubSpot with the private-app token → never prerender or cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Landing-page lead intake. The form also posts to Web3Forms for the e-mail
 * notification; this route is the CRM half, kept server-side so the HubSpot
 * token is never shipped to the browser.
 *
 * The lead is written to properties that already exist in the portal. Two
 * answers have no dedicated property yet — the landing page it came from and
 * "Inhaber / Entscheider" — so they go into the standard `message` field. If
 * those should become filterable, create two custom properties in HubSpot and
 * map them in `submitLeadToHubSpot`.
 */
export async function POST(req: NextRequest) {
  if (!process.env.HUBSPOT_TOKEN) {
    // The form still succeeds via Web3Forms — don't fail the submission.
    console.error("[lead] HUBSPOT_TOKEN is not set; skipping CRM sync");
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  let body: Partial<PotenzialanalyseLead>;
  try {
    body = (await req.json()) as Partial<PotenzialanalyseLead>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const company = body.company?.trim();

  if (!name || !phone || !company) {
    return NextResponse.json(
      { error: "name, phone and company are required" },
      { status: 400 },
    );
  }

  try {
    const contactId = await submitLeadToHubSpot({
      name,
      phone,
      company,
      decisionMaker: body.decisionMaker === "Nein" ? "Nein" : "Ja",
      landingPage: body.landingPage?.trim() || "Unbekannt",
    });
    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    // Log for us, but report success-ish to the client: the e-mail
    // notification already went out, so the lead is not lost.
    console.error("[lead] HubSpot sync failed:", (err as Error).message);
    return NextResponse.json({ ok: false, reason: "hubspot-error" }, { status: 200 });
  }
}
