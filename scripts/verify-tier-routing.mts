import { readFileSync } from "node:fs";

// load .env.local
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}

const { resolveTier } = await import("../src/lib/smd2026.ts");
const { trackSaleInHubSpot } = await import("../src/lib/hubspot.ts");

const BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_TOKEN!;
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const MASTER = process.env.SMD2026_LIST_ID ?? "761";
const EXPECT: Record<string, string> = { Basic: "757", Business: "758", "First Class": "760" };
const ALL_TIER = ["757", "758", "760"];

// contact -> which lists it belongs to
async function listsFor(contactId: string): Promise<Set<string>> {
  const r = await fetch(`${BASE}/crm/v3/lists/records/0-1/${contactId}/memberships`, { headers: H });
  const d: any = await r.json();
  const ids = (d.results ?? []).map((x: any) => String(x.listId ?? x.listInternalId ?? x));
  return new Set(ids);
}
async function removeFromList(listId: string, contactId: string) {
  await fetch(`${BASE}/crm/v3/lists/${listId}/memberships/remove`, {
    method: "PUT", headers: H, body: JSON.stringify([contactId]),
  });
}
async function archiveContact(contactId: string) {
  await fetch(`${BASE}/crm/v3/objects/contacts/${contactId}`, { method: "DELETE", headers: H });
}

const ts = Date.now();
const CASES = [
  { amount: 69, expect: "Basic" },
  { amount: 379, expect: "Business" },
  { amount: 1199, expect: "First Class" },
];

const created: string[] = [];
let allPass = true;

for (const c of CASES) {
  const email = `smd-tier-test-${c.expect.replace(/\s/g, "").toLowerCase()}-${ts}@example.com`;
  const tier = resolveTier(undefined, c.amount);
  const tierOk = tier === c.expect;

  const id = await trackSaleInHubSpot({
    email, firstName: "TIER", lastName: `TEST ${c.expect}`,
    tier, amount: c.amount, currency: "EUR", quantity: 1,
    purchaseDate: new Date().toISOString(), stripeSessionId: `test_${ts}_${c.expect}`,
  });
  created.push(id);

  const lists = await listsFor(id);
  const wantList = EXPECT[c.expect];
  const inCorrect = lists.has(wantList);
  const inMaster = lists.has(MASTER);
  const wrongTierLists = ALL_TIER.filter((l) => l !== wantList && lists.has(l));

  const pass = tierOk && inCorrect && inMaster && wrongTierLists.length === 0;
  allPass &&= pass;
  console.log(
    `${pass ? "✅ PASS" : "❌ FAIL"}  €${c.amount} → tier=${tier}${tierOk ? "" : ` (EXPECTED ${c.expect})`}` +
    ` | in correct list ${wantList}=${inCorrect} | in master ${MASTER}=${inMaster}` +
    (wrongTierLists.length ? ` | LEAKED into ${wrongTierLists.join(",")}` : "") +
    ` | contactId=${id} lists={${[...lists].join(",")}}`,
  );
}

// cleanup
console.log("— cleaning up test contacts —");
for (const id of created) {
  for (const l of [...ALL_TIER, MASTER]) await removeFromList(l, id);
  await archiveContact(id);
}
console.log(created.length, "test contacts removed from lists + archived");
console.log(allPass ? "\nRESULT: ✅ ALL 3 TIERS ROUTE CORRECTLY" : "\nRESULT: ❌ SOMETHING IS WRONG");
process.exit(allPass ? 0 : 1);
