import { prisma } from "@/lib/prisma";
import type { Review } from "@/lib/types";

function reviewDate(createdAt: Date): string {
  return createdAt.toISOString().slice(0, 10);
}

export async function getReviewsForProduct(slug: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { product: { slug } },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    productSlug: slug,
    author: row.authorName ?? row.user?.username ?? "Anonymous",
    rating: row.rating,
    title: row.title,
    body: row.body,
    date: reviewDate(row.createdAt),
    verified: row.verified,
  }));
}

export async function getFeaturedReviews(count = 3): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { rating: { gte: 5 } },
    include: { user: { select: { username: true } }, product: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
    take: count,
  });

  return rows.map((row) => ({
    id: row.id,
    productSlug: row.product.slug,
    author: row.authorName ?? row.user?.username ?? "Anonymous",
    rating: row.rating,
    title: row.title,
    body: row.body,
    date: reviewDate(row.createdAt),
    verified: row.verified,
  }));
}
