import Link from "next/link";
import type { ReactNode } from "react";
import { CartIndicator } from "@/components/cart/CartIndicator";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-65"
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <Container className="relative flex items-center justify-between gap-[1.1rem] py-[0.85rem]">
        <MobileNav links={NAV_LINKS} />

        <ul className="hidden gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="border-b border-transparent pb-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-accent hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="whitespace-nowrap text-[1.15rem] font-extrabold uppercase tracking-[0.2em] lg:text-2xl lg:tracking-[0.28em]"
        >
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-1 lg:gap-4">
          <IconLink href="/search" label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[1.15rem] w-[1.15rem]">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </IconLink>
          <IconLink href="/account" label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[1.15rem] w-[1.15rem]">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6" />
            </svg>
          </IconLink>
          <CartIndicator />
        </div>
      </Container>
    </header>
  );
}
