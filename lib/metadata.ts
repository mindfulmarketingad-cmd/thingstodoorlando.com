import type { Metadata } from "next";
import { site } from "./site";

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
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
