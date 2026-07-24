import { getBestSellers } from "@/lib/data/products";
import type { AvailabilityFilter, Product, ProductColor, SortOption } from "@/lib/types";

export interface ProductFilters {
  fit?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityFilter;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (filters.fit && product.fit !== filters.fit) return false;
    if (filters.color && !product.colors.some((c) => c.name === filters.color)) return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;

    if (filters.availability === "low-stock" && product.badge !== "low-stock") return false;
    if (filters.availability === "new" && product.badge !== "new") return false;
    if (filters.availability === "in-stock" && product.badge === "low-stock") return false;

    return true;
  });
}

/** "best-selling" has no real sales data behind it — falls back to the curated getBestSellers() order. */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  if (sort === "price-asc") return [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return [...products].sort((a, b) => b.price - a.price);
  if (sort === "newest") return [...products].sort((a, b) => Number(b.badge === "new") - Number(a.badge === "new"));

  const bestSellerOrder = getBestSellers().map((product) => product.slug);
  return [...products].sort((a, b) => {
    const indexA = bestSellerOrder.indexOf(a.slug);
    const indexB = bestSellerOrder.indexOf(b.slug);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function getAvailableFits(products: Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.fit)));
}

export function getAvailableColors(products: Product[]): ProductColor[] {
  const seen = new Map<string, ProductColor>();
  for (const product of products) {
    for (const color of product.colors) {
      if (!seen.has(color.name)) seen.set(color.name, color);
    }
  }
  return Array.from(seen.values());
}

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
