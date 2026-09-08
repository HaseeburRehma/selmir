import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BR_HUBSPOT_LIST_ID,
  type BetriebsRoentgenSubmit,
} from "@/lib/betriebs-roentgen";
import {
  magnetFrom,
  magnetReplyTo,
  renderMagnetEmailHtml,
  renderMagnetEmailText,
} from "@/lib/email-branding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Betriebs-Röntgen submit — /api/betriebs-roentgen/submit
 *
 *   POST BetriebsRoentgenSubmit
 *
 * Pipeline:
 *   1. Basic validation
 *   2. HubSpot upsert (dedup on email) + add to list 822.
 *      Every wizard answer lands in a dedicated `br_*` contact
 *      property so Sales sees the full picture before calling.
 *   3. Append a row to the Google Sheet router so the Ops team has
 *      the same lead in their operational tab.
 *   4. Fire an internal "new lead" notification e-mail via Resend.
 *
 * Meta Pixel Lead fires client-side (see the wizard). Server-side
 * CAPI is not wired yet — matches the current /api/ebook state.
 */

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_TOKEN;

const RESEND_KEY = process.env.RESEND_API_KEY;
/** Sender name = "Selmir Suljkanovic · Betriebs-Röntgen" so the
 *  admin notification's From header identifies the source form. */
const FROM = magnetFrom("betriebs-roentgen");
const NOTIFY_TO = (
  process.env.NOTIFY_TO ?? "info@sh-wachstum.de,info@tylotech.de"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const SHEET_URL =
  process.env.BR_SHEET_WEBHOOK_URL ??
  process.env.GOOGLE_SHEET_WEBHOOK_URL ??
  "";

// ────────────────────────────────────────────────────────────────
//  HubSpot
// ────────────────────────────────────────────────────────────────

async function pushHubspot(
  b: BetriebsRoentgenSubmit,
): Promise<{ ok: boolean; contactId?: string; reason?: string }> {
  if (!HS_TOKEN) return { ok: false, reason: "HUBSPOT_TOKEN not set" };
  const headers = {
    Authorization: `Bearer ${HS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const properties: Record<string, string> = {
    email: b.email,
    firstname: b.firstName,
    phone: b.phone,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    // Two-level origin tagging (same convention as /ebook & /leitfaden).
    lead_source: "Website",
    lead_magnet: "Betriebs-Röntgen",
    // Betriebs-Röntgen answers — every field the tool collected.
    br_industry: b.industry,
    br_reaktionszeit: b.reaktionszeit,
    br_abschlussquote: String(b.abschlussquote),
    br_wochenstunden: String(b.wochenstunden),
    br_core_vertrieb: b.coreVertrieb,
    br_core_prozess: b.coreProzess,
    br_core_nachfassen: b.coreNachfassen,
    br_industry_q1: b.industryQ1,
    br_industry_q2: b.industryQ2,
  };
  if (b.lastName) properties.lastname = b.lastName;
  if (b.industryOther) properties.br_industry_other = b.industryOther;
  if (b.umsatz !== undefined) properties.br_umsatz = String(b.umsatz);
  if (b.mitarbeiter !== undefined)
    properties.br_mitarbeiter = String(b.mitarbeiter);
  if (b.anfragenMonat !== undefined)
    properties.br_anfragen_monat = String(b.anfragenMonat);
  if (b.auftragWert !== undefined)
    properties.br_auftrag_wert = String(b.auftragWert);

  // Same defensive create-or-patch pattern the other routes use:
  // if a custom property doesn't exist yet (portal setup lag), strip
  // the offending keys and retry once so lead capture keeps working.
  const attempt = async (
    props: Record<string, string>,
  ): Promise<{ status: number; text: string; contactId?: string }> => {
    const create = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ properties: props }),
    });
    if (create.ok) {
      const j = (await create.json()) as { id: string };
      return { status: create.status, text: "", contactId: j.id };
    }
    if (create.status === 409) {
      const patch = await fetch(
        `${HS_BASE}/crm/v3/objects/contacts/${encodeURIComponent(b.email)}?idProperty=email`,
        { method: "PATCH", headers, body: JSON.stringify({ properties: props }) },
      );
      if (patch.ok) {
        const j = (await patch.json()) as { id: string };
        return { status: patch.status, text: "", contactId: j.id };
      }
      return { status: patch.status, text: await patch.text() };
    }
    return { status: create.status, text: await create.text() };
  };

  const first = await attempt(properties);
  let contactId = first.contactId;
  if (!contactId) {
    if (first.status === 400 && /br_|lead_source|lead_magnet/i.test(first.text)) {
      console.warn(
        "[br] hubspot rejected a custom property — retrying without br_* / lead_* keys",
        first.text.slice(0, 300),
      );
      const stripped: Record<string, string> = {};
      for (const [k, v] of Object.entries(properties)) {
        if (k.startsWith("br_")) continue;
        if (k === "lead_source" || k === "lead_magnet") continue;
        stripped[k] = v;
      }
      const retry = await attempt(stripped);
      if (!retry.contactId) {
        return {
          ok: false,
          reason: `hubspot retry: ${retry.status} ${retry.text}`,
        };
      }
      contactId = retry.contactId;
    } else {
      return { ok: false, reason: `hubspot: ${first.status} ${first.text}` };
    }
  }

  // Add to the Betriebs-Röntgen static list. Fire-and-log — a failure
  // here shouldn't fail the whole submit; Sales still has the contact.
  const add = await fetch(
    `${HS_BASE}/crm/v3/lists/${BR_HUBSPOT_LIST_ID}/memberships/add`,
    { method: "PUT", headers, body: JSON.stringify([contactId]) },
  );
  if (!add.ok) {
    console.warn("[br] list add failed:", add.status, await add.text());
  }

  return { ok: true, contactId };
}

// ────────────────────────────────────────────────────────────────
//  Google Sheet — dedicated 'Betriebs-Roentgen' tab (v2 router).
//  Every wizard answer travels alongside contact info so Sales
//  can read the full qualifying picture without pivoting into
//  HubSpot. The Apps Script routes by `formType` and builds the
//  BR-specific 18-column row via lib/apps-script-router.
// ────────────────────────────────────────────────────────────────

async function appendToSheet(b: BetriebsRoentgenSubmit): Promise<void> {
  if (!SHEET_URL) return;
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "betriebs-roentgen",
        // Contact
        name: b.lastName ? `${b.firstName} ${b.lastName}` : b.firstName,
        email: b.email,
        phone: b.phone ? `'${b.phone}` : "",
        // Full wizard payload — column names match the tab's headers.
        industry:
          b.industry === "Sonstiges" && b.industryOther
            ? `Sonstiges — ${b.industryOther}`
            : b.industry,
        umsatz: b.umsatz ?? "",
        mitarbeiter: b.mitarbeiter ?? "",
        anfragenMonat: b.anfragenMonat ?? "",
        auftragWert: b.auftragWert ?? "",
        abschlussquote: b.abschlussquote,
        reaktionszeit: b.reaktionszeit,
        wochenstunden: b.wochenstunden,
        coreVertrieb: b.coreVertrieb,
        coreProzess: b.coreProzess,
        coreNachfassen: b.coreNachfassen,
        industryQ1: b.industryQ1,
        industryQ2: b.industryQ2,
        pageUrl: b.pageUrl ?? "",
      }),
    });
  } catch (err) {
    console.error("[br] sheet append failed:", (err as Error).message);
  }
}

// ────────────────────────────────────────────────────────────────
//  Internal notification e-mail
// ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNotifyHtml(b: BetriebsRoentgenSubmit): string {
  const row = (l: string, v: string | number | undefined) =>
    v === undefined || v === ""
      ? ""
      : `<tr><td style="padding:6px 10px;color:#666;">${esc(l)}</td><td style="padding:6px 10px;color:#111;"><b>${esc(String(v))}</b></td></tr>`;
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f5f5f7;margin:0;padding:24px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5ea;">
      <tr><td style="padding:20px 24px 8px 24px;font-weight:600;color:#7C5CFF;font-size:12px;letter-spacing:2px;text-transform:uppercase">Neuer Betriebs-Röntgen Lead</td></tr>
      <tr><td style="padding:0 24px 20px 24px;font-weight:700;font-size:22px;color:#111;">${esc(b.firstName)}${b.lastName ? " " + esc(b.lastName) : ""}</td></tr>
      <tr><td style="padding:0 12px 24px 12px;"><table cellspacing="0" cellpadding="0" style="width:100%;font-size:14px;border-collapse:collapse;">
        ${row("E-Mail", b.email)}
        ${row("Telefon", b.phone)}
        ${row("Branche", b.industry + (b.industryOther ? ` (${b.industryOther})` : ""))}
        ${row("Jahresumsatz", b.umsatz !== undefined ? b.umsatz.toLocaleString("de-DE") + " €" : undefined)}
        ${row("Mitarbeiter", b.mitarbeiter)}
        ${row("Anfragen / Monat", b.anfragenMonat)}
        ${row("Ø Auftragswert", b.auftragWert !== undefined ? b.auftragWert.toLocaleString("de-DE") + " €" : undefined)}
        ${row("Abschlussquote", `${b.abschlussquote} von 10`)}
        ${row("Reaktionszeit", b.reaktionszeit)}
        ${row("Wochenstunden Inhaber", b.wochenstunden + " h")}
        ${row("Vertrieb ohne dich", b.coreVertrieb)}
        ${row("Vertriebsprozess", b.coreProzess)}
        ${row("Nachfassen", b.coreNachfassen)}
        ${row("Branchen-Frage 1", b.industryQ1)}
        ${row("Branchen-Frage 2", b.industryQ2)}
        ${row("Landingpage", b.pageUrl ?? "")}
      </table></td></tr>
    </table>
  </body></html>`;
}

async function sendNotify(b: BetriebsRoentgenSubmit): Promise<void> {
  if (!RESEND_KEY || NOTIFY_TO.length === 0) return;
  try {
    const resend = new Resend(RESEND_KEY);
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `Neuer Betriebs-Röntgen Lead: ${b.firstName}${b.lastName ? " " + b.lastName : ""}`,
      html: renderNotifyHtml(b),
      replyTo: b.email,
    });
  } catch (err) {
    console.error("[br] notify email failed:", (err as Error).message);
  }
}

/**
 * User-side confirmation email — matches the on-screen Stage 5 copy
 * so the visitor has proof-in-inbox that their submission arrived and
 * knows the team will call back. No auto-report, no PDF — per client
 * brief, this tool is a lead qualifier, not a report generator.
 */
async function sendUserConfirmation(b: BetriebsRoentgenSubmit): Promise<void> {
  if (!RESEND_KEY) return;
  try {
    const resend = new Resend(RESEND_KEY);
    const content = {
      firstName: b.firstName,
      subject: "Danke — wir bereiten dein Röntgenbild vor",
      heading: `Danke, ${b.firstName}! Wir bereiten dein Röntgenbild vor.`,
      intro:
        "wir haben deine Antworten erhalten. Unser Team analysiert sie jetzt persönlich — kein Autopilot, kein Standard-PDF. Wir melden uns in Kürze telefonisch bei dir.",
      closingNote:
        "In der Zwischenzeit kannst du dir überlegen, wo dein Betrieb aktuell am meisten Zeit verliert — Vertrieb, Struktur, Führung oder Auslastung. Genau dort setzen wir im Gespräch an.",
    };
    await resend.emails.send({
      from: FROM,
      to: [b.email],
      subject: content.subject,
      html: renderMagnetEmailHtml("betriebs-roentgen", content),
      text: renderMagnetEmailText(content),
      replyTo: magnetReplyTo(),
    });
  } catch (err) {
    console.error("[br] user confirmation email failed:", (err as Error).message);
  }
}

// ────────────────────────────────────────────────────────────────
//  Route
// ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: BetriebsRoentgenSubmit;
  try {
    body = (await req.json()) as BetriebsRoentgenSubmit;
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }

  // Minimum contactability + industry to segment. Everything else is
  // qualifying context the analyst can live without in the worst case.
  const firstName = (body.firstName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  if (!firstName) {
    return NextResponse.json(
      { ok: false, reason: "Vorname fehlt" },
      { status: 400 },
    );
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { ok: false, reason: "Bitte gib eine gültige E-Mail an" },
      { status: 400 },
    );
  }
  if (!phone || phone.length < 5) {
    return NextResponse.json(
      { ok: false, reason: "Telefonnummer fehlt" },
      { status: 400 },
    );
  }
  if (!body.industry) {
    return NextResponse.json(
      { ok: false, reason: "Branche fehlt" },
      { status: 400 },
    );
  }

  // Normalize the payload so downstream sees the trimmed values.
  const normalized: BetriebsRoentgenSubmit = {
    ...body,
    firstName,
    lastName: (body.lastName ?? "").trim() || undefined,
    email,
    phone,
  };

  const hs = await pushHubspot(normalized).catch((err) => ({
    ok: false as const,
    reason: (err as Error).message,
  }));
  if (!hs.ok) console.warn("[br] hubspot failed:", hs.reason);

  // Fire-and-forget: sheet append + notify e-mail should never block the
  // response the visitor sees. Any failure ends up in the logs.
  void appendToSheet(normalized);
  void sendNotify(normalized);
  void sendUserConfirmation(normalized);

  return NextResponse.json({
    ok: true,
    hubspotContactId: hs.ok ? hs.contactId : null,
  });
}
