import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { guides } from "@/data/guides";
import { categories, categoryByKey } from "./categories";
import { score } from "./score";
import { slugify } from "./slug";
import type { CategoryKey, Listing } from "./types";
import { freetextProducts, mapProduct, searchDestinationProducts, viatorSearchUrl } from "./viator";

/** Keyword rules used to place live products into site categories. */
const CATEGORY_RULES: Record<CategoryKey, RegExp> = {
  "theme-parks": /\b(disney|universal|seaworld|legoland|busch gardens|theme park|epic universe|volcano bay|aquatica|park ticket)/i,
  space: /\b(kennedy|space center|nasa|rocket|launch|astronaut|space coast)/i,
  wildlife: /\b(airboat|gator|alligator|wildlife|swamp|everglades|manatee|dolphin|safari|eco|nature|zoo|bird)/i,
  "dinner-shows": /\b(dinner show|dinner theater|medieval|pirate|comedy|mystery|cabaret|nightlife|show tickets)/i,
  water: /\b(kayak|paddle|boat|cruise|springs?|snorkel|jet ?ski|fishing|pontoon|lake|scuba|swim)/i,
  sky: /\b(balloon|helicopter|skydiv|flight|airplane|zip ?line|observation wheel|the wheel)/i,
  family: /\b(famil|kids?|children|legoland|gatorland|zoo|aquarium|dinner show|pirate|medieval|theme park|disney|kid-friendly)/i,
  couples: /\b(romantic|sunset|couples?|wine|champagne|balloon|date night|dinner cruise|cocktail|spa\b|honeymoon|proposal)/i,
  "day-trips": /\b(day trip|from orlando|st\.? augustine|clearwater|miami|tampa|key west|daytona|cocoa beach|crystal river|everglades)/i,
  "food-and-city": /\b(food|tasting|brewery|beer|cocktail|culinary|walking tour|city tour|segway|bike tour|winter park|downtown|ghost tour|pub crawl)/i,
  sightseeing: /\b(sightseeing|attraction pass|city pass|hop-on|trolley|museum|class|workshop|photo ?shoot|transfer|shuttle|escape room|go-?kart|golf)/i,
};

function classify(text: string, seed: CategoryKey[] = []): CategoryKey[] {
  const found = new Set<CategoryKey>(seed);
  for (const [key, rule] of Object.entries(CATEGORY_RULES) as [CategoryKey, RegExp][]) {
    if (rule.test(text)) found.add(key);
  }
  return [...found];
}

export const getGuideListings = cache((): Listing[] =>
  guides.map((g) => ({
    slug: slugify(g.title),
    source: "guide",
    title: g.title,
    summary: g.summary,
    description: g.description,
    illustration: g.illustration,
    currency: "USD",
    durationMinutes: g.durationMinutes,
    durationLabel: g.durationLabel,
    location: g.location,
    categories: g.categories,
    bookingUrl: viatorSearchUrl(g.searchTerm, affiliateParams()),
    highlights: g.highlights,
    goodToKnow: g.goodToKnow,
    bestFor: g.bestFor,
    searchTerm: g.searchTerm,
  })),
);

type RawProduct = Parameters<typeof mapProduct>[0] & { tagNames?: string[] };

interface Snapshot {
  fetchedAt: string | null;
  products: RawProduct[];
}

/** Snapshot written by scripts/fetch-viator.mjs (GitHub Action). Read once per server instance. */
let snapshotCache: Snapshot | null = null;
function readSnapshot(): Snapshot {
  if (snapshotCache) return snapshotCache;
  try {
    const raw = readFileSync(join(process.cwd(), "data", "viator-products.json"), "utf8");
    snapshotCache = JSON.parse(raw) as Snapshot;
  } catch {
    snapshotCache = { fetchedAt: null, products: [] };
  }
  return snapshotCache;
}

export function snapshotDate(): string | null {
  return readSnapshot().fetchedAt;
}

/** Affiliate pid/mcid taken from the snapshot's product URLs (Viator adds them for our key). */
function affiliateParams(): { pid?: string; mcid?: string } {
  const url = readSnapshot().products.find((p) => p.productUrl)?.productUrl;
  if (!url) return {};
  try {
    const u = new URL(url);
    return { pid: u.searchParams.get("pid") ?? undefined, mcid: u.searchParams.get("mcid") ?? undefined };
  } catch {
    return {};
  }
}

/** Viator's internal merchandising tags say nothing about the activity itself. */
const META_TAG =
  /quality|conversion|sell out|cancellation|availability|new product|agent favorite|weather dependent|private and luxury|small group|half-day|full-day|best /i;

function classifyProduct(raw: RawProduct, seed: CategoryKey[] = []): CategoryKey[] {
  const tags = (raw.tagNames ?? []).filter((t) => !META_TAG.test(t));
  const primary = classify(`${raw.title ?? ""} ${tags.join(" ")}`, seed);
  if (primary.length) return primary;
  const fallback = classify(raw.description ?? "");
  return fallback.length ? fallback : ["sightseeing"];
}

let snapshotListings: Listing[] | null = null;

/**
 * Every Viator product for Orlando. Uses the committed snapshot when present;
 * otherwise falls back to live API calls (cached for 6 hours) when a key is set.
 */
export const getLiveListings = cache(async (): Promise<Listing[]> => {
  const snap = readSnapshot();
  if (snap.products.length) {
    if (!snapshotListings) {
      const byCode = new Map<string, Listing>();
      for (const raw of snap.products) {
        const cats = classifyProduct(raw);
        const mapped = mapProduct(raw, cats, categoryByKey[cats[0]].illustration);
        if (mapped?.productCode && !byCode.has(mapped.productCode)) byCode.set(mapped.productCode, mapped);
      }
      snapshotListings = assignSlugs([...byCode.values()]);
    }
    return snapshotListings;
  }

  const [pages, perCategory] = await Promise.all([
    Promise.all([1, 51, 101].map((start) => searchDestinationProducts(start, 50))),
    Promise.all(categories.map(async (c) => ({ c, results: await freetextProducts(c.viatorTerm, 24) }))),
  ]);

  const byCode = new Map<string, Listing>();
  const add = (raw: RawProduct, seed: CategoryKey[]) => {
    const cats = classifyProduct(raw, seed);
    const mapped = mapProduct(raw, cats, categoryByKey[cats[0]].illustration);
    if (!mapped || !mapped.productCode) return;
    const existing = byCode.get(mapped.productCode);
    if (existing) {
      existing.categories = [...new Set([...existing.categories, ...mapped.categories])];
    } else {
      byCode.set(mapped.productCode, mapped);
    }
  };

  for (const page of pages) for (const p of page ?? []) add(p, []);
  for (const { c, results } of perCategory) for (const p of results ?? []) add(p, [c.key]);
  return assignSlugs([...byCode.values()]);
});

function assignSlugs(items: Listing[]): Listing[] {
  // Stable, unique slugs that never collide with guide URLs.
  const taken = new Set([...getGuideListings().map((g) => g.slug), ...categories.map((c) => c.slug)]);
  const live = items.sort((a, b) => score(b) - score(a));
  for (const l of live) {
    let slug = l.slug || slugify(l.productCode ?? "tour");
    if (taken.has(slug)) slug = `${slug}-${slugify(l.productCode ?? "tour")}`;
    l.slug = slug;
    taken.add(slug);
  }
  return live;
}

export { score };

export const getAllListings = cache(async (): Promise<Listing[]> => {
  const live = await getLiveListings();
  return [...getGuideListings(), ...live];
});

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const all = await getAllListings();
  return all.find((l) => l.slug === slug);
}

/**
 * Listings for a category grid. Live products lead when the API is available;
 * curated guides fill any remaining slots so grids are never empty.
 */
export async function getListingsForCategory(key: CategoryKey, limit = 6): Promise<Listing[]> {
  const live = (await getLiveListings()).filter((l) => l.categories.includes(key));
  const guideItems = getGuideListings().filter((l) => l.categories.includes(key));
  return [...live, ...guideItems].slice(0, limit);
}

export async function getTrendingListings(limit = 6): Promise<Listing[]> {
  const live = await getLiveListings();
  if (live.length >= limit) return live.slice(0, limit);
  return [...live, ...getGuideListings()].slice(0, limit);
}

/** Live tours related to a listing, used on detail pages. */
export async function getRelatedListings(listing: Listing, limit = 6): Promise<Listing[]> {
  const all = await getAllListings();
  const terms = (listing.searchTerm || listing.title)
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);
  return all
    .filter((l) => l.slug !== listing.slug)
    .map((l) => {
      const shared = l.categories.filter((c) => listing.categories.includes(c)).length;
      const hay = l.title.toLowerCase();
      const termHits = terms.filter((t) => hay.includes(t)).length;
      return { l, s: termHits * 3 + shared + score(l) / 10 };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.l);
}
