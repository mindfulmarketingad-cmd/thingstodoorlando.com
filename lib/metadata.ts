import type { Metadata } from "next";
import { site } from "./site";

/** Replaces the root layout robots (including googleBot) with noindex, follow. */
export const noindexFollow = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
} as const satisfies NonNullable<Metadata["robots"]>;

const META_MAX = 160;

function sentencesOf(text: string): string[] {
  const normalized = text
    .replace(/<[^>]*>/g, " ")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(?:\.{3})\s*$/, "")
    .trim();
  if (!normalized) return [];
  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => (/[.!?]$/.test(sentence) ? sentence : `${sentence}.`));
}

/** Shorten one over-long sentence at a clause or word boundary and end it with a period. */
function shortenToClause(sentence: string, max = META_MAX): string {
  const body = sentence.replace(/[.!?]+$/, "").trim();
  if (!body) return "";
  if (body.length + 1 <= max) return /[.!?]$/.test(sentence.trim()) ? sentence.trim() : `${body}.`;
  // Only break at a clause. Cutting the last word makes fragments like "on park."
  const window = body.slice(0, Math.max(0, max - 1));
  const clause = Math.max(window.lastIndexOf(", "), window.lastIndexOf("; "));
  if (clause < 40) return "";
  const chunk = body.slice(0, clause).replace(/[,:;–—-]+$/, "").trim();
  return chunk ? `${chunk}.` : "";
}

const CLOSER = "Compare prices, reviews and availability.";

function padShort(text: string): string {
  if (text.length >= 90) return text;
  const next = `${text} ${CLOSER}`;
  return next.length <= META_MAX ? next : text;
}

/**
 * A meta description made of complete sentences, at most 160 characters,
 * never ending in an ellipsis. `fallback` is used when the source is empty
 * or only a fragment.
 */
export function completeMetaDescription(source: string, fallback: string): string {
  const sentences = sentencesOf(source);
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length <= META_MAX) {
      out = next;
      continue;
    }
    const room = META_MAX - (out ? out.length + 1 : 0);
    const shortened = shortenToClause(sentence, room);
    if (shortened && shortened.length >= 40 && (out ? out.length + 1 : 0) + shortened.length <= META_MAX) {
      return padShort(out ? `${out} ${shortened}` : shortened);
    }
    break;
  }
  if (out.length >= 40 && out.length <= META_MAX && !/\.\.\.$/.test(out)) return padShort(out);
  const backup = sentencesOf(fallback)[0] ?? fallback.replace(/\s+/g, " ").trim();
  if (backup.length <= META_MAX && /[.!?]$/.test(backup)) return padShort(backup);
  const shortened = shortenToClause(backup.endsWith(".") ? backup : `${backup}.`);
  return padShort(shortened || `${backup.slice(0, META_MAX).replace(/[,:;–—-\s]+$/, "")}.`);
}

/** Consistent per-page metadata: canonical, Open Graph and Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
  image,
  noindex = false,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
  image?: { url: string; width?: number; height?: number; alt?: string };
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const images = image ? [image] : undefined;
  // Keep titles within ~60 characters: drop the brand suffix when it would overflow.
  const withBrand = `${title} | ${site.name}`;
  const useAbsolute = absoluteTitle || withBrand.length > 60;
  return {
    title: useAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(images ? { images } : {}),
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noindex ? { robots: noindexFollow } : {}),
  };
}
