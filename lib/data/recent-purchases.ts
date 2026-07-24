import type { RecentPurchase } from "@/lib/types";

/** Static mock feed — no real-time order data exists behind this site yet. */
export const recentPurchases: RecentPurchase[] = [
  { id: "rp-01", productSlug: "ridge-tee-clay", buyerLocation: "Austin, TX", timeLabel: "12 minutes ago" },
  { id: "rp-02", productSlug: "bastion-tee-ink", buyerLocation: "Brooklyn, NY", timeLabel: "24 minutes ago" },
  { id: "rp-03", productSlug: "fieldwork-tee-olive", buyerLocation: "Portland, OR", timeLabel: "38 minutes ago" },
  { id: "rp-04", productSlug: "anchor-tee-bone", buyerLocation: "Denver, CO", timeLabel: "51 minutes ago" },
  { id: "rp-05", productSlug: "outpost-tee-rust", buyerLocation: "Chicago, IL", timeLabel: "1 hour ago" },
  { id: "rp-06", productSlug: "ridge-tee-clay", buyerLocation: "Nashville, TN", timeLabel: "1 hour ago" },
  { id: "rp-07", productSlug: "depot-tee-stone", buyerLocation: "Phoenix, AZ", timeLabel: "2 hours ago" },
  { id: "rp-08", productSlug: "bastion-tee-ink", buyerLocation: "Seattle, WA", timeLabel: "2 hours ago" },
];
