"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";

interface PageSizeSelectProps {
  value: number;
}

export function PageSizeSelect({ value }: PageSizeSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const nextSize = Number(event.target.value);

    if (nextSize === DEFAULT_PAGE_SIZE) {
      params.delete("perPage");
    } else {
      params.set("perPage", event.target.value);
    }
    // Changing the page size shifts what "page 2" even means, so start over at page 1.
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
      Show
      <select
        value={value}
        onChange={handleChange}
        className="border border-line bg-surface px-2 py-1.5 text-sm font-bold normal-case tracking-normal text-ink"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>
    </label>
  );
}
