"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

const INITIAL_COUNT = 4;
const BATCH_SIZE = 4;

interface ProductGridProps {
  items: Product[];
}

export function ProductGrid({ items }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const listKey = items.map((item) => item.slug).join("|");

  // A new filter/sort swaps the underlying list, so start the reveal over.
  // Adjusting state during render (rather than in an effect) avoids an extra commit.
  const [prevListKey, setPrevListKey] = useState(listKey);
  if (listKey !== prevListKey) {
    setPrevListKey(listKey);
    setVisibleCount(INITIAL_COUNT);
  }

  const hasMore = visibleCount < items.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(items.length, count + BATCH_SIZE));
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <>
      <div className="mt-7 grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((product) => (
          <ProductCard key={product.slug} product={product} variant="feature" />
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="mt-10 flex justify-center py-6">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-ink-faint">Loading more styles&hellip;</span>
        </div>
      ) : (
        <p className="mt-10 text-center font-mono text-xs uppercase tracking-[0.05em] text-ink-faint">
          You&rsquo;ve reached the end &mdash; {items.length} {items.length === 1 ? "style" : "styles"} total
        </p>
      )}
    </>
  );
}
