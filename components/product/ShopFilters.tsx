"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import type { AvailabilityFilter, ProductColor } from "@/lib/types";

interface ShopFiltersProps {
  availableFits: string[];
  availableColors: ProductColor[];
}

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "new", label: "New Arrivals" },
];

function chipClasses(active: boolean) {
  return `border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
    active ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink hover:text-ink"
  }`;
}

export function ShopFilters({ availableFits, availableColors }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFit = searchParams.get("fit");
  const activeColor = searchParams.get("color");
  const activeAvailability = searchParams.get("availability");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const hasActiveFilters = Boolean(activeFit || activeColor || activeAvailability || minPrice || maxPrice);

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function toggle(key: string, value: string, current: string | null) {
    setParam(key, current === value ? undefined : value);
  }

  function handlePriceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const min = data.get("minPrice")?.toString().trim();
    const max = data.get("maxPrice")?.toString().trim();

    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["fit", "color", "availability", "minPrice", "maxPrice"]) {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const sections: ReactNode = (
    <div className="flex flex-col gap-7">
      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">Fit</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chipClasses(!activeFit)} onClick={() => setParam("fit", undefined)}>
            All
          </button>
          {availableFits.map((fit) => (
            <button
              key={fit}
              type="button"
              className={chipClasses(activeFit === fit)}
              onClick={() => toggle("fit", fit, activeFit)}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">Color</p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className={chipClasses(!activeColor)}
            onClick={() => setParam("color", undefined)}
          >
            All
          </button>
          {availableColors.map((color) => {
            const isActive = activeColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                aria-pressed={isActive}
                aria-label={color.name}
                onClick={() => toggle("color", color.name, activeColor)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border p-[3px] transition-transform ${
                  isActive ? "scale-110 border-ink" : "border-transparent hover:border-line-strong"
                }`}
              >
                <span
                  className="block h-full w-full rounded-full border border-line-strong/60"
                  style={{ background: color.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">Availability</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={chipClasses(!activeAvailability)}
            onClick={() => setParam("availability", undefined)}
          >
            All
          </button>
          {AVAILABILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={chipClasses(activeAvailability === option.value)}
              onClick={() => toggle("availability", option.value, activeAvailability)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-faint">Price</p>
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
          <label className="sr-only" htmlFor="minPrice">
            Minimum price
          </label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            defaultValue={minPrice}
            className="w-full min-w-0 border border-line bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint"
          />
          <span className="text-ink-faint">&ndash;</span>
          <label className="sr-only" htmlFor="maxPrice">
            Maximum price
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            defaultValue={maxPrice}
            className="w-full min-w-0 border border-line bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint"
          />
          <button
            type="submit"
            className="shrink-0 border border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Go
          </button>
        </form>
      </div>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={clearAll}
          className="self-start text-xs font-bold uppercase tracking-[0.05em] text-ink-faint underline underline-offset-2 hover:text-ink"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <aside className="hidden w-[15rem] shrink-0 lg:block">{sections}</aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="shop-filters-panel"
          className="flex w-full items-center justify-between border border-line px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink"
        >
          Filters{hasActiveFilters ? " (active)" : ""}
          <span className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`} aria-hidden="true">
            &#9660;
          </span>
        </button>
        <div
          id="shop-filters-panel"
          aria-hidden={!mobileOpen}
          className={`overflow-hidden border-x border-line transition-[max-height] duration-250 ${
            mobileOpen ? "max-h-[40rem] border-b" : "max-h-0"
          }`}
        >
          <div className="p-4">{sections}</div>
        </div>
      </div>
    </>
  );
}
