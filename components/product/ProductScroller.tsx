import type { ReactNode } from "react";

interface ProductScrollerProps {
  children: ReactNode;
}

/** Edge-to-edge horizontal scroller that bleeds past the page container's padding. */
export function ProductScroller({ children }: ProductScrollerProps) {
  return (
    <div
      className="flex snap-x snap-mandatory gap-[1.1rem] overflow-x-auto pb-2"
      style={{
        marginInline: "calc(-1 * clamp(1.25rem, 4vw, 3rem))",
        paddingInline: "clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      {children}
    </div>
  );
}
