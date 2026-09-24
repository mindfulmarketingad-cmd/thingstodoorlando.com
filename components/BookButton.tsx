"use client";

import type { ReactNode } from "react";
import { ExternalIcon } from "./Icons";
import { useTravelDate, withTravelDate } from "@/lib/travel-date";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Affiliate booking link. Carries the visitor's travel date to Viator,
 * tracks the click in GA4 and marks the link as sponsored.
 */
export default function BookButton({
  href,
  label,
  item,
  className = "btn btn-primary btn-lg btn-block",
  children,
}: {
  href: string;
  label: string;
  item: string;
  className?: string;
  children?: ReactNode;
}) {
  const date = useTravelDate();
  const url = withTravelDate(href, date);
  return (
    <a
      href={url}
      className={className}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() =>
        window.gtag?.("event", "affiliate_click", { item_name: item, link_url: url, travel_date: date || undefined })
      }
    >
      {children ?? label}
      <ExternalIcon size={16} />
    </a>
  );
}
