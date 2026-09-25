import Link from "next/link";

const STAY22_MAP = "https://www.stay22.com/embed/6ab56c2028c02a2c437b791e";

/** The Stay22 hotel map used on every /place-to-stay page. */
export default function StayMap({ title = "Map of Orlando hotels with live prices" }: { title?: string }) {
  return (
    <>
      <div className="stay-map">
        <iframe
          id="stay22-widget"
          title={title}
          src={STAY22_MAP}
          width="100%"
          height="428"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="stay-map-note">
        Hotel prices and availability come from our partner Stay22 and may earn us a commission at no extra cost to you.
        See our <Link href="/disclaimer">disclaimer</Link>.
      </p>
    </>
  );
}
