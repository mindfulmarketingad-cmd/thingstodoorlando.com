import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { categories } from "@/lib/categories";
import { featuredSearches } from "@/lib/featured-searches";
import { listicles } from "@/lib/listicles";
import { authors } from "@/data/authors";
import { MONTHS } from "@/data/events";
import { getLiveListings } from "@/lib/listings";
import { getIndexableCollections } from "@/lib/collections";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const latestPost = posts.reduce((d, p) => (p.updated > d ? p.updated : d), "2026-09-24");
  const legalUpdated = new Date("2026-09-24");

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/book-now"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/place-to-stay"), lastModified: legalUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: new Date(latestPost), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/search"), lastModified: legalUpdated, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/sitemap"), lastModified: now, changeFrequency: "weekly", priority: 0.3 },
    { url: absoluteUrl("/disclaimer"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
  ];

  const searches = featuredSearches.map((f) => ({
    url: absoluteUrl(`/search/${f.slug}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const cats = categories.map((c) => ({
    url: absoluteUrl(`/book-now/${c.slug}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const authorPages = [
    { url: absoluteUrl("/author"), lastModified: legalUpdated, changeFrequency: "monthly" as const, priority: 0.4 },
    ...authors.map((a) => ({
      url: absoluteUrl(`/author/${a.slug}`),
      lastModified: legalUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  const eventPages = ["", ...MONTHS.map((m) => `/${m.toLowerCase()}`), "/halloween-in-orlando", "/christmas-in-orlando", "/this-weekend"].map(
    (p) => ({
      url: absoluteUrl(`/events${p}`),
      lastModified: now,
      changeFrequency: (p === "/this-weekend" || p === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: p === "" ? 0.9 : 0.7,
    }),
  );

  const lists = listicles.map((l) => ({
    url: absoluteUrl(`/blog/${l.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blog = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const live = (await getLiveListings()).map((l) => ({
    url: absoluteUrl(`/book-now/${l.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    ...(l.image ? { images: [l.image.url] } : {}),
  }));

  const collectionPages = (await getIndexableCollections()).map((c) => ({
    url: absoluteUrl(`/book-now/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...pages, ...cats, ...collectionPages, ...searches, ...eventPages, ...lists, ...blog, ...authorPages, ...live];
}
