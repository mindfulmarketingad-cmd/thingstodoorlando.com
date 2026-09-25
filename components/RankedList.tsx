import Link from "next/link";
import BookButton from "./BookButton";
import DatePicker from "./DatePicker";
import ListingMedia from "./ListingMedia";
import Stars from "./Stars";
import { formatPrice } from "./ListingCard";
import { CheckIcon, ClockIcon, PinIcon, TagIcon } from "./Icons";
import { itemReasons, itemSummary } from "@/lib/listicles";
import type { Listing } from "@/lib/types";

/** Numbered, detailed list of real Viator products used by listicles and blog posts. */
export default function RankedList({
  items,
  anchor = (i: number) => `pick-${i + 1}`,
  headingLevel = 2,
  showDate = true,
}: {
  items: Listing[];
  anchor?: (i: number) => string;
  headingLevel?: 2 | 3;
  /** Show the travel date picker above the list. */
  showDate?: boolean;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const Sub = headingLevel === 2 ? "h3" : "h4";
  return (
    <>
      {showDate && (
        <div className="date-bar">
          <DatePicker variant="inline" label="Your travel date" />
          <span>Every &quot;Check availability&quot; button opens the booking page for this date.</span>
        </div>
      )}
    <ol className="rank-list">
      {items.map((l, i) => (
        <li key={l.slug} id={anchor(i)} className="rank-item">
          <div className="rank-media">
            <span className="rank-num" aria-hidden>
              {i + 1}
            </span>
            <ListingMedia listing={l} sizes="(max-width: 760px) 100vw, 320px" priority={i === 0} />
          </div>
          <div className="rank-body">
            <H className="rank-title">
              <span className="sr-only">{i + 1}. </span>
              <Link href={`/book-now/${l.slug}`}>{l.title}</Link>
            </H>
            {l.rating ? <Stars rating={l.rating} reviews={l.reviewCount} /> : null}
            <ul className="card-meta rank-meta">
              <li>
                <PinIcon size={15} />
                {l.location}
              </li>
              {l.durationLabel && (
                <li>
                  <ClockIcon size={15} />
                  {l.durationLabel}
                </li>
              )}
              {l.priceFrom ? (
                <li>
                  <TagIcon size={15} />
                  From {formatPrice(l.priceFrom, l.currency)} per person
                </li>
              ) : null}
            </ul>
            <p>{itemSummary(l)}</p>
            <Sub className="rank-sub">Why it made our list</Sub>
            <ul className="check-list">
              {itemReasons(l).map((r) => (
                <li key={r}>
                  <CheckIcon size={16} />
                  {r}
                </li>
              ))}
            </ul>
            <div className="rank-actions">
              <BookButton
                href={l.bookingUrl}
                label="Check availability"
                item={l.title}
                className="btn btn-primary"
              />
              <Link href={`/book-now/${l.slug}`} className="btn btn-outline">
                Full details
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ol>
    </>
  );
}
