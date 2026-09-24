import { Fragment, type ReactNode } from "react";
import HotelLink from "./HotelLink";
import { HOTEL_RE } from "@/lib/affiliates";

/** Renders plain text with every "hotel"/"hotels" wrapped in the Stay22 affiliate link. */
export function linkHotels(text: string): ReactNode {
  const parts = text.split(HOTEL_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <HotelLink key={i}>{part}</HotelLink> : <Fragment key={i}>{part}</Fragment>,
  );
}

export default function LinkHotels({ text }: { text: string }) {
  return <>{linkHotels(text)}</>;
}
