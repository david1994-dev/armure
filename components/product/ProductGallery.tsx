"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

/** Product photo gallery with thumbnail switching and a desktop magnifying-glass zoom on hover. */
export function ProductGallery({ images, className = "" }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className={className}>
      <ProductImageZoom
        renderImage={() => (
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      />

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2.5" role="group" aria-label="Product photos">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.src}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show photo ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden border transition-colors sm:w-20 ${
                  isActive ? "border-ink" : "border-line hover:border-line-strong"
                }`}
              >
                <Image src={image.src} alt={image.alt} fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
