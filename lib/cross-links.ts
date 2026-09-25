import { categoryBySlug } from "./categories";
import { collectionBySlug } from "./collections";
import { stayGuideBySlug, stayGuides } from "@/data/stay-guides";

/**
 * Two-way links between /place-to-stay guides and /book-now pages
 * (categories, collections and the today page). One map drives both sides.
 */
const STAY_TO_BOOK: Record<string, string[]> = {
  "hotels-near-kennedy-space-center": ["kennedy-space-center", "cheap-day-trips-from-orlando", "top-tourist-attractions-in-orlando-florida"],
  "hotels-near-port-canaveral": ["kennedy-space-center", "cheap-day-trips-from-orlando", "day-trips"],
  "hotels-near-orange-county-convention-center": ["things-to-do-near-international-drive", "cheap-attractions-and-sightseeing", "drinks-and-nightlife", "top-tourist-attractions-in-orlando-florida"],
  "hotels-near-seaworld-orlando": ["things-to-do-near-international-drive", "theme-parks", "cheap-theme-park-tickets", "family-friendly"],
  "hotels-near-legoland-florida": ["cheap-theme-park-tickets", "theme-parks", "cheap-family-activities", "family-friendly"],
  "hotels-near-disney-world": ["things-to-do-near-disney-world", "theme-parks", "cheap-theme-park-tickets", "family-friendly"],
  "hotels-near-downtown-winter-park": ["things-to-do-near-winter-park", "cheap-kayak-and-water-activities", "cute-date-ideas-orlando-florida", "couples"],
  "hotels-near-lake-nona": ["kennedy-space-center", "things-to-do-near-downtown-orlando", "things-to-do-in-orlando-under-50"],
  "hotels-near-cocoa-beach": ["kennedy-space-center", "water-adventures", "cheap-day-trips-from-orlando"],
  "family-hotels-in-orlando": ["family-friendly", "cheap-family-activities", "theme-parks", "things-to-do-in-orlando-under-50"],
  "best-hotels-for-disney-marathon-weekend": ["things-to-do-near-disney-world", "relaxation-and-spas", "food-and-dining"],
  "best-hotels-for-rocket-launch-viewing": ["kennedy-space-center", "cheap-day-trips-from-orlando", "top-tourist-attractions-in-orlando-florida"],
  "luxury-resort-hotels-in-orlando": ["private-tours-in-orlando", "cute-date-ideas-orlando-florida", "relaxation-and-spas", "hot-air-balloons"],
};

/** Extra /book-now pages that should point at a guide even though the guide does not list them. */
const BOOK_TO_STAY_EXTRA: Record<string, string[]> = {
  "things-to-do-near-kissimmee": ["family-hotels-in-orlando", "hotels-near-disney-world"],
  "things-to-do-near-downtown-orlando": ["hotels-near-downtown-winter-park", "hotels-near-lake-nona"],
  "cheap-date-night-ideas": ["hotels-near-downtown-winter-park", "luxury-resort-hotels-in-orlando"],
  "private-fishing-charters-in-orlando": ["hotels-near-disney-world", "family-hotels-in-orlando"],
  "airboat-and-wildlife": ["family-hotels-in-orlando"],
  "things-to-do-in-orlando-under-25": ["family-hotels-in-orlando"],
  "things-to-do-in-orlando-under-100": ["hotels-near-disney-world", "family-hotels-in-orlando"],
  "cheap-food-tours-and-dining": ["hotels-near-downtown-winter-park"],
  today: ["hotels-near-disney-world", "family-hotels-in-orlando", "hotels-near-orange-county-convention-center"],
};

export interface CrossLink {
  href: string;
  label: string;
}

function bookNowLabel(slug: string): string | null {
  if (slug === "today") return "Events today in Orlando";
  const c = collectionBySlug.get(slug);
  if (c) return c.h1;
  const cat = categoryBySlug.get(slug);
  if (cat) return `${cat.label} Tours and Events in Orlando Florida`;
  return null;
}

/** /book-now pages to show on a /place-to-stay guide. */
export function bookNowLinksForStay(staySlug: string): CrossLink[] {
  return [...(STAY_TO_BOOK[staySlug] ?? []), "today"]
    .map((s) => ({ href: `/book-now/${s}`, label: bookNowLabel(s) }))
    .filter((l): l is CrossLink => !!l.label);
}

/** /place-to-stay guides to show on a /book-now page (category, collection or "today"). */
export function stayLinksForBookNow(bookSlug: string): CrossLink[] {
  const fromMap = stayGuides.filter((g) => STAY_TO_BOOK[g.slug]?.includes(bookSlug)).map((g) => g.slug);
  const slugs = [...new Set([...fromMap, ...(BOOK_TO_STAY_EXTRA[bookSlug] ?? [])])];
  return slugs
    .map((s) => stayGuideBySlug.get(s))
    .filter((g) => !!g)
    .map((g) => ({ href: `/place-to-stay/${g!.slug}`, label: g!.h1 }));
}
