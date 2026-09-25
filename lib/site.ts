export const site = {
  name: "ThingsToDoOrlando.com",
  shortName: "Things To Do Orlando",
  domain: "thingstodoorlando.com",
  /** Visitor questions and inquiries. Display the vanity form; dial the digits. */
  phone: { display: "1-855-ORL-CITY", tel: "+18556752489", digits: "1-855-675-2489" },
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://thingstodoorlando.com").replace(/\/$/, ""),
  mainKeyword: "Things To Do In Orlando",
  tagline: "Tours, Events & More",
  description:
    "Find the best things to do in Orlando: theme park tickets, Kennedy Space Center trips, airboat rides, dinner shows, family tours and date nights. Compare top-rated experiences and book securely through Viator.",
  locale: "en_US",
  gaId: "G-373TLMQBV1",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/thingstodoorlando",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/thingstodoorlando",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/thingstodoorlando",
  },
  foundedYear: 2026,
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/maps", label: "Theme Park Maps" },
  { href: "/place-to-stay", label: "Hotels" },
  { href: "/book-now/today", label: "Events Today" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
  // Primary CTA sits at the far right of the header.
  { href: "/book-now", label: "Book Now" },
] as const;

export const footerNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/sitemap", label: "Sitemap" },
] as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path === "/" ? "" : path}`;
}
