"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  /** "inverted" is for use on dark surfaces (e.g. the Deal of the Week banner). */
  tone?: "default" | "inverted";
  className?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

const toneClasses = {
  default: { label: "text-ink-faint", box: "border-line-strong bg-bg", value: "text-ink", unit: "text-ink-faint" },
  inverted: { label: "text-bg/60", box: "border-bg/25 bg-transparent", value: "text-bg", unit: "text-bg/60" },
} as const;

export function CountdownTimer({
  targetDate,
  label,
  tone = "default",
  className = "",
  onExpire,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const tones = toneClasses[tone];

  useEffect(() => {
    function tick() {
      const next = getTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        onExpire?.();
      }
    }
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate, onExpire]);

  // Renders nothing until mount so server/client markup match — the exact
  // remaining time depends on Date.now(), which can't be computed on the server.
  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, unitLabel: "Days" },
    { value: timeLeft.hours, unitLabel: "Hrs" },
    { value: timeLeft.minutes, unitLabel: "Min" },
    { value: timeLeft.seconds, unitLabel: "Sec" },
  ];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {label ? (
        <span className={`font-mono text-[0.7rem] uppercase tracking-[0.08em] ${tones.label}`}>{label}</span>
      ) : null}
      <div className="flex gap-1.5">
        {units.map((unit) => (
          <div key={unit.unitLabel} className={`flex min-w-[2.6rem] flex-col items-center border px-2 py-1.5 ${tones.box}`}>
            <span className={`font-mono text-base font-bold tabular-nums ${tones.value}`}>{pad(unit.value)}</span>
            <span className={`font-mono text-[0.55rem] uppercase tracking-[0.06em] ${tones.unit}`}>
              {unit.unitLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
