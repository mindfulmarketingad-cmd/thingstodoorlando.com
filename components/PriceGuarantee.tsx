import { ShieldIcon } from "./Icons";
import { VIATOR_PRICE_GUARANTEE_URL } from "@/lib/affiliates";

/** One line near booking buttons describing Viator's Lowest Price Guarantee, with a link to its terms. */
export default function PriceGuarantee() {
  return (
    <p className="price-guarantee">
      <ShieldIcon size={15} />
      <span>
        Bookings are covered by Viator&apos;s Lowest Price Guarantee: find the same tour cheaper elsewhere and Viator
        refunds the difference.{" "}
        <a href={VIATOR_PRICE_GUARANTEE_URL} target="_blank" rel="nofollow noopener noreferrer">
          Terms
        </a>
      </span>
    </p>
  );
}
