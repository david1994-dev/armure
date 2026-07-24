import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
      <div>
        <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold uppercase tracking-[-0.01em]">
          {title}
        </h2>
        {description ? <p className="mt-2 max-w-[44ch] text-ink-soft">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 whitespace-nowrap border-b border-ink pb-0.5 text-xs font-bold uppercase tracking-[0.08em] hover:border-accent hover:text-accent"
        >
          {action.label} &rarr;
        </Link>
      ) : null}
    </div>
  );
}
