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
      </defs>
    </svg>
  );
}

interface TeeIconProps {
  /** CSS color value for the fill; defaults to inherited `color`. */
  color?: string;
  className?: string;
}

/** Stylized tee silhouette used in place of product photography across the catalog. */
export function TeeIcon({ color, className }: TeeIconProps) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={className}
      style={color ? { color } : undefined}
      aria-hidden="true"
    >
      <use href="#tee-shape" />
    </svg>
  );
}
