import Link from "next/link";
import { TeeIcon } from "@/components/ui/TeeIcon";
import type { Category, CategoryAccent } from "@/lib/types";

const accentVar: Record<CategoryAccent, string> = {
  accent: "var(--accent)",
  "accent-2": "var(--accent-2)",
  "ink-soft": "var(--ink-soft)",
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="flex min-h-[280px] flex-col justify-between gap-6 border border-line bg-surface p-8 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent"
    >
      <TeeIcon color={accentVar[category.accent]} className="h-14 w-14" />
      <div>
        <h3 className="text-xl font-extrabold uppercase tracking-[0.01em]">{category.name}</h3>
        <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.05em] text-ink-faint">
          {category.itemCount} styles
        </p>
      </div>
    </Link>
  );
}
