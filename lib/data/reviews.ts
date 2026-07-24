import type { Review } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "rev-01",
    productSlug: "ridge-tee-clay",
    author: "Marcus T.",
    rating: 5,
    title: "Holds up after a year of washes",
    body: "Bought this for work and it still looks new after weekly washes. The collar hasn't stretched out at all.",
    date: "2026-05-12",
    verified: true,
  },
  {
    id: "rev-02",
    productSlug: "ridge-tee-clay",
    author: "Dana R.",
    rating: 4,
    title: "Great weight, runs slightly large",
    body: "Fabric feels substantial without being stiff. I'd size down if you like a closer fit.",
    date: "2026-04-02",
    verified: true,
  },
  {
    id: "rev-03",
    productSlug: "fieldwork-tee-olive",
    author: "Priya K.",
    rating: 5,
    title: "The boxy cut is perfect",
    body: "Exactly the relaxed silhouette I wanted. Olive color is richer in person than photos.",
    date: "2026-06-01",
    verified: true,
  },
  {
    id: "rev-04",
    productSlug: "fieldwork-tee-olive",
    author: "Sam O.",
    rating: 4,
    title: "Heavy and warm",
    body: "Definitely on the heavier side — great for cooler months, might be too much for summer.",
    date: "2026-05-20",
    verified: false,
  },
  {
    id: "rev-05",
    productSlug: "bastion-tee-ink",
    author: "Elena V.",
    rating: 5,
    title: "My third one — no fading",
    body: "This is my third Bastion Tee. Unlike other black tees I've owned, this one hasn't gone grey in the wash.",
    date: "2026-03-18",
    verified: true,
  },
  {
    id: "rev-06",
    productSlug: "bastion-tee-ink",
    author: "Chris N.",
    rating: 5,
    title: "The only black tee I need",
    body: "Double stitching is obvious quality. Fits true to size and the black is genuinely deep black.",
    date: "2026-06-14",
    verified: true,
  },
  {
    id: "rev-07",
    productSlug: "anchor-tee-bone",
    author: "Jules F.",
    rating: 4,
    title: "Great layering piece",
    body: "Lightweight enough to layer under a jacket without adding bulk. Bone color stayed clean-looking.",
    date: "2026-04-28",
    verified: true,
  },
  {
    id: "rev-08",
    productSlug: "outpost-tee-rust",
    author: "Theo B.",
    rating: 5,
    title: "Oversized done right",
    body: "Boxy without looking sloppy. The rust colorway is unique — get compliments every time I wear it.",
    date: "2026-05-30",
    verified: true,
  },
  {
    id: "rev-09",
    productSlug: "depot-tee-stone",
    author: "Nadia P.",
    rating: 4,
    title: "Solid everyday grey",
    body: "Good weight, neutral color goes with everything. Wish it came in more colorways.",
    date: "2026-06-08",
    verified: false,
  },
];

export function getReviewsForProduct(slug: string): Review[] {
  return reviews.filter((review) => review.productSlug === slug);
}

export function getFeaturedReviews(count = 3): Review[] {
  return reviews.filter((review) => review.rating >= 5).slice(0, count);
}
