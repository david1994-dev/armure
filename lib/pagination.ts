export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

/** Slices `items` for `page` (1-indexed), clamping out-of-range pages instead of erroring. */
export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: currentPage,
    totalPages,
    totalItems,
  };
}

export function parsePageParam(page: string | undefined): number {
  const parsed = Number(page);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 1;
}

/** Only accepts one of `allowedSizes` — falls back otherwise so the URL can't force an arbitrarily large page. */
export function parsePageSizeParam(
  size: string | undefined,
  allowedSizes: readonly number[],
  fallback: number,
): number {
  const parsed = Number(size);
  return allowedSizes.includes(parsed) ? parsed : fallback;
}
