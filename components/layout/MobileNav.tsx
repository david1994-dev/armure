"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavLink } from "@/lib/constants";

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="order-first flex h-11 w-11 flex-col items-center justify-center gap-[0.3rem] overflow-hidden border-none bg-transparent text-ink lg:hidden"
      >
        <span
          className={`block h-[2px] w-[1.3rem] bg-current transition-transform duration-200 ${
            open ? "translate-y-[6px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-[1.3rem] bg-current transition-opacity duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-[1.3rem] bg-current transition-transform duration-200 ${
            open ? "-translate-y-[6px] -rotate-45" : ""
          }`}
        />
      </button>

      <nav
        id="mobile-nav"
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full overflow-hidden border-b bg-bg transition-[max-height,border-color] duration-250 lg:hidden ${
          open ? "max-h-80 border-line" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="flex flex-col px-[clamp(1.25rem,4vw,3rem)] pb-5 pt-2">
          {links.map((link, index) => (
            <li key={link.href} className={index < links.length - 1 ? "border-b border-line" : ""}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
