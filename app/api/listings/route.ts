import { getAllListings } from "@/lib/listings";
import { slimListing } from "@/lib/slim";

/** Full catalog for the Book Now filters. Built with the snapshot and served as a static file. */
export const dynamic = "force-static";

export async function GET() {
  const all = await getAllListings();
  return Response.json(all.map(slimListing));
}
