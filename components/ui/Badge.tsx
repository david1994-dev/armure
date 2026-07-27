import type { ReactNode } from "react";

type Tone = "default" | "ok" | "accent" | "urgent";
type Shape = "block" | "pill";

const blockToneClasses: Record<Tone, string> = {
  default: "bg-ink text-bg",
  ok: "bg-ok text-white",
  accent: "bg-accent text-accent-ink",
  urgent: "bg-urgent text-urgent-ink",
};

/** Tinted, low-contrast fills for the softer pill shape (product card badges). */
const pillToneClasses: Record<Tone, string> = {
  default: "bg-ink/8 text-ink",
  ok: "bg-ok/15 text-ok",
  accent: "bg-accent/15 text-accent",
  urgent: "bg-urgent/15 text-urgent",
};

interface BadgeProps {
  tone?: Tone;
  shape?: Shape;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "default", shape = "block", children, className = "" }: BadgeProps) {
  const toneClasses = shape === "pill" ? pillToneClasses[tone] : blockToneClasses[tone];
  const shapeClasses = shape === "pill" ? "rounded-full px-3 py-1" : "px-2.5 py-1";

  return (
    <span
      className={`inline-block font-mono text-[0.62rem] tracking-[0.06em] uppercase ${shapeClasses} ${toneClasses} ${className}`}
    >
      {children}
    </span>
  );
}
