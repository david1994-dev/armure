-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "is_best_seller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sold_last_24h" INTEGER;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "author_name" TEXT;
