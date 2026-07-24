import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_NAME } from "@/lib/constants";
import { NewsletterForm } from "./NewsletterForm";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop" },
      { label: "Best Sellers", href: "/#new" },
      { label: "Trending", href: "/shop/trending" },
      { label: "Gift Cards", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "The Making", href: "/#making" },
      { label: "About Us", href: "/#making" },
      { label: "Sustainability", href: "/#making" },
      { label: "Careers", href: "/#making" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/cart" },
      { label: "Size Guide", href: "/shop" },
      { label: "Track Order", href: "/cart" },
      { label: "Contact", href: "/cart" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="pb-8 pt-12 lg:pb-9 lg:pt-[5.5rem]">
      <Container>
        <div className="grid grid-cols-1 gap-9 border-b border-line pb-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.9fr)] lg:gap-14 lg:pb-14">
          <div>
            <Link href="/" className="text-[1.3rem] font-extrabold uppercase tracking-[0.2em]">
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-[32ch] text-sm text-ink-soft">
              Everyday armor for your wardrobe. Heavyweight cotton tees, designed and stocked for the US.
            </p>
            <NewsletterForm />
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-[1.1rem] text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 lg:pt-8">
          <p className="text-[0.78rem] text-ink-faint">&copy; 2026 ARMURE. Shipping across the United States.</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/" className="text-[0.78rem] text-ink-faint hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/" className="text-[0.78rem] text-ink-faint hover:text-ink">
                Terms
              </Link>
            </li>
          </ul>
          <div className="flex gap-3.5">
            <Link href="/" aria-label="Instagram" className="h-6 w-6 text-ink-soft hover:text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </Link>
            <Link href="/" aria-label="TikTok" className="h-6 w-6 text-ink-soft hover:text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3v11a3.5 3.5 0 1 1-3-3.46V7" />
                <path d="M15 3c.5 2.5 2 4 5 4" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
