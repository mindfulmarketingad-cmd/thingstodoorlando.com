export function slugify(input: string, maxLength = 80): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= maxLength) return slug;
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 40 ? cut.slice(0, lastDash) : cut).replace(/-+$/g, "");
}

/** Converts a search slug back into a human readable query. */
export function unslug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

/** Strict validation for user supplied search slugs. */
export function isSafeSearchSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

/** How many leading hyphen-separated words two slugs share. */
function sharedSlugTokens(a: string, b: string): number {
  const left = a.split("-");
  const right = b.split("-");
  let i = 0;
  while (i < left.length && i < right.length && left[i] && left[i] === right[i]) i++;
  return i;
}

/**
 * When a tour is renamed, its slug changes and the old URL 404s. Return the
 * current slug only when one candidate shares a clearly longer run of leading
 * words (at least four), so unrelated tours are not redirected into each other.
 */
export function bestRenamedSlug(requested: string, candidates: readonly string[]): string | undefined {
  let best: { slug: string; score: number } | undefined;
  let second = 0;
  for (const slug of candidates) {
    if (!slug || slug === requested) continue;
    const score = sharedSlugTokens(requested, slug);
    if (!best || score > best.score) {
      second = best?.score ?? 0;
      best = { slug, score };
    } else if (score > second) {
      second = score;
    }
  }
  if (!best || best.score < 4) return undefined;
  if (best.score <= second) return undefined;
  return best.slug;
}
