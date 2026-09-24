"use client";

import { STAY22_URL } from "@/lib/affiliates";
import { useTravelDate } from "@/lib/travel-date";
import type { Hotel } from "@/lib/hotels";

function nextDay(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Hotel card with a "Check prices" CTA. Prices are shown by Stay22 after the click. */
export default function HotelCard({ hotel, headingLevel = 3 }: { hotel: Hotel; headingLevel?: 3 | 4 }) {
  const date = useTravelDate();
  let href = STAY22_URL;
  if (hotel.link) {
    const u = new URL(hotel.link);
    // Empty during server render; the visitor's date is added after hydration.
    if (date) {
      u.searchParams.set("checkin", date);
      u.searchParams.set("checkout", nextDay(date));
    }
    href = u.toString();
  }
  const H = `h${headingLevel}` as "h3" | "h4";
  return (
    <article className="hotel-card">
      <div className="hotel-card-media">
        <img src={hotel.image} alt={hotel.name} loading="lazy" decoding="async" width={480} height={320} />
      </div>
      <div className="hotel-card-body">
        <H>{hotel.name}</H>
        <p className="hotel-card-meta">
          {hotel.rating && (
            <span className="hotel-score">
              {hotel.rating}
              <small>/{hotel.ratingScale ?? 10}</small>
            </span>
          )}
          {hotel.reviewCount && <span>{hotel.reviewCount.toLocaleString("en-US")} reviews</span>}
          {hotel.stars && <span>{hotel.stars}-star</span>}
          {!hotel.rating && hotel.neighborhood && <span>{hotel.neighborhood}</span>}
        </p>
        <a
          href={href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="btn btn-primary hotel-card-cta"
          onClick={() => window.gtag?.("event", "hotel_affiliate_click", { link_url: href, hotel_name: hotel.name })}
        >
          Check prices
        </a>
      </div>
    </article>
  );
}
