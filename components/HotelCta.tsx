import Link from "next/link";
import HotelLink from "./HotelLink";

/** Stay22 call to action used inside posts via the [[hotels]] marker. */
export default function HotelCta({ area }: { area?: string }) {
  return (
    <aside className="hotel-cta" aria-label="Find a hotel">
      <div>
        <strong>{area ? `Staying near ${area}?` : "Find your Orlando hotel"}</strong>
        <p>
          Compare hotel and vacation rental prices across top booking sites on one map, or see our picks for the{" "}
          <Link href="/place-to-stay">best hotels in Orlando</Link>.
        </p>
      </div>
      <HotelLink className="btn btn-primary">Check hotel prices</HotelLink>
    </aside>
  );
}
