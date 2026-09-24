import JsonLd from "./JsonLd";
import { linkHotels } from "./LinkHotels";
import { faqSchema } from "@/lib/schema";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>
            <h3 style={{ display: "inline", font: "inherit", color: "inherit", margin: 0 }}>{f.q}</h3>
          </summary>
          <div className="faq-a">
            <p>{linkHotels(f.a)}</p>
          </div>
        </details>
      ))}
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
