import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical URL enforcement: lowercase paths (e.g. /Book-now -> /book-now)
 * and collapse duplicate slashes with a single permanent redirect.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalized = pathname.toLowerCase().replace(/\/{2,}/g, "/");
  if (normalized !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|illustrations/|video/|blog/[^/]+\\.jpg|hero.svg|logo|manifest.webmanifest|robots.txt|sitemap.xml).*)"],
};
