export function TeeIconDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id="tee-shape" viewBox="0 0 100 110">
          <path
            fill="currentColor"
            d="M30 6 L42 6 Q50 15 58 6 L70 6 L94 24 L80 40 L72 32 L72 104 L28 104 L28 32 L20 40 L6 24 Z"
          />
          <path
            d="M39 8 Q50 18 61 8"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="2"
            opacity="0.5"
          />
          <path
            d="M32 34 L32 100"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.35"
          />
        </symbol>
        <symbol id="tee-shape-back" viewBox="0 0 100 110">
          <path
            fill="currentColor"
            d="M30 6 L42 6 Q50 15 58 6 L70 6 L94 24 L80 40 L72 32 L72 104 L28 104 L28 32 L20 40 L6 24 Z"
          />
          <path
            d="M37 8 Q50 13 63 8"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="2"
            opacity="0.35"
          />
          <path
            d="M28 36 L72 36"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.3"
          />
        </symbol>
      </defs>
    </svg>
  );
}

interface TeeIconProps {
  /** CSS color value for the fill; defaults to inherited `color`. */
  color?: string;
  className?: string;
  /** Which defined symbol to render — lets a single icon set stand in for front/back views. */
  symbol?: "tee-shape" | "tee-shape-back";
  /** Override viewBox to crop into a region of the symbol (e.g. a collar close-up). */
  viewBox?: string;
}

/** Stylized tee silhouette used in place of product photography across the catalog. */
export function TeeIcon({ color, className, symbol = "tee-shape", viewBox = "0 0 100 110" }: TeeIconProps) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={color ? { color } : undefined}
      aria-hidden="true"
    >
      <use href={`#${symbol}`} />
    </svg>
  );
}
