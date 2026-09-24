import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { CheckIcon } from "@/components/Icons";
import { authors, authorSchema, authorUrl } from "@/lib/authors";
import { articlesBy } from "@/lib/author-articles";
import { formatDate } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = authors.find((x) => x.slug === slug);
  if (!a) return {};
  return pageMetadata({
    title: `${a.name}: Orlando Travel Writer`.replace("Team: Orlando Travel Writer", "Team"),
    description: a.shortBio,
    path: authorUrl(a),
    image: { url: a.photo, alt: a.name },
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const a = authors.find((x) => x.slug === slug);
  if (!a) notFound();
  const articles = articlesBy(a.slug);

  return (
    <>
      <PageHero
        title={a.name}
        intro={a.role}
        crumbs={[
          { name: "Authors", href: "/author" },
          { name: a.name, href: authorUrl(a) },
        ]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container two-col">
          <div>
            <div className="author-profile">
              <img src={a.photo} alt={a.name} width={120} height={120} />
              <div className="prose">
                {a.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>

            <h2 style={{ marginTop: 40 }}>Articles by {a.name}</h2>
            <ul className="result-list">
              {articles.map((x) => (
                <li key={x.href}>
                  <Link href={x.href}>
                    <strong>{x.title}</strong>
                    <span>
                      {x.description}
                      {x.updated ? ` Updated ${formatDate(x.updated)}.` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <aside className="info-box">
            <h2>Areas of expertise</h2>
            <ul className="check-list">
              {a.expertise.map((e) => (
                <li key={e}>
                  <CheckIcon size={16} />
                  {e}
                </li>
              ))}
            </ul>
            {a.location && (
              <p>
                <strong>Based in:</strong> {a.location}
              </p>
            )}
            {a.social?.length ? (
              <p>
                <strong>Find {a.kind === "Person" ? a.name.split(" ")[0] : "us"} on:</strong>{" "}
                {a.social.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ", "}
                    <a href={s.url} rel="me noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
            <p style={{ margin: 0 }}>
              Read how we research and rank experiences on our <Link href="/about">About page</Link>.
            </p>
          </aside>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl(authorUrl(a)),
          mainEntity: authorSchema(a),
        }}
      />
    </>
  );
}
