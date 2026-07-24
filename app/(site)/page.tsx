import type { Metadata } from "next";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { DealOfWeekBanner } from "@/components/marketing/DealOfWeekBanner";
import { TrustBadgeStrip } from "@/components/marketing/TrustBadgeStrip";
import { SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} — Heavyweight Cotton Tees Built to Last`,
  absoluteTitle: true,
  description:
    "Shop ARMURE tees: 220GSM heavyweight cotton, reinforced seams, and a 1-year guarantee against pilling. Free US shipping over $75.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadgeStrip variant="full" />
      <CategorySection />
      <DealOfWeekBanner />
      <TrendingSection />
      <BestSellersSection />
      <TestimonialsSection />
      <BrandStorySection />
    </>
  );
}
