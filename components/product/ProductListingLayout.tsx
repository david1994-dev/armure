import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "@/components/product/ShopFilters";
import { SortSelect } from "@/components/product/SortSelect";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import type { Product, ProductColor, SortOption } from "@/lib/types";

interface Crumb {
  label: string;
  href?: string;
}

interface ProductListingLayoutProps {
  breadcrumbItems: Crumb[];
  title: string;
  description: string;
  items: Product[];
  totalItems: number;
  sort: SortOption;
  availableFits: string[];
  availableColors: ProductColor[];
}

export function ProductListingLayout({
  breadcrumbItems,
  title,
  description,
  items,
  totalItems,
  sort,
  availableFits,
  availableColors,
}: ProductListingLayoutProps) {
  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
        {title}
      </h1>
      <p className="mt-4 max-w-[54ch] text-ink-soft">{description}</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <ShopFilters availableFits={availableFits} availableColors={availableColors} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.05em] text-ink-faint">
              {totalItems} {totalItems === 1 ? "style" : "styles"}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <SortSelect value={sort} />
            </div>
          </div>

          {items.length > 0 ? (
            <ProductGrid items={items} />
          ) : (
            <p className="mt-14 border border-dashed border-line-strong py-16 text-center text-ink-soft">
              No tees match those filters. Try clearing one to see more styles.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
