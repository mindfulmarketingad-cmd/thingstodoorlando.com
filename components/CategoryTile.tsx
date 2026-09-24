import Link from "next/link";

export default function CategoryTile({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle?: string;
  image: string;
}) {
  return (
    <Link href={href} className="tile">
      <img src={image} alt="" width={800} height={600} loading="lazy" decoding="async" />
      <span className="tile-body">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </span>
    </Link>
  );
}
