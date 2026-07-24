"use client";

import { useEffect, useState, type RefObject } from "react";
import { PriceTag } from "@/components/ui/PriceTag";
import type { Product, ProductColor } from "@/lib/types";

interface StickyAddToCartBarProps {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string | null;
  quantity: number;
  justAdded: boolean;
  onAddToCart: () => void;
  /** Ref to the real Add to Cart button — doubles as the IntersectionObserver sentinel. */
  targetRef: RefObject<HTMLElement | null>;
}

export function StickyAddToCartBar({
  product,
  selectedColor,
  selectedSize,
  quantity,
  justAdded,
  onAddToCart,
  targetRef,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {product.name} &mdash; {selectedColor.name}
          </p>
          <PriceTag amount={product.price} className="text-sm" />
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!selectedSize}
          className="shrink-0 border border-ink bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? "Added ✓" : selectedSize ? `Add to Cart${quantity > 1 ? ` (${quantity})` : ""}` : "Select Size"}
        </button>
      </div>
    </div>
  );
}
