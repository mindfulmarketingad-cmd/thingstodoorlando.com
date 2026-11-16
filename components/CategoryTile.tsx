import Link from "next/link";

export default function CategoryTile({
  href,
  title,
  subtitle,
  image,
  alt,
}: {
  href: string;
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
}) {
  return (
    <Link href={href} className="tile">
      <img src={image} alt={alt} width={800} height={600} loading="lazy" decoding="async" />
      <span className="tile-body">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </span>
    </Link>
  );
}
