interface AuthFieldProps {
  id: string;
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  minLength?: number;
}

export function AuthField({ id, label, type, value, onChange, autoComplete, minLength }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
      />
    </div>
  );
}
