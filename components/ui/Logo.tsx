interface LogoMarkProps {
  className?: string;
}

/**
 * Tee silhouette wrapped in an orbit ring — "world" as in the ringed-planet
 * shape, "tee" as the shirt riding inside it. The ring is drawn first so the
 * shirt's fill naturally occludes the near/far seam, like Saturn's rings.
 */
export function LogoMark({ className = "h-7 w-7" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse
        cx="24"
        cy="25.5"
        rx="19.5"
        ry="7.25"
        transform="rotate(-18 24 25.5)"
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2.75"
      />
      <path
        d="M17,8 L8,15 L12,22 L15,18 L15,40 L33,40 L33,18 L36,22 L40,15 L31,8 Q24,14 17,8 Z"
        style={{ fill: "var(--ink)" }}
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function Logo({
  className = "",
  markClassName = "h-7 w-7 lg:h-8 lg:w-8",
  textClassName = "text-[1.15rem] lg:text-2xl tracking-[0.2em] lg:tracking-[0.28em]",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markClassName} />
      <span className={`whitespace-nowrap font-extrabold uppercase ${textClassName}`}>
        Tee<span style={{ color: "var(--accent)" }}>World</span>
      </span>
    </span>
  );
}
