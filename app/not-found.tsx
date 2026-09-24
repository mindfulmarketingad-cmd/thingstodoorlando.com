import Link from "next/link";
import SearchForm from "@/components/SearchForm";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container-narrow center">
        <p className="eyebrow">Error 404</p>
        <h1>We could not find that page</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
          The tour may have sold out or moved. Try a search or browse our most popular experiences.
        </p>
        <div style={{ margin: "32px auto" }}>
          <SearchForm compact id="nf-search" />
        </div>
        <p>
          <Link href="/book-now" className="btn btn-primary">
            Browse all tours
          </Link>{" "}
          <Link href="/" className="btn btn-outline">
            Go home
          </Link>
        </p>
      </div>
    </section>
  );
}
