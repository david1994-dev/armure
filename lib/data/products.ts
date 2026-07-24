import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "ridge-tee-clay",
    name: "Ridge Tee",
    colorName: "Clay",
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "Our signature weight — 220GSM combed cotton with a reinforced collar that holds its shape wash after wash.",
    swatchHex: "#8a3b22",
    colors: [
      { name: "Clay", hex: "#8a3b22" },
      { name: "Ink", hex: "#2a251e" },
      { name: "Bone", hex: "#c9bfa6" },
    ],
    badge: "low-stock",
    rating: 4.7,
    reviewCount: 214,
    stockCount: 6,
    soldLast24h: 23,
  },
  {
    slug: "fieldwork-tee-olive",
    name: "Fieldwork Tee",
    colorName: "Olive",
    price: 46,
    weightGsm: 240,
    fit: "Boxy Fit",
    description:
      "Heavier 240GSM cotton in a boxy, drop-shoulder cut for a fit that stays relaxed instead of shapeless.",
    swatchHex: "#55573c",
    colors: [
      { name: "Olive", hex: "#55573c" },
      { name: "Ink", hex: "#2a251e" },
    ],
    badge: "new",
    rating: 4.5,
    reviewCount: 58,
    soldLast24h: 31,
  },
  {
    slug: "bastion-tee-ink",
    name: "Bastion Tee",
    colorName: "Ink Black",
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "The one-tee-forever black. Piece-dyed for even, fade-resistant color and double-stitched throughout.",
    swatchHex: "#2a251e",
    colors: [
      { name: "Ink Black", hex: "#2a251e" },
      { name: "Clay", hex: "#8a3b22" },
    ],
    rating: 4.9,
    reviewCount: 341,
    soldLast24h: 19,
  },
  {
    slug: "anchor-tee-bone",
    name: "Anchor Tee",
    colorName: "Bone",
    price: 38,
    weightGsm: 200,
    fit: "Slim Fit",
    description:
      "Our lightest tee at 200GSM, cut slim for layering, in a soft off-white that won't yellow over time.",
    swatchHex: "#c9bfa6",
    colors: [
      { name: "Bone", hex: "#c9bfa6" },
      { name: "Ink", hex: "#2a251e" },
    ],
    badge: "restocked",
    rating: 4.4,
    reviewCount: 96,
  },
  {
    slug: "outpost-tee-rust",
    name: "Outpost Tee",
    colorName: "Rust",
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description:
      "Oversized block cut in a burnt rust tone, built from the same 240GSM cotton as our Fieldwork line.",
    swatchHex: "#9a4a2a",
    colors: [
      { name: "Rust", hex: "#9a4a2a" },
      { name: "Olive", hex: "#55573c" },
    ],
    rating: 4.6,
    reviewCount: 77,
  },
  {
    slug: "depot-tee-stone",
    name: "Depot Tee",
    colorName: "Stone",
    price: 42,
    weightGsm: 220,
    fit: "Oversized",
    description:
      "A quiet stone grey in our oversized block cut, with the same 220GSM weight as the Ridge Tee.",
    swatchHex: "#6c6252",
    colors: [{ name: "Stone", hex: "#6c6252" }],
    rating: 4.3,
    reviewCount: 42,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getTrendingProducts(): Product[] {
  return products.filter((product) =>
    ["ridge-tee-clay", "fieldwork-tee-olive", "bastion-tee-ink", "anchor-tee-bone", "outpost-tee-rust"].includes(
      product.slug,
    ),
  );
}

export function getBestSellers(): Product[] {
  return products.filter((product) =>
    [
      "bastion-tee-ink",
      "anchor-tee-bone",
      "ridge-tee-clay",
      "fieldwork-tee-olive",
      "depot-tee-stone",
      "outpost-tee-rust",
    ].includes(product.slug),
  );
}
