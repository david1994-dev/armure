import type { AvailabilityFilter, SortOption } from "@/lib/types";

const SORT_OPTIONS: readonly SortOption[] = ["best-selling", "price-asc", "price-desc", "newest"];

export function parseSortParam(sort: string | undefined): SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(sort ?? "") ? (sort as SortOption) : "best-selling";
}

const AVAILABILITY_OPTIONS: readonly AvailabilityFilter[] = ["in-stock", "low-stock", "new"];

export function parseAvailabilityParam(value: string | undefined): AvailabilityFilter | undefined {
  return (AVAILABILITY_OPTIONS as readonly string[]).includes(value ?? "") ? (value as AvailabilityFilter) : undefined;
}

export function parsePriceParam(value: string | undefined): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}
