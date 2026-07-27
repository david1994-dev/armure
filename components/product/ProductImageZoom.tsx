"use client";

import { useRef, useState } from "react";

interface ProductImageZoomProps {
  renderImage: (className: string) => React.ReactNode;
  className?: string;
}

const LENS_SIZE = 190;
const ZOOM = 2.2;

/** Desktop-only magnifying-glass lens that follows the cursor over the product image. */
export function ProductImageZoom({ renderImage, className = "" }: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0, width: 0, height: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLens({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
      className={`relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-surface-2 ${className}`}
    >
      {renderImage("h-full w-full")}

      {hovering ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 hidden rounded-full border border-line-strong bg-surface-2 shadow-lg lg:block"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lens.x - LENS_SIZE / 2,
            top: lens.y - LENS_SIZE / 2,
            overflow: "hidden",
          }}
        >
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: lens.width * ZOOM,
              height: lens.height * ZOOM,
              left: LENS_SIZE / 2 - lens.x * ZOOM,
              top: LENS_SIZE / 2 - lens.y * ZOOM,
            }}
          >
            {renderImage("h-full w-full")}
          </div>
        </div>
      ) : null}
    </div>
  );
}
