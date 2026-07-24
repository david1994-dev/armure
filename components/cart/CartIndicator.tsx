"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartIndicator() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${totalCount} item${totalCount === 1 ? "" : "s"}`}
      className="relative flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-65"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-[1.15rem] w-[1.15rem]"
      >
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {totalCount > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[0.6rem] text-accent-ink">
          {totalCount > 9 ? "9+" : totalCount}
        </span>
      ) : null}
    </Link>
  );
}
