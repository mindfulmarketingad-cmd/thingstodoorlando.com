import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import type { Crumb } from "@/lib/schema";

export default function PageHero({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children}
      </div>
    </header>
  );
}
