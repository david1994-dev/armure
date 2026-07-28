import { ProductCard } from "@/components/product/ProductCard";
import { ProductScroller } from "@/components/product/ProductScroller";
import { getRelatedProducts } from "@/lib/data/products";

interface CrossSellSectionProps {
  currentSlug: string;
  className?: string;
}

export async function CrossSellSection({ currentSlug, className = "" }: CrossSellSectionProps) {
  const others = await getRelatedProducts(currentSlug, 4);
  if (others.length === 0) return null;

  return (
    <div className={`mt-16 border-t border-line pt-10 lg:mt-24 ${className}`}>
      <h2 className="font-display text-[1.4rem] font-extrabold uppercase tracking-[-0.01em]">
        You Might Also Like
      </h2>
      <ProductScroller>
        {others.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            variant="compact"
            className="w-[250px] shrink-0 snap-start"
          />
        ))}
      </ProductScroller>
    </div>
  );
}
