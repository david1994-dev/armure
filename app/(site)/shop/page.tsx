import type { Metadata } from "next";
import { ProductListingLayout } from "@/components/product/ProductListingLayout";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { products } from "@/lib/data/products";
import {
  filterProducts,
  getAvailableColors,
  getAvailableFits,
  parseAvailabilityParam,
  parsePriceParam,
  parseSortParam,
  sortProducts,
} from "@/lib/filters";
import { buildMetadata } from "@/lib/metadata";
import { paginate, parsePageParam, parsePageSizeParam } from "@/lib/pagination";

type SearchParams = Promise<{
  page?: string;
  perPage?: string;
  sort?: string;
  fit?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const pageSize = parsePageSizeParam(params.perPage, PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE);
  // Clamp to the last real page so out-of-range query params (e.g. ?page=99)
  // don't produce a misleading title/canonical for content that actually
  // renders the final page. Sort/filters are refinements, not part of the
  // canonical path.
  const { page } = paginate(products, parsePageParam(params.page), pageSize);

  return buildMetadata({
    title: page > 1 ? `Shop All Tees — Page ${page}` : "Shop All Tees",
    description:
      "Browse every ARMURE tee — heavyweight 200-240GSM cotton in regular, boxy, slim, and oversized fits.",
    path: page > 1 ? `/shop?page=${page}` : "/shop",
  });
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pageSize = parsePageSizeParam(params.perPage, PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE);
  const sort = parseSortParam(params.sort);
  const filters = {
    fit: params.fit,
    color: params.color,
    availability: parseAvailabilityParam(params.availability),
    minPrice: parsePriceParam(params.minPrice),
    maxPrice: parsePriceParam(params.maxPrice),
  };

  const filtered = filterProducts(products, filters);
  const sorted = sortProducts(filtered, sort);
  const paged = paginate(sorted, parsePageParam(params.page), pageSize);

  const extraParams: Record<string, string> = {};
  if (params.sort) extraParams.sort = params.sort;
  if (params.fit) extraParams.fit = params.fit;
  if (params.color) extraParams.color = params.color;
  if (params.minPrice) extraParams.minPrice = params.minPrice;
  if (params.maxPrice) extraParams.maxPrice = params.maxPrice;
  if (params.availability) extraParams.availability = params.availability;

  return (
    <ProductListingLayout
      breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      title="Shop All Tees"
      description="Every ARMURE tee, all cut from 200–240GSM cotton and backed by our 1-year guarantee against pilling."
      basePath="/shop"
      items={paged.items}
      totalItems={paged.totalItems}
      page={paged.page}
      totalPages={paged.totalPages}
      pageSize={pageSize}
      sort={sort}
      availableFits={getAvailableFits(products)}
      availableColors={getAvailableColors(products)}
      extraParams={extraParams}
    />
  );
}
