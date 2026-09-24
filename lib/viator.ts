import "server-only";
import type { CategoryKey, IllustrationKey, Listing, ListingDetail, ListingImage } from "./types";
import { slugify } from "./slug";

/**
 * Viator Partner API v2 client. Runs on the server only so the API key is
 * never shipped to the browser. Every call fails soft: callers get `null`
 * and the site falls back to curated guide content.
 */

const API_BASE = (process.env.VIATOR_API_BASE || "https://api.viator.com/partner").replace(/\/$/, "");
const API_KEY = process.env.VIATOR_API_KEY || "";
export const DESTINATION_ID = process.env.VIATOR_DESTINATION_ID || "663"; // Orlando
const TIMEOUT_MS = 12_000;

export const viatorEnabled = API_KEY.length > 0;

/* ---------- Raw API shapes (only the fields we use) ---------- */

interface RawImageVariant {
  url?: string;
  width?: number;
  height?: number;
}
interface RawImage {
  caption?: string;
  isCover?: boolean;
  variants?: RawImageVariant[];
}
interface RawProduct {
  productCode?: string;
  title?: string;
  description?: string;
  images?: RawImage[];
  reviews?: { totalReviews?: number; combinedAverageRating?: number };
  duration?: {
    fixedDurationInMinutes?: number;
    variableDurationFromMinutes?: number;
    variableDurationToMinutes?: number;
    unstructuredDuration?: string;
  };
  pricing?: { summary?: { fromPrice?: number }; currency?: string };
  productUrl?: string;
  flags?: string[];
  status?: string;
}
interface RawProductDetail extends RawProduct {
  inclusions?: { otherDescription?: string; description?: string; typeDescription?: string }[];
  exclusions?: { otherDescription?: string; description?: string; typeDescription?: string }[];
  additionalInfo?: { type?: string; description?: string }[];
  cancellationPolicy?: { description?: string };
  logistics?: {
    start?: { description?: string }[];
    travelerPickup?: { additionalInfo?: string };
  };
}

/* ---------- HTTP ---------- */

async function viatorFetch<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown; revalidate?: number } = {},
): Promise<T | null> {
  if (!viatorEnabled) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: init.method || "GET",
      headers: {
        "exp-api-key": API_KEY,
        Accept: "application/json;version=2.0",
        "Accept-Language": "en-US",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
      cache: "force-cache",
      next: { revalidate: init.revalidate ?? 21_600, tags: ["viator"] },
    });
    if (!res.ok) {
      console.error(`[viator] ${init.method || "GET"} ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[viator] ${path} failed:`, (err as Error).message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Mapping ---------- */

const ALLOWED_IMAGE_HOSTS = [
  "media.tacdn.com",
  "media-cdn.tripadvisor.com",
  "hare-media-cdn.tripadvisor.com",
  "dynamic-media-cdn.tripadvisor.com",
  "media.viator.com",
];

function pickImage(images: RawImage[] | undefined, title: string, targetWidth = 720): ListingImage | undefined {
  const all = images?.length ? [...images].sort((a, b) => Number(!!b.isCover) - Number(!!a.isCover)) : [];
  for (const img of all) {
    const variants = (img.variants || []).filter(
      (v): v is Required<RawImageVariant> =>
        !!v.url && !!v.width && !!v.height && isAllowedImage(v.url),
    );
    if (!variants.length) continue;
    const best =
      variants.filter((v) => v.width >= targetWidth).sort((a, b) => a.width - b.width)[0] ||
      variants.sort((a, b) => b.width - a.width)[0];
    return { url: best.url, width: best.width, height: best.height, alt: img.caption?.trim() || title };
  }
  return undefined;
}

function isAllowedImage(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

function isSafeBookingUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "viator.com" || u.hostname.endsWith(".viator.com"));
  } catch {
    return false;
  }
}

export function formatDuration(minutes?: number, toMinutes?: number): string | undefined {
  if (!minutes) return undefined;
  const fmt = (m: number) => {
    if (m >= 1440) {
      const d = Math.round(m / 1440);
      return `${d} day${d > 1 ? "s" : ""}`;
    }
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (!h) return `${r} min`;
    return r ? `${h} hr ${r} min` : `${h} hour${h > 1 ? "s" : ""}`;
  };
  return toMinutes && toMinutes !== minutes ? `${fmt(minutes)} to ${fmt(toMinutes)}` : fmt(minutes);
}

function clean(text: string | undefined): string {
  return (text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function summarize(text: string, max = 180): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}...`;
}

export function mapProduct(p: RawProduct, categories: CategoryKey[], illustration: IllustrationKey): Listing | null {
  if (!p.productCode || !p.title || !isSafeBookingUrl(p.productUrl)) return null;
  if (p.status && p.status !== "ACTIVE") return null;
  // Only show real, bookable listings: a photo and a price are required.
  if (!p.pricing?.summary?.fromPrice || !pickImage(p.images, p.title)) return null;
  const title = clean(p.title);
  const description = clean(p.description);
  const minutes = p.duration?.fixedDurationInMinutes ?? p.duration?.variableDurationFromMinutes;
  const rating = p.reviews?.combinedAverageRating;
  return {
    slug: slugify(title),
    source: "viator",
    productCode: p.productCode,
    title,
    summary: summarize(description),
    description: description.slice(0, 1200),
    image: pickImage(p.images, title),
    illustration,
    rating: rating ? Math.round(rating * 10) / 10 : undefined,
    reviewCount: p.reviews?.totalReviews || undefined,
    priceFrom: p.pricing?.summary?.fromPrice ? Math.round(p.pricing.summary.fromPrice * 100) / 100 : undefined,
    currency: p.pricing?.currency || "USD",
    durationMinutes: minutes,
    durationLabel: formatDuration(minutes, p.duration?.variableDurationToMinutes),
    location: "Orlando, Florida",
    categories,
    freeCancellation: p.flags?.includes("FREE_CANCELLATION"),
    bookingUrl: p.productUrl,
  };
}

/* ---------- Endpoints ---------- */

/** Top rated products in the destination, paged (max 50 per page). */
export async function searchDestinationProducts(start = 1, count = 50): Promise<RawProduct[] | null> {
  const data = await viatorFetch<{ products?: RawProduct[] }>("/products/search", {
    method: "POST",
    body: {
      filtering: { destination: DESTINATION_ID },
      sorting: { sort: "TRAVELER_RATING", order: "DESCENDING" },
      pagination: { start, count },
      currency: "USD",
    },
  });
  return data?.products ?? null;
}

/** Free-text product search scoped to the destination. */
export async function freetextProducts(term: string, count = 24): Promise<RawProduct[] | null> {
  const data = await viatorFetch<{ products?: { results?: RawProduct[] } }>("/search/freetext", {
    method: "POST",
    body: {
      searchTerm: term.slice(0, 100),
      productFiltering: { destination: DESTINATION_ID },
      productSorting: { sort: "DEFAULT" },
      searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count } }],
      currency: "USD",
    },
  });
  return data?.products?.results ?? null;
}

/** Full product content for a detail page. */
export async function getProductDetail(base: Listing): Promise<ListingDetail> {
  if (!base.productCode) return base;
  const d = await viatorFetch<RawProductDetail>(`/products/${encodeURIComponent(base.productCode)}`);
  if (!d) return base;
  const textOf = (i: { otherDescription?: string; description?: string; typeDescription?: string }) =>
    clean(i.otherDescription || i.description || i.typeDescription);
  const gallery = (d.images || [])
    .slice(0, 8)
    .map((img) => pickImage([img], base.title, 1024))
    .filter((i): i is ListingImage => !!i);
  const fullDescription = clean(d.description);
  return {
    ...base,
    description: fullDescription || base.description,
    image: pickImage(d.images, base.title, 1024) || base.image,
    gallery,
    inclusions: (d.inclusions || []).map(textOf).filter(Boolean).slice(0, 15),
    exclusions: (d.exclusions || []).map(textOf).filter(Boolean).slice(0, 15),
    additionalInfo: (d.additionalInfo || []).map((i) => clean(i.description)).filter(Boolean).slice(0, 12),
    cancellationPolicy: clean(d.cancellationPolicy?.description) || undefined,
    meetingPoint:
      clean(d.logistics?.start?.[0]?.description) || clean(d.logistics?.travelerPickup?.additionalInfo) || undefined,
    bookingUrl: isSafeBookingUrl(d.productUrl) ? d.productUrl : base.bookingUrl,
  };
}

/** Viator search URL used for curated guides (affiliate params appended when configured). */
export function viatorSearchUrl(term: string, ids: { pid?: string; mcid?: string } = {}): string {
  const url = new URL("https://www.viator.com/searchResults/all");
  url.searchParams.set("text", `${term} Orlando`);
  const pid = process.env.VIATOR_PID || ids.pid;
  const mcid = process.env.VIATOR_MCID || ids.mcid;
  if (pid) url.searchParams.set("pid", pid);
  if (mcid) url.searchParams.set("mcid", mcid);
  if (pid || mcid) url.searchParams.set("medium", "link");
  return url.toString();
}
