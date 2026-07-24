"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { PriceTag } from "@/components/ui/PriceTag";
import { SwatchList } from "@/components/ui/SwatchList";
import { TeeIcon } from "@/components/ui/TeeIcon";
import { SIZES } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      slug: product.slug,
      name: product.name,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      price: product.price,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-9 lg:grid-cols-2 lg:gap-14">
      <div className="flex aspect-square items-center justify-center border border-line bg-surface-2">
        <TeeIcon color={selectedColor.hex} className="h-1/2 w-1/2" />
      </div>
      <div>
        <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
          {product.name} &mdash; {selectedColor.name}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.05em] text-ink-faint">
          {product.weightGsm}GSM &middot; {product.fit}
        </p>
        <PriceTag amount={product.price} className="mt-4 block text-2xl" />
        <p className="mt-5 max-w-[54ch] text-ink-soft">{product.description}</p>

        <div className="mt-7">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">
            Color &mdash; <span className="text-ink">{selectedColor.name}</span>
          </p>
          <SwatchList
            colors={product.colors}
            interactive
            size="lg"
            selectedName={selectedColor.name}
            onSelect={setSelectedColor}
          />
        </div>

        <div className="mt-7">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">
            Size {selectedSize ? <span className="text-ink">&mdash; {selectedSize}</span> : null}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a size">
            {SIZES.map((size) => {
              const isSelected = size === selectedSize;
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-11 border px-3 text-sm font-bold transition-colors ${
                    isSelected
                      ? "border-ink bg-ink text-bg"
                      : "border-line-strong text-ink hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {!selectedSize ? (
            <p className="mt-2.5 text-xs text-ink-faint">Select a size to add this tee to your cart.</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className="mt-8 w-full border border-ink py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:enabled:bg-ink hover:enabled:text-bg disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
        >
          {justAdded ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
