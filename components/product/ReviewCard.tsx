import { StarRating } from "@/components/product/StarRating";
import type { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className = "" }: ReviewCardProps) {
  return (
    <article className={`flex flex-col gap-3 border border-line bg-surface p-5 ${className}`}>
      <StarRating rating={review.rating} size="sm" />
      <h3 className="font-display text-[1.05rem] font-bold uppercase tracking-[-0.01em]">{review.title}</h3>
      <p className="text-sm text-ink-soft">{review.body}</p>
      <div className="mt-auto flex items-center gap-2 pt-2 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-faint">
        <span className="font-semibold text-ink">{review.author}</span>
        {review.verified ? <span className="text-ok">Verified buyer</span> : null}
      </div>
    </article>
  );
}
