"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { MenuIcon, PhoneIcon, SearchIcon, XIcon } from "./Icons";
import { mainNav, site } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span>Questions about tours or planning your Orlando trip?</span>
          <a href={`tel:${site.phone.tel}`} className="top-bar-phone" aria-label={`Call us at ${site.phone.digits}`}>
            <PhoneIcon size={15} />
            Call {site.phone.display}
          </a>
        </div>
      </div>
      <div className="container header-inner">
        <Logo />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav id="main-nav" className="main-nav" aria-label="Main" data-open={open}>
          <ul>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={item.href === "/book-now" ? "nav-cta" : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.href === "/search" && <SearchIcon size={16} />}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
