"use client";

import type { ReactNode } from "react";
import { STAY22_URL } from "@/lib/affiliates";

/** Stay22 hotel affiliate link with GA4 click tracking. */
export default function HotelLink({ children, className = "hotel-link" }: { children: ReactNode; className?: string }) {
  return (
    <a
      href={STAY22_URL}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      onClick={() => window.gtag?.("event", "hotel_affiliate_click", { link_url: STAY22_URL })}
    >
      {children}
    </a>
  );
}
