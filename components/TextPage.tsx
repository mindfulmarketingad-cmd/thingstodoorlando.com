import PageHero from "./PageHero";
import Prose from "./Prose";
import { parseMarkdown } from "@/lib/markdown";

export default function TextPage({
  title,
  intro,
  path,
  crumb,
  body,
  updated,
  hotelLinks = true,
}: {
  title: string;
  intro?: string;
  path: string;
  crumb: string;
  body: string;
  updated?: string;
  hotelLinks?: boolean;
}) {
  return (
    <>
      <PageHero title={title} intro={intro} crumbs={[{ name: crumb, href: path }]} />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container container-narrow">
          {updated && (
            <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
              Last updated: <time dateTime={updated}>{new Date(`${updated}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
            </p>
          )}
          <Prose blocks={parseMarkdown(body)} hotelLinks={hotelLinks} />
        </div>
      </section>
    </>
  );
}
