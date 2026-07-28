"use server";

import { getProductsBySlugs } from "@/lib/data/products";
import type { Product } from "@/lib/types";

/** Client components (e.g. CartView) call this to batch-resolve product data for arbitrary
 * slugs known only in the browser (localStorage cart) — one query regardless of cart size. */
export async function getProductsForSlugsAction(slugs: string[]): Promise<Product[]> {
  return getProductsBySlugs(slugs);
}
