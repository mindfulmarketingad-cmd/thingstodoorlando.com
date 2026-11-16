import "server-only";
import { rankScore, TRANSPORT } from "@/lib/listicles";
import { getLiveListings } from "@/lib/listings";
import type { Listing } from "@/lib/types";

/**
 * Park tickets are often tagged "Agent Low Quality Product" by Viator, and the
 * shared finder drops those. Event pages still want the real ticket when the
 * title matches, because that is the product a reader can book.
 */
export async function ticketsForEvent(query: string, prefer?: string, limit = 4): Promise<Listing[]> {
  const live = await getLiveListings();
  const re = new RegExp(query, "i");
  const pref = prefer ? new RegExp(prefer, "i") : null;
  const matched = live.filter(
    (l) => re.test(l.title) && !TRANSPORT.test(l.title) && (l.reviewCount ?? 0) >= 10 && l.bookingUrl,
  );
  const rank = (list: Listing[]) => [...list].sort((a, b) => rankScore(b) - rankScore(a));
  const ordered = pref ? [...rank(matched.filter((l) => pref.test(l.title))), ...rank(matched.filter((l) => !pref.test(l.title)))] : rank(matched);
  const out: Listing[] = [];
  for (const listing of ordered) {
    if (out.some((o) => o.productCode === listing.productCode)) continue;
    out.push(listing);
    if (out.length >= limit) break;
  }
  return out;
}
