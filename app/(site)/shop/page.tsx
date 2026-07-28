import type { Metadata } from "next";
import { ProductListingLayout } from "@/components/product/ProductListingLayout";
import { getAvailableColors, getAvailableFits, getProducts } from "@/lib/data/products";
import { parseAvailabilityParam, parsePriceParam, parseSortParam } from "@/lib/filters";
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

  const [items, availableFits, availableColors] = await Promise.all([
    getProducts(filters, sort),
    getAvailableFits(),
    getAvailableColors(),
  ]);

  return (
    <ProductListingLayout
      breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      title="Shop All Tees"
      description="Every TeeWorld tee, all cut from 200–240GSM cotton and backed by our 1-year guarantee against pilling."
      items={items}
      totalItems={items.length}
      sort={sort}
      availableFits={availableFits}
      availableColors={availableColors}
    />
  );
}
