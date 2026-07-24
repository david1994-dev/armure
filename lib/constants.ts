export const SITE_NAME = "ARMURE";

export const SITE_URL = "https://armure.com";

export const SITE_DESCRIPTION =
  "Heavyweight 220GSM cotton tees built to outlast the wash. Everyday armor for your wardrobe, shipped across the United States.";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "/shop" },
  { label: "Trending", href: "/shop/trending" },
  { label: "The Making", href: "/#making" },
];

export const SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"] as const;

export const DEFAULT_SIZE = "M";

export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS = [12, 20, 40, 60] as const;
