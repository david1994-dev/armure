import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { products } from "@/lib/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/cart`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
