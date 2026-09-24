import Link from "next/link";

export default function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="ThingsToDoOrlando.com home">
      <img src="/logo-mark.svg" alt="" width={40} height={40} />
      <span className="logo-text">
        ThingsToDo<span>Orlando</span>
        {tagline && <small>Tours, Events &amp; More</small>}
      </span>
    </Link>
  );
}
