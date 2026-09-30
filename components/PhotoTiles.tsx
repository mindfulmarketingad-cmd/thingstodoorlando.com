import type { ListingImage } from "@/lib/types";

export interface PhotoTile {
  label: string;
  sub?: string;
  href: string;
  image?: ListingImage;
}

/** Photo category tiles inside a post: [[tiles:Label|#anchor|CODE|Sub; ...]]. */
export default function PhotoTiles({ tiles }: { tiles: PhotoTile[] }) {
  return (
    <nav className="tile-grid is-compact" aria-label="Jump to a section">
      {tiles.map((t) => (
        <a key={t.href} href={t.href} className="tile">
          {t.image && <img src={t.image.url} alt={t.image.alt} width={t.image.width} height={t.image.height} loading="lazy" decoding="async" />}
          <span className="tile-body">
            <strong>{t.label}</strong>
            {t.sub && <span>{t.sub}</span>}
          </span>
        </a>
      ))}
    </nav>
  );
}
