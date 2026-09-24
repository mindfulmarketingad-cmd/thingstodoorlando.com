import { getPost } from "./blog";
import { getLiveListings } from "./listings";
import type { ListingImage } from "./types";
import { parseMarkdown } from "./markdown";

export const TOP10_SLUG = "top-10-things-to-do-in-orlando-florida";

export interface Top10Item {
  rank: number;
  name: string;
  hint: string;
  href: string;
  image?: ListingImage;
}

/**
 * The homepage quick list is derived from the Top 10 guide itself (its
 * "at a glance" list and numbered H2 anchors), so the two never drift apart.
 */
export function getTop10(): Top10Item[] {
  const post = getPost(TOP10_SLUG);
  if (!post) return [];
  const blocks = parseMarkdown(post.body);
  const glance = blocks.find((b) => b.type === "ol");
  const anchors = blocks.filter((b) => b.type === "h2" && /^\d+\.\s/.test(b.text)) as { id: string }[];
  if (!glance || glance.type !== "ol") return [];
  return glance.items.slice(0, 10).map((inline, i) => {
    const name = inline.find((n) => n.type === "strong")?.value ?? "";
    const hint = inline
      .filter((n) => n.type === "text")
      .map((n) => n.value)
      .join("")
      .trim()
      .replace(/^for\s+/i, "");
    return {
      rank: i + 1,
      name,
      hint: hint.charAt(0).toUpperCase() + hint.slice(1),
      href: `/blog/${TOP10_SLUG}${anchors[i] ? `#${anchors[i].id}` : ""}`,
    };
  });
}

/**
 * Photo sources for the quick list, in guide order. Each item uses the photo
 * of the best-rated real Viator product for that attraction; where Viator has
 * no product for the attraction itself, the closest experience is used.
 */
const PHOTO_MATCH: RegExp[] = [
  /Walt Disney World.*(Base Ticket|Park Hopper|4-Park)/i,
  /Universal Orlando.*Tickets/i,
  /Disney Springs/i,
  /CityWalk/i,
  /^The Orlando Eye|The Wheel at ICON/i,
  /Gatorland|Gator Park|Alligator/i,
  /Lake Eola|Downtown Orlando/i,
  /Winter Park/i,
  /Discovery Cove|Snorkel/i,
  /Kennedy Space Center/i,
];

// Only the photo is used here, so official tickets Viator flags for ranking reasons still qualify.
const NOT_A_PLACE = /transfer|shuttle|airport|NASA/i;

export async function getTop10WithImages(): Promise<Top10Item[]> {
  const items = getTop10();
  const live = [...(await getLiveListings())].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  const used = new Set<string>();
  return items.map((item, i) => {
    const re = PHOTO_MATCH[i];
    const match = re && live.find((l) => re.test(l.title) && !NOT_A_PLACE.test(l.title) && l.image && !used.has(l.image.url));
    if (!match || !match.image) return item;
    used.add(match.image.url);
    return { ...item, image: { ...match.image, alt: item.name } };
  });
}
