/**
 * Curated search landing pages (categories live at /book-now/[category]). These are the only /search/[query] URLs that
 * are indexable and listed in the sitemap; every other query is noindex so
 * user searches can never create thin or duplicate pages.
 */
export interface FeaturedSearch {
  slug: string;
  query: string;
  title: string;
  intro: string;
}

export const featuredSearches: FeaturedSearch[] = [
  {
    slug: "disney-world",
    query: "disney",
    title: "Walt Disney World Tickets & Tours",
    intro:
      "Plan your Walt Disney World visit with tickets, guided park days and transportation options. Compare prices by date and read the fine print on park reservations before you book.",
  },
  {
    slug: "universal-orlando",
    query: "universal",
    title: "Universal Orlando Tickets & Tours",
    intro:
      "Compare Universal Orlando Resort tickets for Universal Studios Florida, Islands of Adventure, Epic Universe and Volcano Bay, including park-to-park and express options.",
  },
  {
    slug: "manatees",
    query: "manatee",
    title: "Manatee Tours Near Orlando",
    intro:
      "Every winter, manatees gather in Florida's warm springs. Compare boardwalk viewing trips, kayak tours and guided swims at Blue Spring and Crystal River.",
  },
  {
    slug: "international-drive",
    query: "international drive icon park",
    title: "Things To Do on International Drive",
    intro:
      "International Drive is Orlando's entertainment corridor. Compare observation wheel rides, dinner shows, helicopter flights and attractions within walking distance of many hotels.",
  },
];

export const featuredSearchBySlug = new Map(featuredSearches.map((f) => [f.slug, f]));
