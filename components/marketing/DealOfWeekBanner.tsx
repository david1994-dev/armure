import { getProductBySlug } from "@/lib/data/products";
import { DEAL_OF_WEEK, isDealActive } from "@/lib/data/deals";
import { DealOfWeekBannerClient } from "@/components/marketing/DealOfWeekBannerClient";

export async function DealOfWeekBanner() {
  const product = await getProductBySlug(DEAL_OF_WEEK.productSlug);
  if (!product) return null;

  // Deadline is hardcoded (no backend to compute it dynamically) — skip rendering entirely if
  // it's already passed, rather than showing a "00:00:00:00" banner until someone updates the date.
  if (!isDealActive()) return null;

  return <DealOfWeekBannerClient product={product} />;
}
