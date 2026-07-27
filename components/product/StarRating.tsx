import { StarIcon } from "@/components/ui/MarketingIcons";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

const STAR_SIZE: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
};

export function StarRating({ rating, reviewCount, size = "sm", className = "" }: StarRatingProps) {
  const rounded = Math.round(rating);

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`}>
      <div className="flex text-accent" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} filled={index < rounded} className={STAR_SIZE[size]} />
        ))}
      </div>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {reviewCount !== undefined ? (
        <span className="font-mono text-[0.72rem] text-ink-soft">({reviewCount})</span>
      ) : null}
    </div>
  );
}
