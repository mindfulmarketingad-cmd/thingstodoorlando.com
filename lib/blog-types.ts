import type { IllustrationKey } from "./types";

export interface Post {
  slug: string;
  title: string;
  /** Meta description, 140 to 160 characters. */
  description: string;
  excerpt: string;
  published: string;
  updated: string;
  category: string;
  illustration: IllustrationKey;
  /** Markdown-lite body: ##, ###, -, 1., >, **bold**, [text](href). */
  body: string;
  /** Guide or listing slugs to feature at the end of the post. */
  featuredListings: string[];
  /** Author slug from data/authors.ts; defaults to DEFAULT_AUTHOR. */
  author?: string;
}
