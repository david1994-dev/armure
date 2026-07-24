import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { PageSizeSelect } from "@/components/ui/PageSizeSelect";
import { Pagination } from "@/components/ui/Pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { products } from "@/lib/data/products";
import { buildMetadata } from "@/lib/metadata";
import { paginate, parsePageParam, parsePageSizeParam } from "@/lib/pagination";

type SearchParams = Promise<{ page?: string; perPage?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const pageSize = parsePageSizeParam(params.perPage, PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE);
  // Clamp to the last real page so out-of-range query params (e.g. ?page=99)
  // don't produce a misleading title/canonical for content that actually
  // renders the final page.
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
  const paged = paginate(products, parsePageParam(params.page), pageSize);

  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
        Shop All Tees
      </h1>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-[54ch] text-ink-soft">
          {paged.totalItems} styles, all cut from 200&ndash;240GSM cotton and backed by our 1-year
          guarantee against pilling.
        </p>
        <PageSizeSelect value={pageSize} />
      </div>
      <div className="mt-9 grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {paged.items.map((product) => (
          <ProductCard key={product.slug} product={product} variant="feature" />
        ))}
      </div>
      <Pagination page={paged.page} totalPages={paged.totalPages} basePath="/shop" pageSize={pageSize} />
    </Container>
  );
}
