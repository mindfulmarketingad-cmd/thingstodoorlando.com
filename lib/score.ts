import type { Listing } from "./types";

/** Popularity score balancing rating and review volume. */
export function score(l: Pick<Listing, "rating" | "reviewCount">): number {
  if (!l.rating) return 0;
  return l.rating * Math.log10((l.reviewCount ?? 0) + 10);
}
