import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { guides } from "@/data/guides";
import { categories, categoryByKey } from "./categories";
import { score } from "./score";
import { slugify } from "./slug";
import type { CategoryKey, Listing } from "./types";
import { freetextProducts, mapProduct, searchDestinationProducts, } from "./viator";

/** Keyword rules used to place live products into site categories. */
const CATEGORY_RULES: Record<CategoryKey, RegExp> = {
  "theme-parks": /\b(disney|universal|seaworld|legoland|busch gardens|theme park|epic universe|volcano bay|aquatica|park ticket)/i,
  space: /\b(kennedy|space center|nasa|rocket|launch|astronaut|space coast)/i,
  wildlife: /\b(airboat|gator|alligator|wildlife|swamp|everglades|manatee|dolphin|safari|eco|nature|zoo|bird)/i,
  "dinner-shows": /\b(dinner show|dinner theater|medieval|pirate|comedy|mystery|cabaret|show tickets)/i,
  water: /\b(kayak|paddle|boat|cruise|springs?|snorkel|jet ?ski|fishing|pontoon|lake|scuba|swim)/i,
  sky: /\b(balloon|helicopter|skydiv|flight|airplane|zip ?line|observation wheel|the wheel)/i,
  family: /\b(famil|kids?|children|legoland|gatorland|zoo|aquarium|dinner show|pirate|medieval|theme park|disney|kid-friendly)/i,
  couples: /\b(romantic|sunset|couples?|wine|champagne|balloon|date night|dinner cruise|cocktail|spa\b|honeymoon|proposal)/i,
  "day-trips": /\b(day trip|from orlando|st\.? augustine|clearwater|miami|tampa|key west|daytona|cocoa beach|crystal river|everglades)/i,
  "food-and-dining": /\b(food|foodie|culinary|cooking class(es)?|dining experiences?|restaurants?|chocolate|dessert|coffee|brunch|street food|eats|bbq|dinner cruise|lunch cruise|food tours?|culinary tours?)\b/i,
  "drinks-and-nightlife": /\b(brewery|breweries|beer|cocktails?|wine|winery|wineries|wine tastings?|distillery|bar crawl|pub crawl|bar hop|nightlife|nightclubs?|club crawl|speakeasy|mixology|happy hour|party bus|party boat|pubs?|bars|booze)\b/i,
  relaxation: /\b(spas?|massages?|wellness|yoga|relaxation|float therapy|sauna|facials?|meditation|sound bath|reiki)\b/i,
  sports: /\b(golf(?! cart)|tee times?|sporting events?|nba|nfl|mls|nhl|orlando magic|football|soccer|baseball|hockey|basketball|stadium|tennis|pickleball|surf(ing)? lessons?|race car|racing|go ?karts?|nascar|speedway|skydiv\w*|waterski\w*|wakeboard\w*|wakesurf\w*)\b/i,
  shopping: /\b(shopping|outlets?|malls?|boutiques?|personal styling|personal shopper|flea market)\b/i,
  sightseeing: /\b(walking tour|city tour|segway|bike tour|winter park|downtown|ghost tour|sightseeing|attraction pass|city pass|hop-on|trolley|museum|class|workshop|photo ?shoot|transfer|shuttle|escape room|go-?kart|golf)/i,
};

/** Operators over-tag heavily, so these narrow categories match on the product title only. */
const TITLE_ONLY = new Set<CategoryKey>(["sports", "shopping", "relaxation"]);

function classify(text: string, seed: CategoryKey[] = [], title = text): CategoryKey[] {
  const found = new Set<CategoryKey>(seed);
  // Transfers and shuttles only mention golf clubs, malls or spas as destinations.
  const isTransfer = /transfer|shuttle|private driver/i.test(title);
  for (const [key, rule] of Object.entries(CATEGORY_RULES) as [CategoryKey, RegExp][]) {
    if (TITLE_ONLY.has(key) && (isTransfer || !title)) continue;
    if (rule.test(TITLE_ONLY.has(key) ? title : text)) found.add(key);
  }
  return [...found];
}

/** Old editorial guide URLs, kept only so links and redirects can resolve to real products. */
export const guideSlugs = guides.map((g) => ({
  slug: slugify(g.title),
  searchTerm: g.searchTerm,
  category: g.categories[0],
}));

const LINK_STOP = new Set(["orlando", "tour", "tours", "tickets", "ticket", "from", "the", "and", "ride", "day", "trip"]);

/**
 * Maps each old guide URL to the best matching real Viator product
 * (all search terms in the title, highest rated), or to its category page.
 */
export const getGuideLinkMap = cache(async (): Promise<Map<string, string>> => {
  const live = await getLiveListings();
  const map = new Map<string, string>();
  for (const g of guideSlugs) {
    const terms = g.searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2 && !LINK_STOP.has(t));
    const match = terms.length
      ? live.find((l) => {
          const title = l.title.toLowerCase();
          return terms.every((t) => title.includes(t));
        })
      : undefined;
    map.set(`/book-now/${g.slug}`, match ? `/book-now/${match.slug}` : `/book-now/${categoryByKey[g.category].slug}`);
  }
  return map;
});

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


/** Viator's internal merchandising tags say nothing about the activity itself. */
const META_TAG =
  /^food & drink$|^fun & games$|^extreme sports$|^shopping tours$|quality|zombie|dsa non|conversion|sell out|cancellation|availability|new product|agent favorite|weather dependent|private and luxury|small group|half-day|full-day|best /i;

function classifyProduct(raw: RawProduct, seed: CategoryKey[] = []): CategoryKey[] {
  const tags = (raw.tagNames ?? []).filter((t) => !META_TAG.test(t));
  const primary = classify(`${raw.title ?? ""} ${tags.join(" ")}`, seed, raw.title ?? "");
  if (primary.length) return primary;
  // Description fallback never assigns the narrow title-only categories.
  const fallback = classify(raw.description ?? "", [], "");
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
        if (mapped?.productCode && !byCode.has(mapped.productCode)) {
          mapped.tags = raw.tagNames;
          byCode.set(mapped.productCode, mapped);
        }
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
  const taken = new Set([...guideSlugs.map((g) => g.slug), ...categories.map((c) => c.slug)]);
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

/** Every bookable Viator product. Only real listings with a photo and a price are shown. */
export const getAllListings = cache(async (): Promise<Listing[]> => getLiveListings());

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const all = await getAllListings();
  return all.find((l) => l.slug === slug);
}

/** Top rated real products in a category. */
export async function getListingsForCategory(key: CategoryKey, limit = 6): Promise<Listing[]> {
  return (await getLiveListings()).filter((l) => l.categories.includes(key)).slice(0, limit);
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
