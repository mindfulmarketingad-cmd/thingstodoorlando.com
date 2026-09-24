/**
 * Tiny, safe Markdown-lite parser. Produces a typed block tree that React
 * renders as text nodes, so content can never inject HTML.
 */
export type Inline =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "link"; value: string; href: string; strong?: boolean };

export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; inline: Inline[] }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] }
  | { type: "callout"; inline: Inline[] };

const headingId = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ type: "text", value: src.slice(last, m.index) });
    if (m[1]) out.push({ type: "strong", value: m[1] });
    else {
      const bold = m[2].match(/^\*\*(.+)\*\*$/);
      out.push(bold ? { type: "link", value: bold[1], href: m[3], strong: true } : { type: "link", value: m[2], href: m[3] });
    }
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ type: "text", value: src.slice(last) });
  return out;
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.trim().split("\n");
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: Inline[][] } | null = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", inline: parseInline(para.join(" ")) });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(##|###)\s+(.*)$/))) {
      flushPara();
      flushList();
      const text = m[2];
      blocks.push({ type: m[1] === "##" ? "h2" : "h3", id: headingId(text), text });
    } else if ((m = line.match(/^[-*]\s+(.*)$/)) || (m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      const kind = /^\d+\./.test(line) ? "ol" : "ul";
      if (!list || list.type !== kind) {
        flushList();
        list = { type: kind, items: [] };
      }
      list.items.push(parseInline(m[1]));
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      blocks.push({ type: "callout", inline: parseInline(m[1]) });
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function extractLinks(src: string): string[] {
  return [...src.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

export function wordCount(src: string): number {
  return src.replace(/[#>*\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
}
