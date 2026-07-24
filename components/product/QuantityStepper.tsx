interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 10, className = "" }: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label="Quantity"
      className={`inline-flex h-11 shrink-0 items-center border border-line-strong ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-10 items-center justify-center text-lg text-ink transition-colors hover:enabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30"
      >
        &minus;
      </button>
      <span className="flex h-full w-9 items-center justify-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-10 items-center justify-center text-lg text-ink transition-colors hover:enabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30"
      >
        &#43;
      </button>
    </div>
  );
}
