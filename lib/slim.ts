import type { Listing } from "./types";

/** Fields the cards and filters need in the browser. */
export function slimListing(l: Listing): Listing {
  return {
    slug: l.slug,
    source: l.source,
    title: l.title,
    summary: l.summary.slice(0, 140),
    description: "",
    image: l.image,
    illustration: l.illustration,
    rating: l.rating,
    reviewCount: l.reviewCount,
    priceFrom: l.priceFrom,
    currency: l.currency,
    durationMinutes: l.durationMinutes,
    durationLabel: l.durationLabel,
    location: l.location,
    categories: l.categories,
    freeCancellation: l.freeCancellation,
    bookingUrl: "",
  };
}

/** Default ordering: expert guides first, then live tours by popularity. */
export function recommendedOrder(items: Listing[]): Listing[] {
  const pop = (l: Listing) => (l.rating ? l.rating * Math.log10((l.reviewCount ?? 0) + 10) : 0);
  return [...items].sort((a, b) => (a.source === b.source ? pop(b) - pop(a) : a.source === "guide" ? -1 : 1));
}
