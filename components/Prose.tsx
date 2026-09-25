import Link from "next/link";
import type { Block, Inline } from "@/lib/markdown";
import { linkHotels } from "./LinkHotels";

function InlineNodes({ nodes, links, hotels = true }: { nodes: Inline[]; links?: Map<string, string>; hotels?: boolean }) {
  const txt = (v: string) => (hotels ? linkHotels(v) : v);
  return (
    <>
      {nodes.map((n, i) => {
        if (n.type === "strong") return <strong key={i}>{txt(n.value)}</strong>;
        if (n.type === "link") {
          const label = n.strong ? <strong>{n.value}</strong> : n.value;
          // Downloadable files skip client-side routing and open in a new tab.
          if (/^\/[\w/.-]+\.pdf$/.test(n.href)) {
            return (
              <a key={i} href={n.href} target="_blank" rel="noopener">
                {label}
              </a>
            );
          }
          if (n.href.startsWith("/")) {
            return (
              <Link key={i} href={links?.get(n.href) ?? n.href}>
                {label}
              </Link>
            );
          }
          // In-page jump to a section heading on the same page.
          if (/^#[a-z0-9-]+$/.test(n.href)) {
            return (
              <a key={i} href={n.href}>
                {label}
              </a>
            );
          }
          if (/^https:\/\//.test(n.href)) {
            return (
              <a key={i} href={n.href} rel="noopener noreferrer" target="_blank">
                {label}
              </a>
            );
          }
          return <span key={i}>{label}</span>;
        }
        return <span key={i}>{txt(n.value)}</span>;
      })}
    </>
  );
}

export default function Prose({
  blocks,
  links,
  hotelLinks = true,
}: {
  blocks: Block[];
  links?: Map<string, string>;
  /** Link "hotel"/"hotels" to the Stay22 affiliate URL. Off for legal pages. */
  hotelLinks?: boolean;
}) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id}>
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <InlineNodes nodes={it} links={links} hotels={hotelLinks} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <InlineNodes nodes={it} links={links} hotels={hotelLinks} />
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} scope="col">
                          <InlineNodes nodes={c} links={links} hotels={hotelLinks} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>
                            <InlineNodes nodes={c} links={links} hotels={hotelLinks} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <div key={i} className="callout">
                <p>
                  <InlineNodes nodes={b.inline} links={links} hotels={hotelLinks} />
                </p>
              </div>
            );
          default:
            return (
              <p key={i}>
                <InlineNodes nodes={b.inline} links={links} hotels={hotelLinks} />
              </p>
            );
        }
      })}
    </div>
  );
}
