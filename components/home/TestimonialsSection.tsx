import { ReviewCard } from "@/components/product/ReviewCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { getFeaturedReviews } from "@/lib/data/reviews";

export async function TestimonialsSection() {
  const reviews = await getFeaturedReviews(3);
  if (reviews.length === 0) return null;

  return (
    <section className="py-12 lg:py-[5.5rem]">
      <Container>
        <SectionHeader
          title="What Wearers Say"
          description="4.7/5 average across 800+ verified orders — here's a few of the highlights."
        />
        <div className="grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
