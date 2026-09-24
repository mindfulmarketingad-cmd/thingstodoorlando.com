import type { NextConfig } from "next";
import { categories } from "./lib/categories";

const isDev = process.env.NODE_ENV !== "production";

const viatorImageHosts = [
  "media.tacdn.com",
  "media-cdn.tripadvisor.com",
  "hare-media-cdn.tripadvisor.com",
  "dynamic-media-cdn.tripadvisor.com",
  "media.viator.com",
];

const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; GA loads from googletagmanager.
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${viatorImageHosts.map((h) => `https://${h}`).join(" ")} https://www.googletagmanager.com https://*.google-analytics.com`,
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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
  outputFileTracingIncludes: { "/**": ["./data/viator-products.json"] },
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
