import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {all.map((c, i) =>
          i === all.length - 1 ? (
            <li key={c.href} aria-current="page">
              {c.name}
            </li>
          ) : (
            <li key={c.href}>
              <Link href={c.href}>{c.name}</Link>
            </li>
          ),
        )}
      </ol>
      <JsonLd data={breadcrumbSchema(all)} />
    </nav>
  );
}
