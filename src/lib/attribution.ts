/**
 * Ad attribution for the landing-page lead form.
 *
 * A Meta ad click lands on /lp/<slug>?utm_source=…&fbclid=… . We read those
 * parameters on first touch and keep them for the rest of the session, so the
 * campaign that paid for the click is still known by the time the visitor
 * scrolls down and submits the form — even if they hop between landing pages
 * on the way.
 */

export interface LeadAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Meta maps the ad name here by convention. */
  utmContent?: string;
  /** Meta maps the ad set name here by convention. */
  utmTerm?: string;
  campaignId?: string;
  adsetId?: string;
  adId?: string;
  fbclid?: string;
  landingPageUrl?: string;
  referrer?: string;
}

const STORAGE_KEY = "lp_attribution";

/**
 * Parameter aliases, in priority order — Meta's URL builder and hand-built ad
 * URLs don't agree on names, so accept the common spellings of each.
 */
const PARAM_ALIASES: Record<keyof Omit<LeadAttribution, "landingPageUrl" | "referrer">, string[]> = {
  utmSource: ["utm_source"],
  utmMedium: ["utm_medium"],
  utmCampaign: ["utm_campaign"],
  utmContent: ["utm_content"],
  utmTerm: ["utm_term"],
  campaignId: ["campaign_id", "utm_campaign_id", "hsa_cam"],
  adsetId: ["adset_id", "utm_adset_id", "adgroup_id", "hsa_grp"],
  adId: ["ad_id", "utm_ad_id", "creative_id", "hsa_ad"],
  fbclid: ["fbclid"],
};

function fromQuery(params: URLSearchParams): LeadAttribution {
  const out: LeadAttribution = {};
  for (const [key, aliases] of Object.entries(PARAM_ALIASES) as [
    keyof typeof PARAM_ALIASES,
    string[],
  ][]) {
    for (const alias of aliases) {
      const value = params.get(alias)?.trim();
      if (value) {
        out[key] = value.slice(0, 500);
        break;
      }
    }
  }
  return out;
}

/** True when the click carried anything worth remembering. */
function hasSignal(a: LeadAttribution): boolean {
  return Object.values(a).some(Boolean);
}

/**
 * Records the current URL's attribution, first touch wins. Safe to call on
 * every mount — a later page view without parameters won't overwrite the ad
 * click that started the session.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;

    const found = fromQuery(new URLSearchParams(window.location.search));
    if (!hasSignal(found)) return;

    found.landingPageUrl = window.location.href.slice(0, 900);
    if (document.referrer) found.referrer = document.referrer.slice(0, 500);

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // private mode / storage disabled — attribution is best-effort, never fatal
  }
}

/**
 * Attribution for the current submission: whatever was stored on first touch,
 * falling back to the live URL if storage was unavailable.
 */
export function readAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LeadAttribution;
  } catch {
    // fall through to the live URL
  }

  const live = fromQuery(new URLSearchParams(window.location.search));
  if (hasSignal(live)) {
    live.landingPageUrl = window.location.href.slice(0, 900);
    if (typeof document !== "undefined" && document.referrer) {
      live.referrer = document.referrer.slice(0, 500);
    }
  }
  return live;
}
