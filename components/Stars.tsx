import { StarIcon } from "./Icons";

export default function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const full = Math.round(rating);
  return (
    <span className="rating">
      <span className="stars" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} className={i <= full ? undefined : "empty"} />
        ))}
      </span>
      <span>
        <strong>{rating.toFixed(1)}</strong>
        {reviews ? ` (${reviews.toLocaleString("en-US")} reviews)` : ""}
      </span>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
    </span>
  );
}
