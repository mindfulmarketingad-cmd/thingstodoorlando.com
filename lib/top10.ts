import { getPost } from "./blog";
import { parseMarkdown } from "./markdown";

export const TOP10_SLUG = "top-10-things-to-do-in-orlando-florida";

export interface Top10Item {
  rank: number;
  name: string;
  hint: string;
  href: string;
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
