"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { StarRating } from "@/components/product/StarRating";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { SwatchList } from "@/components/ui/SwatchList";
import { TeeIcon } from "@/components/ui/TeeIcon";
import { DEFAULT_SIZE } from "@/lib/constants";
import type { Product, ProductBadge } from "@/lib/types";

const badgeLabel: Record<ProductBadge, string> = {
  new: "New",
  "low-stock": "Low stock",
  restocked: "Back in stock",
};

const badgeTone: Record<ProductBadge, "default" | "ok" | "urgent"> = {
  new: "default",
  "low-stock": "urgent",
  restocked: "ok",
};

interface ProductCardProps {
  product: Product;
  /** "compact" (square media, used in horizontal scrollers) or "feature" (4:3 media, used in grids). */
  variant?: "compact" | "feature";
  className?: string;
}

export function ProductCard({ product, variant = "compact", className = "" }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isFeature = variant === "feature";
  const defaultColor = product.colors[0];

  function handleAddToCart() {
    addItem({
      slug: product.slug,
      name: product.name,
      colorName: defaultColor.name,
      colorHex: defaultColor.hex,
      size: DEFAULT_SIZE,
      price: product.price,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <article className={`flex flex-col border border-line bg-surface ${className}`}>
      <Link href={`/shop/${product.slug}`} className="group flex flex-1 flex-col">
        <div
          className={`relative flex items-center justify-center overflow-hidden bg-surface-2 ${
            isFeature ? "aspect-[4/3]" : "aspect-square"
          }`}
        >
          {product.badge ? (
            <Badge tone={badgeTone[product.badge]} className="absolute left-2.5 top-2.5">
              {badgeLabel[product.badge]}
            </Badge>
          ) : null}
          <TeeIcon
            color={defaultColor.hex}
            className={`transition-transform duration-300 ease-out group-hover:scale-[1.08] ${
              isFeature ? "h-[44%] w-[44%]" : "h-1/2 w-1/2"
            }`}
          />
        </div>
        <div className="flex flex-col gap-2 p-4 pb-0">
          <h3 className="text-sm font-bold">
            {product.name} &mdash; {defaultColor.name}
          </h3>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.05em] text-ink-faint">
            {product.weightGsm}GSM &middot; {product.fit}
          </p>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <PriceTag amount={product.price} />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <SwatchList colors={product.colors} />
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mx-4 mb-4 mt-3 border border-ink py-2.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-bg"
      >
        {justAdded ? "Added ✓" : "Add to Cart"}
      </button>
    </article>
  );
}
