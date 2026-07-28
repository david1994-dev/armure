"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { getProductsForSlugsAction } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

export function CartView() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [productsBySlug, setProductsBySlug] = useState<Map<string, Product>>(new Map());

  const uniqueSlugs = Array.from(new Set(items.map((item) => item.slug))).sort().join(",");

  useEffect(() => {
    if (!uniqueSlugs) return;
    // Single batched Server Action call regardless of how many items are in the cart —
    // cart slugs only exist in the browser (localStorage), so this can't be fetched server-side.
    getProductsForSlugsAction(uniqueSlugs.split(",")).then((found) => {
      setProductsBySlug(new Map(found.map((product) => [product.slug, product])));
    });
  }, [uniqueSlugs]);

  if (items.length === 0) {
    return (
      <div className="mt-9 flex flex-col items-start gap-5 border border-line bg-surface p-9 lg:mt-14">
        <p className="text-ink-soft">Your cart is empty.</p>
        <Button href="/shop" variant="primary">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-9 grid grid-cols-1 gap-9 lg:mt-14 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const product = productsBySlug.get(item.slug);
          return (
            <li key={item.key} className="flex gap-4 border border-line bg-surface p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-surface-2">
                {product ? (
                  <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="80px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {item.name} &mdash; {item.colorName}
                    </p>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.05em] text-ink-faint">
                      Size {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="whitespace-nowrap text-xs text-ink-faint hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="h-8 w-8 text-sm transition-colors hover:bg-ink hover:text-bg"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="h-8 w-8 text-sm transition-colors hover:bg-ink hover:text-bg"
                    >
                      +
                    </button>
                  </div>
                  <PriceTag amount={item.price * item.quantity} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="h-fit border border-line-strong bg-surface p-6">
        <div className="flex justify-between border-b border-line pb-4 text-sm">
          <span className="text-ink-soft">Subtotal</span>
          <PriceTag amount={totalPrice} />
        </div>
        <p className="mt-3 text-xs text-ink-faint">Shipping and taxes calculated at checkout.</p>
        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed border border-ink py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-ink opacity-40"
        >
          Checkout &mdash; coming soon
        </button>
      </div>
    </div>
  );
}
