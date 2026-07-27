"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { StarRating } from "@/components/product/StarRating";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { SwatchList } from "@/components/ui/SwatchList";
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

  const pdpHref = `/shop/${product.slug}`;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[18px] bg-surface transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(42,37,30,0.14)] ${className}`}
    >
      <div
        className={`relative overflow-hidden bg-surface-2 ${
          isFeature ? "aspect-[4/3]" : "aspect-square"
        }`}
      >
        {product.badge ? (
          <Badge tone={badgeTone[product.badge]} shape="pill" className="absolute left-3 top-3 z-10">
            {badgeLabel[product.badge]}
          </Badge>
        ) : null}
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes={isFeature ? "(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw" : "250px"}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
        />

        <Link
          href={pdpHref}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0"
        />

        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.06em] text-bg shadow-[0_4px_14px_rgba(42,37,30,0.25)] transition-all duration-200 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100"
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>

      <Link href={pdpHref} className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold">
          {product.name} &mdash; {defaultColor.name}
        </h3>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.05em] text-ink-faint">
          {product.weightGsm}GSM &middot; {product.fit}
        </p>
        <div className="flex items-center justify-between gap-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <PriceTag amount={product.price} />
        </div>
        <SwatchList colors={product.colors} className="pt-0.5" />
      </Link>
    </article>
  );
}
