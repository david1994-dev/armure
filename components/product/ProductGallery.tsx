"use client";

import { useState } from "react";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { TeeIcon } from "@/components/ui/TeeIcon";

interface ProductGalleryProps {
  color: string;
  className?: string;
}

type ViewId = "front" | "back" | "detail" | "flat";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "detail", label: "Collar detail" },
  { id: "flat", label: "Flat lay" },
];

function renderView(view: ViewId, color: string, className: string) {
  switch (view) {
    case "back":
      return <TeeIcon color={color} symbol="tee-shape-back" className={className} />;
    case "detail":
      return <TeeIcon color={color} viewBox="14 0 72 46" className={className} />;
    case "flat":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <span className="absolute h-[70%] w-[88%] rounded-[50%] bg-ink/10 blur-md" />
          <TeeIcon color={color} className="relative h-[92%] w-[92%] rotate-[8deg]" />
        </div>
      );
    default:
      return <TeeIcon color={color} className={className} />;
  }
}

/** Product image with a selectable front/back/detail/flat-lay thumbnail rail. */
export function ProductGallery({ color, className = "" }: ProductGalleryProps) {
  const [active, setActive] = useState<ViewId>("front");

  return (
    <div className={`flex min-w-0 flex-col-reverse gap-3 lg:flex-row lg:gap-4 ${className}`}>
      <div
        role="tablist"
        aria-label="Product views"
        className="flex min-w-0 gap-2 overflow-x-auto lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-visible"
      >
        {VIEWS.map((view) => {
          const isActive = view.id === active;
          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-label={view.label}
              aria-selected={isActive}
              onClick={() => setActive(view.id)}
              className={`flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden border bg-surface-2 p-2 transition-colors lg:w-full ${
                isActive ? "border-ink" : "border-line hover:border-line-strong"
              }`}
            >
              {renderView(view.id, color, "h-full w-full")}
            </button>
          );
        })}
      </div>

      <ProductImageZoom className="flex-1" renderImage={(imgClassName) => renderView(active, color, imgClassName)} />
    </div>
  );
}
