import type { ProductColor } from "@/lib/types";

interface SwatchListProps {
  colors: ProductColor[];
  className?: string;
  size?: "sm" | "lg";
  /** Read-only dots (default) vs. clickable color picker. */
  interactive?: boolean;
  selectedName?: string;
  onSelect?: (color: ProductColor) => void;
}

export function SwatchList({
  colors,
  className = "",
  size = "sm",
  interactive = false,
  selectedName,
  onSelect,
}: SwatchListProps) {
  const dimension = size === "lg" ? "h-7 w-7" : "h-3.5 w-3.5";

  if (!interactive) {
    return (
      <span
        className={`flex gap-1.5 ${className}`}
        aria-label={`Available colors: ${colors.map((color) => color.name).join(", ")}`}
      >
        {colors.map((color) => (
          <span
            key={color.name}
            className={`${dimension} rounded-full border border-line-strong`}
            style={{ background: color.hex }}
          />
        ))}
      </span>
    );
  }

  return (
    <span className={`flex gap-2 ${className}`} role="group" aria-label="Choose a color">
      {colors.map((color) => {
        const isSelected = color.name === selectedName;
        return (
          <button
            key={color.name}
            type="button"
            aria-label={color.name}
            aria-pressed={isSelected}
            onClick={() => onSelect?.(color)}
            className={`${dimension} shrink-0 rounded-full border p-[3px] transition-transform ${
              isSelected ? "scale-110 border-ink" : "border-transparent hover:border-line-strong"
            }`}
          >
            <span
              className="block h-full w-full rounded-full border border-line-strong/60"
              style={{ background: color.hex }}
            />
          </button>
        );
      })}
    </span>
  );
}
