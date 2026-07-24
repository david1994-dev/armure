import Link from "next/link";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Route the listing lives at, e.g. "/shop". */
  basePath: string;
  /** Current items-per-page, so page links preserve a non-default choice. */
  pageSize?: number;
}

export function Pagination({ page, totalPages, basePath, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set("page", String(targetPage));
    if (pageSize && pageSize !== DEFAULT_PAGE_SIZE) params.set("perPage", String(pageSize));

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2 lg:mt-16">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={`flex h-10 min-w-[3.5rem] items-center justify-center border border-line px-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
          isFirst ? "pointer-events-none opacity-30" : "hover:border-ink hover:bg-ink hover:text-bg"
        }`}
      >
        Prev
      </Link>

      <ul className="flex items-center gap-2">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            <Link
              href={hrefFor(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center border text-sm font-bold tabular-nums transition-colors ${
                pageNumber === page
                  ? "border-ink bg-ink text-bg"
                  : "border-line hover:border-ink"
              }`}
            >
              {pageNumber}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={`flex h-10 min-w-[3.5rem] items-center justify-center border border-line px-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
          isLast ? "pointer-events-none opacity-30" : "hover:border-ink hover:bg-ink hover:text-bg"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
