import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { categories } from "./lib/categories";

const isDev = process.env.NODE_ENV !== "production";

const viatorImageHosts = [
  "media.tacdn.com",
  "media-cdn.tripadvisor.com",
  "hare-media-cdn.tripadvisor.com",
  "dynamic-media-cdn.tripadvisor.com",
  "media.viator.com",
];

/** Hotel photo hosts recorded by scripts/fetch-stay22.mjs. */
const hotelImageHosts: string[] = (() => {
  try {
    const hosts = JSON.parse(readFileSync(path.join(process.cwd(), "data/stay22-hotels.json"), "utf8")).imageHosts;
    return Array.isArray(hosts) ? hosts.filter((h: unknown) => typeof h === "string" && /^[a-z0-9.-]+$/i.test(h)) : [];
  } catch {
    return [];
  }
})();

const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; GA loads from googletagmanager.
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://elfsightcdn.com https://*.elfsightcdn.com https://*.elfsight.com https://scripts.stay22.com https://*.stay22.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://*.elfsight.com https://*.elfsightcdn.com https://fonts.googleapis.com",
  `img-src 'self' data: blob: ${viatorImageHosts.map((h) => `https://${h}`).join(" ")} https://www.googletagmanager.com https://*.google-analytics.com https://i.ytimg.com https://*.elfsightcdn.com https://*.elfsight.com https://*.cdninstagram.com https://*.fbcdn.net https://*.stay22.com${hotelImageHosts.map((h) => ` https://${h}`).join("")}`,
  "font-src 'self' https://*.elfsightcdn.com https://fonts.gstatic.com",
  "connect-src 'self' https://*.elfsight.com https://*.elfsightcdn.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.stay22.com",
  "frame-src https://www.youtube-nocookie.com https://www.stay22.com https://*.elfsight.com https://www.instagram.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "media-src 'self' https://*.cdninstagram.com https://*.fbcdn.net https://*.elfsightcdn.com",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The Viator snapshot is read from disk at runtime; ship it with every server function.
  outputFileTracingIncludes: { "/**": ["./data/viator-products.json", "./data/viator-availability.json", "./data/stay22-hotels.json"] },
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: viatorImageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/illustrations/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/tours", destination: "/book-now", permanent: true },
      { source: "/book", destination: "/book-now", permanent: true },
      // Food, Drink & City was split into Food & Dining and Drinks & Nightlife.
      { source: "/book-now/food-and-city", destination: "/book-now/food-and-dining", permanent: true },
      // Category landing pages moved from /search to /book-now.
      ...categories.map((c) => ({
        source: `/search/${c.legacySearchSlug}`,
        destination: `/book-now/${c.slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
