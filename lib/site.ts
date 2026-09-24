export const site = {
  name: "ThingsToDoOrlando.com",
  shortName: "Things To Do Orlando",
  domain: "thingstodoorlando.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://thingstodoorlando.com").replace(/\/$/, ""),
  mainKeyword: "Things To Do In Orlando",
  tagline: "Tours, Events & More",
  description:
    "Find the best things to do in Orlando: theme park tickets, Kennedy Space Center trips, airboat rides, dinner shows, family tours and date nights. Compare top-rated experiences and book securely through Viator.",
  locale: "en_US",
  gaId: "G-FPWVKSZCLY",
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
  { href: "/book-now", label: "Book Now" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
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
  return `${site.url}${path === "/" ? "" : path}`;
}
