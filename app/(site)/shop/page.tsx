import type { Metadata } from "next";
import { ProductListingLayout } from "@/components/product/ProductListingLayout";
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

type SearchParams = Promise<{
  sort?: string;
  fit?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
}>;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Shop All Tees",
    description:
      "Browse every TeeWorld graphic tee — heavyweight 200-240GSM cotton in regular, boxy, slim, and oversized fits.",
    path: "/shop",
  });
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
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

  return (
    <ProductListingLayout
      breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      title="Shop All Tees"
      description="Every TeeWorld tee, all cut from 200–240GSM cotton and backed by our 1-year guarantee against pilling."
      items={sorted}
      totalItems={sorted.length}
      sort={sort}
      availableFits={getAvailableFits(products)}
      availableColors={getAvailableColors(products)}
    />
  );
}
