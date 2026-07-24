import { ProductCard } from "@/components/product/ProductCard";
import { ProductScroller } from "@/components/product/ProductScroller";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getTrendingProducts } from "@/lib/data/products";

export function TrendingSection() {
  const trending = getTrendingProducts();

  return (
    <section id="trending" className="py-12 lg:py-[5.5rem]">
      <Container>
        <SectionHeader
          title="Trending This Week"
          description="What's moving fastest across the ARMURE line right now."
          action={{ label: "Shop trending", href: "/shop/trending" }}
        />
        <ProductScroller>
          {trending.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              variant="compact"
              className="w-[250px] shrink-0 snap-start"
            />
          ))}
        </ProductScroller>
      </Container>
    </section>
  );
}
