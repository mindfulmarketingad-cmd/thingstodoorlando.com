"use client";

import type { ReactNode } from "react";
import { ExternalIcon } from "./Icons";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Affiliate booking link. Tracks the click in GA4 and marks the link as sponsored. */
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
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => window.gtag?.("event", "affiliate_click", { item_name: item, link_url: href })}
    >
      {children ?? label}
      <ExternalIcon size={16} />
    </a>
  );
}
