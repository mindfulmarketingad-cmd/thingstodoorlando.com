import { getAllListings } from "@/lib/listings";
import { slimListing } from "@/lib/slim";

export const revalidate = 21600;

/** Full catalog for the Book Now filters. Static, CDN cached, read-only. */
export async function GET() {
  const all = await getAllListings();
  return Response.json(all.map(slimListing), {
    headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" },
  });
}
