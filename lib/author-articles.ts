import { DEFAULT_AUTHOR } from "@/data/authors";
import { posts } from "./blog";
import { listicles } from "./listicles";

export interface AuthorArticle {
  href: string;
  title: string;
  description: string;
  updated?: string;
}

/** Every blog post and best-of list credited to an author, newest first. */
export function articlesBy(slug: string): AuthorArticle[] {
  const mine = (a?: string) => (a ?? DEFAULT_AUTHOR) === slug;
  return [
    ...posts
      .filter((p) => mine(p.author))
      .map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.excerpt, updated: p.updated })),
    ...listicles
      .filter((l) => mine(l.author))
      .map((l) => ({ href: `/blog/${l.slug}`, title: l.title, description: l.description })),
  ];
}
