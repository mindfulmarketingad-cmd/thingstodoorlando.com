import Link from "next/link";
import ListingMedia from "./ListingMedia";
import Stars from "./Stars";
import { ClockIcon, PinIcon, TagIcon } from "./Icons";
import { categoryByKey } from "@/lib/categories";
import type { Listing } from "@/lib/types";

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export default function ListingCard({ listing, headingLevel = 3 }: { listing: Listing; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const primary = categoryByKey[listing.categories[0]];
  return (
    <article className="card">
      <div className="card-media">
        <ListingMedia listing={listing} />
        {listing.freeCancellation ? (
          <span className="card-badge is-green">Free cancellation</span>
        ) : listing.source === "guide" ? (
          <span className="card-badge">Expert guide</span>
        ) : null}
      </div>
      <div className="card-body">
        <H className="card-title">
          <Link href={`/book-now/${listing.slug}`}>{listing.title}</Link>
        </H>
        {listing.rating ? <Stars rating={listing.rating} reviews={listing.reviewCount} /> : null}
        <ul className="card-meta">
          <li>
            <PinIcon size={15} />
            {listing.location}
          </li>
          {listing.durationLabel && (
            <li>
              <ClockIcon size={15} />
              {listing.durationLabel}
            </li>
          )}
          {primary && (
            <li>
              <TagIcon size={15} />
              {primary.shortName}
            </li>
          )}
        </ul>
        <div className="card-foot">
          {listing.priceFrom ? (
            <span className="price">
              From <strong>{formatPrice(listing.priceFrom, listing.currency)}</strong>
            </span>
          ) : (
            <span className="price">
              Live prices <strong style={{ fontSize: "1rem" }}>Compare tours</strong>
            </span>
          )}
          <span className="card-cta" aria-hidden>
            View details
          </span>
        </div>
      </div>
    </article>
  );
}
