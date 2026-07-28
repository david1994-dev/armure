import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { AvailabilityFilter, Product, ProductBadge, ProductColor, SortOption } from "@/lib/types";

const PRODUCT_INCLUDE = {
  images: { orderBy: { position: "asc" } },
  variants: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>;

function toProduct(row: ProductWithRelations): Product {
  const colors: ProductColor[] = [];
  const seenColors = new Set<string>();
  for (const variant of row.variants) {
    if (!seenColors.has(variant.colorName)) {
      seenColors.add(variant.colorName);
      colors.push({ name: variant.colorName, hex: variant.colorHex });
    }
  }

  const badge = (row.badge as ProductBadge | null) ?? undefined;
  const stockCount =
    badge === "low-stock" ? row.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0) : undefined;

  return {
    slug: row.slug,
    name: row.name,
    colorName: colors[0]?.name ?? "",
    price: Number(row.basePrice),
    weightGsm: row.weightGsm,
    fit: row.fit,
    description: row.description,
    images: row.images.map((image) => ({ src: image.url, alt: image.altText })),
    colors,
    badge,
    rating: Number(row.rating),
    reviewCount: row.reviewCount,
    stockCount,
    soldLast24h: row.soldLast24h ?? undefined,
  };
}

export interface ProductFilters {
  fit?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityFilter;
}

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.fit) where.fit = filters.fit;
  if (filters.color) where.variants = { some: { colorName: filters.color } };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.basePrice = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.availability === "low-stock") where.badge = "low-stock";
  else if (filters.availability === "new") where.badge = "new";
  else if (filters.availability === "in-stock") where.badge = { not: "low-stock" };

  return where;
}

/**
 * "best-selling" and "newest" map onto real columns (isBestSeller, createdAt) — see prisma/seed.ts,
 * which seeds "new"-badged products with the most recent createdAt specifically so this sort works.
 */
function buildOrderBy(sort: SortOption): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price-asc") return [{ basePrice: "asc" }];
  if (sort === "price-desc") return [{ basePrice: "desc" }];
  if (sort === "newest") return [{ createdAt: "desc" }];
  return [{ isBestSeller: "desc" }, { createdAt: "asc" }];
}

/** Single query with eager-loaded images + variants (via `include`) — no per-product N+1 lookups. */
export async function getProducts(filters: ProductFilters, sort: SortOption): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: buildWhere(filters),
    orderBy: buildOrderBy(sort),
    include: PRODUCT_INCLUDE,
  });
  return rows.map(toProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: PRODUCT_INCLUDE,
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "asc" }],
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { slug }, include: PRODUCT_INCLUDE });
  return row ? toProduct(row) : undefined;
}

/** Batched lookup for a known set of slugs — one query regardless of how many slugs are passed. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: PRODUCT_INCLUDE,
  });
  return rows.map(toProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isBestSeller: true },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(currentSlug: string, take = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { slug: { not: currentSlug } },
    include: PRODUCT_INCLUDE,
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "asc" }],
    take,
  });
  return rows.map(toProduct);
}

/** Facets always reflect the full catalog, not the currently-filtered subset — matches prior in-memory behavior. */
export async function getAvailableFits(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["fit"],
    select: { fit: true },
    orderBy: { fit: "asc" },
  });
  return rows.map((row) => row.fit);
}

export async function getAvailableColors(): Promise<ProductColor[]> {
  const rows = await prisma.productVariant.findMany({
    distinct: ["colorName"],
    select: { colorName: true, colorHex: true },
    orderBy: { colorName: "asc" },
  });
  return rows.map((row) => ({ name: row.colorName, hex: row.colorHex }));
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
