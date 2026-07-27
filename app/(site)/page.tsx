import type { Metadata } from "next";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { Hero } from "@/components/home/Hero";
import { LifestyleGallerySection } from "@/components/home/LifestyleGallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { DealOfWeekBanner } from "@/components/marketing/DealOfWeekBanner";
import { TrustBadgeStrip } from "@/components/marketing/TrustBadgeStrip";
import { SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} — Graphic Tees & Custom Designs`,
  absoluteTitle: true,
  description:
    "Shop TeeWorld: bold graphic tees screen-printed on heavyweight 220GSM cotton. Custom, upload-your-own-design tees coming soon. Free US shipping over $75.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadgeStrip variant="full" />
      <LifestyleGallerySection />
      <DealOfWeekBanner />
      <BestSellersSection />
      <TestimonialsSection />
      <BrandStorySection />
    </>
  );
}
