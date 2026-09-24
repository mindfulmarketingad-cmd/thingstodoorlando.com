import Image from "next/image";
import type { Listing } from "@/lib/types";

/** Live Viator photos when available, otherwise the brand illustration for the category. */
export default function ListingMedia({
  listing,
  sizes = "(max-width: 600px) 100vw, (max-width: 960px) 50vw, 380px",
  priority = false,
}: {
  listing: Pick<Listing, "image" | "illustration" | "title">;
  sizes?: string;
  priority?: boolean;
}) {
  if (listing.image) {
    return (
      <Image
        src={listing.image.url}
        alt={listing.image.alt}
        width={listing.image.width}
        height={listing.image.height}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return (
    <img
      src={`/illustrations/${listing.illustration}.svg`}
      alt={`Illustration for ${listing.title}`}
      width={800}
      height={600}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
