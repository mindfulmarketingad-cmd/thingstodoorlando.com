import "server-only";
import { categories } from "./categories";
import { posts } from "./blog";
import type { Post } from "./blog-types";
import { getAllListings, score } from "./listings";
import { listicles } from "./listicles";
import type { Listing } from "./types";

const STOP = new Set(["the", "and", "for", "in", "of", "to", "a", "an", "with", "near", "orlando", "things", "do", "best", "top", "what", "fl", "florida"]);

export const staticPages = [
  { href: "/", title: "Things To Do In Orlando", text: "tours events attractions orlando home" },
  { href: "/book-now", title: "Book Now: All Orlando Tours & Tickets", text: "book tours tickets activities filter sort price rating" },
  { href: "/blog", title: "Orlando Travel Blog", text: "blog guides tips planning itinerary" },
  { href: "/about", title: "About ThingsToDoOrlando.com", text: "about us mission team" },
  { href: "/contact", title: "Contact Us", text: "contact email help question" },
  { href: "/disclaimer", title: "Disclaimer & Affiliate Disclosure", text: "disclaimer affiliate disclosure commission viator" },
  { href: "/privacy", title: "Privacy Policy", text: "privacy policy cookies analytics data" },
  { href: "/terms", title: "Terms of Use", text: "terms of use conditions legal" },
  { href: "/sitemap", title: "Sitemap", text: "sitemap all pages" },
  ...listicles.map((l) => ({ href: `/blog/${l.slug}`, title: l.title, text: `${l.noun} best top ranked ${l.description}` })),
];

function stem(t: string) {
  return t.length > 4 ? t.replace(/(ies|es|s)$/, (m) => (m === "ies" ? "y" : "")) : t;
}

export function tokenize(q: string): string[] {
  return [
    ...new Set(
      q
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1 && !STOP.has(t))
        .map(stem),
    ),
  ].slice(0, 8);
}

function matchScore(tokens: string[], fields: [string, number][]): number {
  let total = 0;
  let matched = 0;
  for (const t of tokens) {
    let best = 0;
    for (const [text, weight] of fields) {
      const words = text.toLowerCase().split(/[^a-z0-9]+/);
      if (words.some((w) => w === t || w.startsWith(t) || stem(w) === t)) best = Math.max(best, weight);
    }
    if (best) matched++;
    total += best;
  }
  if (!tokens.length || !matched) return 0;
  // Reward results that match every term.
  return total * (matched / tokens.length) ** 2;
}

export interface SearchResults {
  listings: Listing[];
  posts: Post[];
  pages: typeof staticPages;
  total: number;
}

export async function searchSite(query: string): Promise<SearchResults> {
  const tokens = tokenize(query);
  const listings = await getAllListings();

  const scoredListings = listings
    .map((l) => {
      const catNames = l.categories.map((k) => categories.find((c) => c.key === k)?.name ?? "").join(" ");
      const s = matchScore(tokens, [
        [l.title, 6],
        [catNames, 3],
        [`${l.summary} ${l.location}`, 2],
        [l.description, 1],
      ]);
      return { l, s: s ? s + score(l) / 5 : 0 };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.l);

  const scoredPosts = posts
    .map((p) => ({
      p,
      s: matchScore(tokens, [
        [p.title, 6],
        [`${p.category} ${p.excerpt}`, 3],
        [p.body, 1],
      ]),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  const pages = staticPages.filter((p) => matchScore(tokens, [[`${p.title} ${p.text}`, 1]]) > 0);

  return {
    listings: scoredListings,
    posts: scoredPosts,
    pages,
    total: scoredListings.length + scoredPosts.length + pages.length,
  };
}
