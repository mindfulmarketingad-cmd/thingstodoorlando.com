/**
 * Pulls every Viator product for Orlando, Florida and saves a trimmed
 * snapshot to data/viator-products.json. The site renders from this file,
 * so it never needs the API key at request time.
 *
 * Usage: VIATOR_API_KEY=... node scripts/fetch-viator.mjs
 * Runs in GitHub Actions via .github/workflows/sync-viator.yml.
 */
import { writeFileSync } from "node:fs";

const KEY = process.env.VIATOR_API_KEY;
const BASE = (process.env.VIATOR_API_BASE || "https://api.viator.com/partner").replace(/\/$/, "");
const DEST = process.env.VIATOR_DESTINATION_ID || "663"; // Orlando
const OUT = "data/viator-products.json";
const PAGE = 50;

if (!KEY) {
  console.error("VIATOR_API_KEY is not set.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, { method = "GET", body } = {}) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "exp-api-key": KEY,
        Accept: "application/json;version=2.0",
        "Accept-Language": "en-US",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if (res.status === 429 || res.status >= 500) {
      const wait = 2000 * attempt;
      console.warn(`${method} ${path} -> ${res.status}, retrying in ${wait}ms`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  throw new Error(`${method} ${path} failed after retries`);
}

function trimImages(images = []) {
  const sorted = [...images].sort((a, b) => Number(!!b.isCover) - Number(!!a.isCover));
  return sorted.slice(0, 5).map((img) => {
    const variants = (img.variants || []).filter((v) => v.url && v.width && v.height);
    // Keep a card-sized and a hero-sized variant.
    const pick = (w) =>
      variants.filter((v) => v.width >= w).sort((a, b) => a.width - b.width)[0] ||
      variants.sort((a, b) => b.width - a.width)[0];
    const chosen = [...new Set([pick(720), pick(1024)].filter(Boolean))];
    return { caption: img.caption, isCover: img.isCover, variants: chosen };
  });
}

// 1. Tag taxonomy, so products can be categorized by Viator's own tags.
let tagNames = new Map();
try {
  const tagData = await api("/products/tags");
  for (const t of tagData.tags || []) {
    const name = t.allNamesByLocale?.en || t.allNamesByLocale?.["en-US"];
    if (name) tagNames.set(t.tagId, name);
  }
  console.log(`Loaded ${tagNames.size} tags`);
} catch (err) {
  console.warn(`Tag taxonomy unavailable: ${err.message}`);
}

// 2. Every product in the destination.
const products = [];
const seen = new Set();
let total = Infinity;
for (let start = 1; start <= total; start += PAGE) {
  const data = await api("/products/search", {
    method: "POST",
    body: {
      filtering: { destination: DEST },
      sorting: { sort: "TRAVELER_RATING", order: "DESCENDING" },
      pagination: { start, count: PAGE },
      currency: "USD",
    },
  });
  total = data.totalCount ?? 0;
  const batch = data.products || [];
  for (const p of batch) {
    if (!p.productCode || seen.has(p.productCode)) continue;
    seen.add(p.productCode);
    products.push({
      productCode: p.productCode,
      title: p.title,
      description: (p.description || "").slice(0, 1500),
      images: trimImages(p.images),
      reviews: p.reviews
        ? { totalReviews: p.reviews.totalReviews, combinedAverageRating: p.reviews.combinedAverageRating }
        : undefined,
      duration: p.duration,
      pricing: p.pricing ? { summary: { fromPrice: p.pricing.summary?.fromPrice }, currency: p.pricing.currency } : undefined,
      productUrl: p.productUrl,
      flags: p.flags,
      tagNames: (p.tags || []).map((id) => tagNames.get(id)).filter(Boolean),
    });
  }
  console.log(`Fetched ${Math.min(start + PAGE - 1, total)} / ${total}`);
  if (!batch.length) break;
  await sleep(250);
}

if (!products.length) {
  console.error("No products returned. Keeping the existing snapshot.");
  process.exit(1);
}

writeFileSync(
  OUT,
  JSON.stringify({ fetchedAt: new Date().toISOString(), destinationId: DEST, totalCount: products.length, products }),
);
console.log(`Saved ${products.length} products to ${OUT}`);
