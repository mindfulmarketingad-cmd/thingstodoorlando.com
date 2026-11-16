import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { categories } from "@/lib/categories";
import { featuredSearches } from "@/lib/featured-searches";
import { listicles } from "@/lib/listicles";
import { authors } from "@/data/authors";
import { EVENTS_UPDATED, events } from "@/data/events";
import { eventFilters } from "@/lib/events";
import { getLiveListings, snapshotDate } from "@/lib/listings";
import { getIndexableCollections } from "@/lib/collections";
import { stayGuides } from "@/data/stay-guides";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latestPost = posts.reduce((d, p) => (p.updated > d ? p.updated : d), "2026-09-24");
  const legalUpdated = new Date("2026-09-24");
  const guidesUpdated = new Date(latestPost);
  // Snapshot fetch time, not "now": lastmod that changes on every request is ignored.
  const catalogUpdated = snapshotDate() ? new Date(snapshotDate()!) : guidesUpdated;
  const freshest = catalogUpdated > guidesUpdated ? catalogUpdated : guidesUpdated;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: freshest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/book-now"), lastModified: catalogUpdated, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/start-planning"), lastModified: legalUpdated, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/book-now/today"), lastModified: catalogUpdated, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/place-to-stay"), lastModified: legalUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/maps"), lastModified: guidesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: guidesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/sitemap"), lastModified: freshest, changeFrequency: "weekly", priority: 0.3 },
    { url: absoluteUrl("/disclaimer"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.2 },
  ];

  const searches = featuredSearches.map((f) => ({
    url: absoluteUrl(`/search/${f.slug}`),
    lastModified: catalogUpdated,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const cats = categories.map((c) => ({
    url: absoluteUrl(`/book-now/${c.slug}`),
    lastModified: catalogUpdated,
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

  const eventsUpdated = new Date(`${EVENTS_UPDATED}T12:00:00Z`);
  const eventPaths = [
    "",
    "/this-weekend",
    "/halloween-in-orlando",
    "/christmas-in-orlando",
    ...["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map(
      (m) => `/${m}`,
    ),
    ...Object.keys(eventFilters).map((s) => `/${s}`),
    ...events.filter((e) => e.detail).map((e) => `/${e.slug}`),
  ];
  const eventPages = eventPaths.map((p) => ({
    url: absoluteUrl(`/events${p}`),
    lastModified: eventsUpdated,
    changeFrequency: (p === "/this-weekend" || p === "" ? "weekly" : "weekly") as "weekly",
    priority: p === "" ? 0.9 : p.split("/").length > 2 ? 0.6 : 0.7,
  }));

  const lists = listicles.map((l) => ({
    url: absoluteUrl(`/blog/${l.slug}`),
    lastModified: catalogUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blog = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Only tours in the current snapshot. Removed products are absent here, so they leave the sitemap.
  const live = (await getLiveListings())
    .filter((l) => l.slug && l.title)
    .map((l) => ({
      url: absoluteUrl(`/book-now/${l.slug}`),
      lastModified: catalogUpdated,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      ...(l.image ? { images: [l.image.url] } : {}),
    }));

  const collectionPages = (await getIndexableCollections()).map((c) => ({
    url: absoluteUrl(`/book-now/${c.slug}`),
    lastModified: catalogUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const stayPages = stayGuides.map((g) => ({
    url: absoluteUrl(`/place-to-stay/${g.slug}`),
    lastModified: legalUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const seen = new Set<string>();
  return [...pages, ...cats, ...collectionPages, ...stayPages, ...searches, ...eventPages, ...lists, ...blog, ...authorPages, ...live].filter(
    (entry) => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    },
  );
}
