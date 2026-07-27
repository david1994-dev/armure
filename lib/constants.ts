export const SITE_NAME = "TeeWorld";

export const SITE_URL = "https://teeworld.com";

export const SITE_DESCRIPTION =
  "Bold graphic tees on heavyweight 220GSM cotton, shipped across the United States — with custom, upload-your-own-design tees coming soon.";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "/shop" },
  { label: "The Making", href: "/#making" },
];

export const SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"] as const;

export const DEFAULT_SIZE = "M";
