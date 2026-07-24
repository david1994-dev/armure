import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "graphic-tees",
    name: "Graphic Tees",
    itemCount: 18,
    description: "Statement prints on the same heavyweight cotton as the rest of the line.",
    accent: "accent",
  },
  {
    slug: "plain-essentials",
    name: "Plain Essentials",
    itemCount: 12,
    description: "The tees you reach for on repeat — no logo, no print, just fit and fabric.",
    accent: "accent-2",
  },
  {
    slug: "oversized-fit",
    name: "Oversized Fit",
    itemCount: 9,
    description: "Drop-shoulder block cuts built from our heaviest 240GSM cotton.",
    accent: "ink-soft",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
