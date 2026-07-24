import { CategoryCard } from "@/components/product/CategoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data/categories";

export function CategorySection() {
  return (
    <section id="shop" className="py-12 lg:py-[5.5rem]">
      <Container>
        <SectionHeader
          title="Shop by Category"
          description="Three ways to build your rotation, from statement graphics to fits you'll wear on repeat."
          action={{ label: "View all", href: "/shop" }}
        />
        <div className="grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
