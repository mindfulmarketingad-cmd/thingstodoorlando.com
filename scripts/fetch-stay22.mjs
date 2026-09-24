/**
 * Pulls hotels for each Orlando area from the Stay22 API and saves a trimmed
 * snapshot to data/stay22-hotels.json. Prices are never stored: the site shows
 * a "Check prices" button and Stay22 shows live prices after the click.
 *
 * Usage: STAY22_API_KEY=... node scripts/fetch-stay22.mjs
 * Runs in GitHub Actions via .github/workflows/sync-stay22.yml.
 */
import { writeFileSync } from "node:fs";

const KEY = process.env.STAY22_API_KEY || "";
const BASE = (process.env.STAY22_API_BASE || "https://api.stay22.com/v2").replace(/\/$/, "");
const AID = process.env.STAY22_AID || "mindfulmarketingagen";
const OUT = "data/stay22-hotels.json";
const SAMPLE = "data/stay22-sample.json";
const PER_AREA = 12;

/** Area keys are referenced by lib/hotels.ts. */
const AREAS = {
  disney: "Lake Buena Vista, FL",
  universal: "Universal Orlando Resort, Orlando, FL",
  "international-drive": "International Drive, Orlando, FL",
  kissimmee: "Kissimmee, FL",
  downtown: "Downtown Orlando, FL",
  "winter-park": "Winter Park, FL",
  airport: "Orlando International Airport, Orlando, FL",
  "space-coast": "Cocoa Beach, FL",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Auth: the v2 docs are not public, so try the common schemes once and reuse the one that works ---------- */
const AUTH_MODES = [
  { name: "header x-api-key", headers: { "x-api-key": KEY } },
  { name: "header Authorization Bearer", headers: { Authorization: `Bearer ${KEY}` } },
  { name: "query apiKey", query: { apiKey: KEY } },
  { name: "query key", query: { key: KEY } },
  { name: "demo (no key)", headers: {} },
].filter((m) => KEY || m.name.startsWith("demo"));

let auth = null;

async function request(params, mode) {
  const url = new URL(`${BASE}/accommodations`);
  for (const [k, v] of Object.entries({ ...params, ...(mode.query || {}) })) url.searchParams.set(k, String(v));
  const res = await fetch(url, { headers: { Accept: "application/json", ...(mode.headers || {}) } });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON error page */
  }
  return { status: res.status, json, text };
}

async function search(address) {
  const params = { address, aid: AID, limit: PER_AREA * 2, currency: "USD", lang: "en" };
  const modes = auth ? [auth] : AUTH_MODES;
  for (const mode of modes) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const r = await request(params, mode);
      if (r.status === 429 || r.status >= 500) {
        const wait = mode.name.startsWith("demo") ? 15_000 : 3000 * attempt;
        console.warn(`${address} -> ${r.status}, retrying in ${wait}ms`);
        await sleep(wait);
        continue;
      }
      if (r.status >= 200 && r.status < 300 && r.json && findResults(r.json).length) {
        if (!auth) console.log(`Auth scheme: ${mode.name}`);
        auth = mode;
        return r.json;
      }
      console.warn(`${address} [${mode.name}] -> ${r.status}: ${r.text.slice(0, 200).replace(KEY, "***")}`);
      break;
    }
  }
  return null;
}

/* ---------- Normalizing an unknown response shape ---------- */
function findResults(json) {
  if (Array.isArray(json)) return json;
  for (const k of ["results", "accommodations", "hotels", "data", "items", "properties", "stays"]) {
    const v = json?.[k];
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") {
      const inner = findResults(v);
      if (inner.length) return inner;
    }
  }
  return [];
}

const get = (obj, paths) => {
  for (const p of paths) {
    const v = p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const PRICE_KEY = /price|cost|amount|currency|fee|discount|deal|^rate$|^rates$|total|tax/i;

/** Removes every price-like field, recursively. Used for the schema sample. */
function stripPrices(v) {
  if (Array.isArray(v)) return v.map(stripPrices);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).filter(([k]) => !PRICE_KEY.test(k)).map(([k, x]) => [k, stripPrices(x)]));
  }
  return v;
}

function httpsUrl(v) {
  if (typeof v !== "string") return undefined;
  try {
    const u = new URL(v.startsWith("//") ? `https:${v}` : v);
    return u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

function firstImage(h) {
  const cand = get(h, ["images", "photos", "pictures", "media", "gallery"]);
  const list = Array.isArray(cand) ? cand : [];
  for (const img of list) {
    const u = httpsUrl(typeof img === "string" ? img : get(img, ["url", "large", "original", "src", "href", "medium", "thumbnail"]));
    if (u) return u;
  }
  return httpsUrl(get(h, ["image", "imageUrl", "image_url", "photo", "photoUrl", "thumbnail", "thumbnailUrl", "mainImage", "mainPhoto", "coverImage"]));
}

function num(v) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
}

/** Only Stay22 links carry our affiliate tracking; supplier links are dropped. */
function trackedLink(h) {
  const cand = [
    get(h, ["url", "link", "deeplink", "deepLink", "bookingUrl", "booking_url", "affiliateUrl", "href", "stay22Url"]),
    ...Object.values(get(h, ["suppliers", "providers", "links"]) || {}).map((s) => (typeof s === "string" ? s : get(s, ["url", "link", "deeplink"]))),
  ];
  for (const c of cand) {
    const u = httpsUrl(c);
    if (!u) continue;
    const url = new URL(u);
    if (url.hostname === "stay22.com" || url.hostname.endsWith(".stay22.com")) {
      if (!url.searchParams.get("aid")) url.searchParams.set("aid", AID);
      return url.toString();
    }
  }
  return undefined;
}

function normalize(h) {
  const name = String(get(h, ["name", "title", "hotelName", "propertyName", "hotel.name"]) || "").trim();
  const image = firstImage(h);
  if (!name || !image) return null;
  const rating = num(get(h, ["rating", "reviewScore", "review_score", "score", "guestRating", "reviews.score", "reviews.rating", "review.score"]));
  const reviews = num(get(h, ["reviewCount", "review_count", "reviewsCount", "numberOfReviews", "reviews.count", "reviews.total", "review.count"]));
  const stars = num(get(h, ["stars", "starRating", "star_rating", "class", "hotelClass", "category"]));
  const type = get(h, ["type", "propertyType", "property_type", "accommodationType", "kind"]);
  return {
    id: String(get(h, ["id", "hotelId", "propertyId", "hotel_id", "_id"]) || name).slice(0, 80),
    name: name.slice(0, 120),
    image,
    rating: rating && rating > 0 ? Math.round(rating * 10) / 10 : undefined,
    ratingScale: rating ? (rating > 5 ? 10 : 5) : undefined,
    reviewCount: reviews && reviews > 0 ? Math.round(reviews) : undefined,
    stars: stars && stars > 0 && stars <= 5 ? stars : undefined,
    type: typeof type === "string" ? type.slice(0, 40) : undefined,
    neighborhood: (() => {
      const v = get(h, ["neighborhood", "district", "area", "address.neighborhood", "location.neighborhood", "city", "address.city", "location.city"]);
      return typeof v === "string" ? v.slice(0, 60) : undefined;
    })(),
    link: trackedLink(h),
  };
}

/* ---------- Run ---------- */
const snapshot = { updated: new Date().toISOString(), areas: {}, imageHosts: [] };
const hosts = new Set();
let sample = null;

for (const [key, address] of Object.entries(AREAS)) {
  const json = await search(address);
  const raw = json ? findResults(json) : [];
  if (json && !sample) {
    sample = {
      note: "Price fields removed. Used only to check the response shape.",
      topLevelKeys: Array.isArray(json) ? ["(array)"] : Object.keys(json),
      firstResults: stripPrices(raw.slice(0, 2)),
    };
  }
  const seen = new Set();
  const hotels = raw
    .map(normalize)
    .filter((h) => h && !seen.has(h.name.toLowerCase()) && seen.add(h.name.toLowerCase()))
    .sort((a, b) => (b.rating ?? 0) * Math.log10((b.reviewCount ?? 1) + 9) - (a.rating ?? 0) * Math.log10((a.reviewCount ?? 1) + 9))
    .slice(0, PER_AREA);
  hotels.forEach((h) => hosts.add(new URL(h.image).hostname));
  snapshot.areas[key] = { address, hotels };
  console.log(`${key}: ${hotels.length} hotels (${raw.length} raw)`);
  if (auth?.name.startsWith("demo")) await sleep(13_000);
}

snapshot.imageHosts = [...hosts].sort();
const total = Object.values(snapshot.areas).reduce((n, a) => n + a.hotels.length, 0);
if (!total) {
  if (sample) writeFileSync(SAMPLE, `${JSON.stringify(sample, null, 2)}\n`);
  console.error("No hotels could be normalized. Check data/stay22-sample.json for the response shape.");
  process.exit(sample ? 0 : 1);
}
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
if (sample) writeFileSync(SAMPLE, `${JSON.stringify(sample, null, 2)}\n`);
console.log(`Saved ${total} hotels. Image hosts: ${snapshot.imageHosts.join(", ")}`);
