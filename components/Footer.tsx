import Link from "next/link";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "./Icons";
import { footerNav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Logo />
          <nav aria-label="Footer" className="footer-nav">
            <ul>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="social" aria-label="Social media">
            <li>
              <a href={site.social.instagram} rel="noopener noreferrer me" target="_blank" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a href={site.social.twitter} rel="noopener noreferrer me" target="_blank" aria-label="X (Twitter)">
                <TwitterIcon />
              </a>
            </li>
            <li>
              <a href={site.social.facebook} rel="noopener noreferrer me" target="_blank" aria-label="Facebook">
                <FacebookIcon />
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>
            ThingsToDoOrlando.com is reader-supported. When you book through links on this site we may earn an
            affiliate commission at no extra cost to you. <Link href="/disclaimer">Learn more</Link>.
          </p>
          <p>&copy; {year} ThingsToDoOrlando.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
