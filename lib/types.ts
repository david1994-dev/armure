export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export type ProductBadge = "new" | "low-stock" | "restocked";

export interface Product {
  slug: string;
  name: string;
  colorName: string;
  price: number;
  weightGsm: number;
  fit: string;
  description: string;
  /** Gallery photos used across the catalog — first is the cover photo. */
  images: ProductImage[];
  colors: ProductColor[];
  badge?: ProductBadge;
  rating: number;
  reviewCount: number;
  /** Only set when badge is "low-stock" — units remaining. */
  stockCount?: number;
  /** Mock urgency counter shown on the product detail page. */
  soldLast24h?: number;
}

export interface CartItem {
  key: string;
  slug: string;
  name: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
}

export type CartItemInput = Omit<CartItem, "key" | "quantity">;

export interface User {
  username: string;
  passwordHash: string;
  joinedAt: string;
}

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface RecentPurchase {
  id: string;
  productSlug: string;
  buyerLocation: string;
  timeLabel: string;
}

export type SortOption = "best-selling" | "price-asc" | "price-desc" | "newest";

export type AvailabilityFilter = "in-stock" | "low-stock" | "new";
