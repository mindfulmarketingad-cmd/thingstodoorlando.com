import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { CategoryKey, Listing } from "./types";

/**
 * Hotels from the Stay22 snapshot (data/stay22-hotels.json, written by the
 * sync-stay22 GitHub Action). Prices are intentionally not stored; every card
 * sends visitors to Stay22 to check live prices.
 */

export type HotelArea =
  | "disney"
  | "universal"
  | "international-drive"
  | "kissimmee"
  | "downtown"
  | "winter-park"
  | "airport"
  | "space-coast";

export interface Hotel {
  id: string;
  name: string;
  image: string;
  rating?: number;
  ratingScale?: 5 | 10;
  reviewCount?: number;
  stars?: number;
  type?: string;
  neighborhood?: string;
  /** Tracked Stay22 link for this property, when the API provides one. */
  link?: string;
}

interface Snapshot {
  updated: string;
  imageHosts: string[];
  areas: Partial<Record<HotelArea, { address: string; hotels: Hotel[] }>>;
}

export const areaLabel: Record<HotelArea, string> = {
  disney: "Walt Disney World",
  universal: "Universal Orlando",
  "international-drive": "International Drive",
  kissimmee: "Kissimmee",
  downtown: "Downtown Orlando",
  "winter-park": "Winter Park",
  airport: "Orlando International Airport",
  "space-coast": "the Space Coast",
};

let cached: Snapshot | null | undefined;
function snapshot(): Snapshot | null {
  if (cached !== undefined) return cached;
  try {
    cached = JSON.parse(readFileSync(path.join(process.cwd(), "data/stay22-hotels.json"), "utf8")) as Snapshot;
  } catch {
    cached = null;
  }
  return cached;
}

const SAFE_IMAGE = /^https:\/\//;

export function getHotels(area: HotelArea, limit = 4): Hotel[] {
  return (snapshot()?.areas[area]?.hotels ?? []).filter((h) => SAFE_IMAGE.test(h.image)).slice(0, limit);
}

const CATEGORY_AREA: Record<CategoryKey, HotelArea> = {
  "theme-parks": "disney",
  space: "space-coast",
  wildlife: "kissimmee",
  "dinner-shows": "international-drive",
  water: "international-drive",
  sky: "kissimmee",
  family: "disney",
  couples: "downtown",
  "day-trips": "international-drive",
  "food-and-dining": "downtown",
  "drinks-and-nightlife": "downtown",
  relaxation: "international-drive",
  sports: "downtown",
  shopping: "international-drive",
  sightseeing: "international-drive",
};

const TITLE_AREA: [RegExp, HotelArea][] = [
  [/universal|citywalk|epic universe|volcano bay/i, "universal"],
  [/disney|magic kingdom|epcot|animal kingdom|hollywood studios/i, "disney"],
  [/kennedy|space center|cocoa beach|cape canaveral|titusville|rocket launch/i, "space-coast"],
  [/winter park/i, "winter-park"],
  [/kissimmee|st\.? cloud|lake toho/i, "kissimmee"],
  [/downtown|lake eola/i, "downtown"],
  [/international drive|i-drive|icon park|the wheel/i, "international-drive"],
];

export function areaForCategory(key: CategoryKey): HotelArea {
  return CATEGORY_AREA[key] ?? "international-drive";
}

export function areaForListing(listing: Listing): HotelArea {
  for (const [re, area] of TITLE_AREA) if (re.test(listing.title)) return area;
  return listing.categories[0] ? areaForCategory(listing.categories[0]) : "international-drive";
}

/** Maps the area names used in post [[hotels:Area]] markers. */
export function areaFromName(name?: string): HotelArea {
  if (!name) return "international-drive";
  for (const [re, area] of TITLE_AREA) if (re.test(name)) return area;
  if (/airport/i.test(name)) return "airport";
  return "international-drive";
}
