import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { EntryPopup } from "@/components/marketing/EntryPopup";
import { RecentPurchaseToast } from "@/components/marketing/RecentPurchaseToast";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <EntryPopup />
      <CookieBanner />
      <RecentPurchaseToast />
    </>
  );
}
