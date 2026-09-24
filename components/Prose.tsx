import Link from "next/link";
import type { Block, Inline } from "@/lib/markdown";

function InlineNodes({ nodes, links }: { nodes: Inline[]; links?: Map<string, string> }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.type === "strong") return <strong key={i}>{n.value}</strong>;
        if (n.type === "link") {
          if (n.href.startsWith("/")) {
            return (
              <Link key={i} href={links?.get(n.href) ?? n.href}>
                {n.value}
              </Link>
            );
          }
          if (/^https:\/\//.test(n.href)) {
            return (
              <a key={i} href={n.href} rel="noopener noreferrer" target="_blank">
                {n.value}
              </a>
            );
          }
          return <span key={i}>{n.value}</span>;
        }
        return <span key={i}>{n.value}</span>;
      })}
    </>
  );
}

export default function Prose({ blocks, links }: { blocks: Block[]; links?: Map<string, string> }) {
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
                    <InlineNodes nodes={it} links={links} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <InlineNodes nodes={it} links={links} />
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <div key={i} className="callout">
                <p>
                  <InlineNodes nodes={b.inline} links={links} />
                </p>
              </div>
            );
          default:
            return (
              <p key={i}>
                <InlineNodes nodes={b.inline} links={links} />
              </p>
            );
        }
      })}
    </div>
  );
}
