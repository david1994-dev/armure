export interface ProductColor {
  name: string;
  hex: string;
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
  /** Primary tint used to color the tee icon. */
  swatchHex: string;
  colors: ProductColor[];
  badge?: ProductBadge;
}

export type CategoryAccent = "accent" | "accent-2" | "ink-soft";

export interface Category {
  slug: string;
  name: string;
  itemCount: number;
  description: string;
  accent: CategoryAccent;
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
