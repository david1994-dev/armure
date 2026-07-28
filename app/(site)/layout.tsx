import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { EntryPopup } from "@/components/marketing/EntryPopup";
import { RecentPurchaseToast } from "@/components/marketing/RecentPurchaseToast";
import { getProductsBySlugs } from "@/lib/data/products";
import { recentPurchases } from "@/lib/data/recent-purchases";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const recentPurchaseSlugs = Array.from(new Set(recentPurchases.map((purchase) => purchase.productSlug)));
  const recentPurchaseProducts = await getProductsBySlugs(recentPurchaseSlugs);

  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <EntryPopup />
      <CookieBanner />
      <RecentPurchaseToast products={recentPurchaseProducts} />
    </>
  );
}
