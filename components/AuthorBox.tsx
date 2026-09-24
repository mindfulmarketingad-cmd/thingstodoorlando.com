import Link from "next/link";
import type { Author } from "@/data/authors";
import { authorUrl } from "@/lib/authors";

export function AuthorByline({ author, children }: { author: Author; children?: React.ReactNode }) {
  return (
    <p className="byline">
      <img src={author.photo} alt="" width={36} height={36} />
      <span>
        By{" "}
        <Link href={authorUrl(author)} rel="author">
          {author.name}
        </Link>
        {children}
      </span>
    </p>
  );
}

export default function AuthorBox({ author }: { author: Author }) {
  return (
    <div className="author-box">
      <img src={author.photo} alt={author.name} width={64} height={64} />
      <div>
        <p className="author-box-name">
          <Link href={authorUrl(author)} rel="author">
            {author.name}
          </Link>
          <span>{author.role}</span>
        </p>
        <p>
          {author.shortBio} <Link href={authorUrl(author)}>More about {author.kind === "Person" ? author.name.split(" ")[0] : "us"}</Link>.
        </p>
      </div>
    </div>
  );
}
