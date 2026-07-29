"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import type { SortOption } from "@/lib/types";

interface SortSelectProps {
  value: SortOption;
}

const SORT_LABELS: Record<SortOption, string> = {
  "best-selling": "Best Selling",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

export function SortSelect({ value }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const nextSort = event.target.value as SortOption;

    if (nextSort === "best-selling") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
      Sort
      <select
        value={value}
        onChange={handleChange}
        className="border border-line bg-surface py-1.5 pl-2 pr-7 text-sm font-bold normal-case tracking-normal text-ink"
      >
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
