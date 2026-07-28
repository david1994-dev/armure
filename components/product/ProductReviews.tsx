import { ReviewCard } from "@/components/product/ReviewCard";
import { StarRating } from "@/components/product/StarRating";
import { getReviewsForProduct } from "@/lib/data/reviews";
import type { Product } from "@/lib/types";

interface ProductReviewsProps {
  product: Product;
}

export async function ProductReviews({ product }: ProductReviewsProps) {
  const productReviews = await getReviewsForProduct(product.slug);

  return (
    <div className="mt-16 border-t border-line pt-10 lg:mt-24">
      <h2 className="font-display text-[1.4rem] font-extrabold uppercase tracking-[-0.01em]">Reviews</h2>
      <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" className="mt-2" />

      {productReviews.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2 lg:grid-cols-3">
          {productReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="mt-7 text-ink-soft">No reviews yet for this tee — be the first to leave one.</p>
      )}
    </div>
  );
}
