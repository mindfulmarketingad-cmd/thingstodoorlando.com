import type { Post } from "./blog-types";
import { wordCount } from "./markdown";
import { post as kids } from "@/content/posts/kids";
import { post as noParks } from "@/content/posts/no-parks";
import { post as couples } from "@/content/posts/couples";
import { post as ksc } from "@/content/posts/ksc";
import { post as airboat } from "@/content/posts/airboat";
import { post as cheap } from "@/content/posts/cheap";
import { post as rainy } from "@/content/posts/rainy";
import { post as bestTime } from "@/content/posts/best-time";

export const posts: Post[] = [kids, noParks, couples, ksc, airboat, cheap, rainy, bestTime].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function readingMinutes(post: Post): number {
  return Math.max(3, Math.round(wordCount(post.body) / 220));
}

export function relatedPosts(post: Post, limit = 3): Post[] {
  const others = posts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
