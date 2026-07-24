import type { ReactNode } from "react";

type Tone = "default" | "ok" | "accent" | "urgent";

const toneClasses: Record<Tone, string> = {
  default: "bg-ink text-bg",
  ok: "bg-ok text-white",
  accent: "bg-accent text-accent-ink",
  urgent: "bg-urgent text-urgent-ink",
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.06em] uppercase ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
