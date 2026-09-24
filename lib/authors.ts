import { authors, DEFAULT_AUTHOR, type Author } from "@/data/authors";
import { absoluteUrl, site } from "./site";

export function getAuthor(slug?: string): Author {
  return authors.find((a) => a.slug === (slug ?? DEFAULT_AUTHOR)) ?? authors[0];
}

export function authorUrl(a: Author) {
  return `/author/${a.slug}`;
}

/** schema.org author node for BlogPosting and ProfilePage. */
export function authorSchema(a: Author) {
  return {
    "@type": a.kind,
    "@id": `${site.url}/author/${a.slug}#author`,
    name: a.name,
    url: absoluteUrl(authorUrl(a)),
    image: absoluteUrl(a.photo),
    description: a.shortBio,
    ...(a.kind === "Person" ? { jobTitle: a.role, worksFor: { "@id": `${site.url}/#organization` } } : {}),
    ...(a.social?.length ? { sameAs: a.social.map((s) => s.url) } : {}),
    knowsAbout: a.expertise,
  };
}

export { authors };
