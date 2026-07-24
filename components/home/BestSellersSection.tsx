import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getBestSellers } from "@/lib/data/products";

export function BestSellersSection() {
  const bestSellers = getBestSellers();

  return (
    <section id="new" className="py-12 lg:py-[5.5rem]">
      <Container>
        <SectionHeader
          title="Best Sellers"
          description="The six tees that make up most of our repeat orders."
          action={{ label: "Shop all tees", href: "/shop" }}
        />
        <div className="grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((product) => (
            <ProductCard key={product.slug} product={product} variant="feature" />
          ))}
        </div>
      </Container>
    </section>
  );
}
