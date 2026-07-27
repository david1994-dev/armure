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
    images: [
      {
        src: "https://images.unsplash.com/photo-1612889002697-ac0a7fa8fde4?w=1200&auto=format&fit=crop&q=80",
        alt: "Clay orange tee folded on top of a jacket",
      },
      {
        src: "https://images.unsplash.com/photo-1654431989477-a73e2136e778?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the clay tee's collar and shoulder seam",
      },
      {
        src: "https://images.unsplash.com/photo-1625758478428-7dd9cf61f16b?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the clay tee outdoors against a rock wall",
      },
    ],
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
    images: [
      {
        src: "https://images.unsplash.com/photo-1731283603113-d77215fd58bf?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing an olive green oversized tee outdoors",
      },
      {
        src: "https://images.unsplash.com/photo-1731283603328-7e87738ae331?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the olive tee with arms crossed",
      },
      {
        src: "https://images.unsplash.com/photo-1731283603405-aae54cc3b086?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the olive tee, hand resting on belt",
      },
    ],
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
    images: [
      {
        src: "https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=1200&auto=format&fit=crop&q=80",
        alt: "Ink black tee hanging among other black tees",
      },
      {
        src: "https://images.unsplash.com/photo-1666358777322-a25eda95848f?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the ink black tee, front view",
      },
      {
        src: "https://images.unsplash.com/photo-1726140872004-850c80900ae3?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the ink black tee on a city street",
      },
    ],
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
    images: [
      {
        src: "https://images.unsplash.com/photo-1666358085449-a10a39f33942?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing a bone colored tee against a plain studio wall",
      },
      {
        src: "https://images.unsplash.com/photo-1666358084687-14347fbf364c?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the bone tee's shoulder and torso",
      },
      {
        src: "https://images.unsplash.com/photo-1666358059751-3accf39c2d95?w=1200&auto=format&fit=crop&q=80",
        alt: "Bone tee laid flat against a plain background",
      },
    ],
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
    images: [
      {
        src: "https://images.unsplash.com/photo-1637905310030-aa7acb6769f5?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing a rust orange tee outdoors in autumn",
      },
      {
        src: "https://images.unsplash.com/photo-1734313811847-ba5ee0008483?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the rust tee beside a chain-link fence",
      },
      {
        src: "https://images.unsplash.com/photo-1705944910791-887c4ed535c8?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the rust tee against a rolldown shutter",
      },
    ],
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
    images: [
      {
        src: "https://images.unsplash.com/photo-1656353996256-96cc54a1e73e?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing a stone colored tee",
      },
      {
        src: "https://images.unsplash.com/photo-1750767303644-5908f369147b?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the stone tee, arms crossed against a wall",
      },
      {
        src: "https://images.unsplash.com/photo-1780565336406-2b5112709aef?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the stone tee's fabric and collar",
      },
    ],
    colors: [{ name: "Stone", hex: "#6c6252" }],
    rating: 4.3,
    reviewCount: 42,
  },
  {
    slug: "harbor-tee-slate",
    name: "Harbor Tee",
    colorName: "Slate",
    price: 44,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "A cool slate grey in our regular cut — 220GSM cotton with the same reinforced collar as the Ridge Tee.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1677709678785-bbe8227262cf?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing a slate blue-grey tee against a grey wall",
      },
      {
        src: "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the slate tee, hand in hair",
      },
      {
        src: "https://images.unsplash.com/photo-1697425602546-326e1163ee8f?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the slate tee outdoors",
      },
    ],
    colors: [
      { name: "Slate", hex: "#4d5560" },
      { name: "Ink", hex: "#2a251e" },
    ],
    rating: 4.5,
    reviewCount: 63,
  },
  {
    slug: "summit-tee-forest",
    name: "Summit Tee",
    colorName: "Forest",
    price: 40,
    weightGsm: 200,
    fit: "Slim Fit",
    description:
      "Our lightest 200GSM cotton, slim-cut and dyed a deep forest green that won't fade under repeated washing.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1706550633351-293b55daccf4?w=1200&auto=format&fit=crop&q=80",
        alt: "Forest green tee hanging outdoors on a street sign",
      },
      {
        src: "https://images.unsplash.com/photo-1748381386717-2b8e243bf0d0?w=1200&auto=format&fit=crop&q=80",
        alt: "Model walking through a forest wearing the forest green tee, back view",
      },
      {
        src: "https://images.unsplash.com/photo-1782329632775-fcc72780dacb?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of a model wearing the forest green tee",
      },
    ],
    colors: [
      { name: "Forest", hex: "#2f3b28" },
      { name: "Bone", hex: "#c9bfa6" },
    ],
    rating: 4.6,
    reviewCount: 51,
    soldLast24h: 12,
  },
  {
    slug: "drift-tee-sand",
    name: "Drift Tee",
    colorName: "Sand",
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description:
      "A sun-bleached sand tone in our heaviest 240GSM cotton, cut oversized with a dropped shoulder seam.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1716951918731-77d7682b4e63?w=1200&auto=format&fit=crop&q=80",
        alt: "Stack of folded tees including a sand colored one",
      },
      {
        src: "https://images.unsplash.com/photo-1666358086199-975d5538947c?w=1200&auto=format&fit=crop&q=80",
        alt: "Back view of a model wearing the sand tee",
      },
      {
        src: "https://images.unsplash.com/photo-1666358777417-fa9e86eb5ba3?w=1200&auto=format&fit=crop&q=80",
        alt: "Model seated wearing the sand tee",
      },
    ],
    colors: [
      { name: "Sand", hex: "#c7b48a" },
      { name: "Rust", hex: "#9a4a2a" },
    ],
    badge: "new",
    rating: 4.4,
    reviewCount: 19,
    soldLast24h: 27,
  },
  {
    slug: "vantage-tee-charcoal",
    name: "Vantage Tee",
    colorName: "Charcoal",
    price: 44,
    weightGsm: 220,
    fit: "Boxy Fit",
    description:
      "A deep charcoal boxy tee in 220GSM cotton, piece-dyed for even color that won't streak in the wash.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1657364890995-1ec4bb3aefcf?w=1200&auto=format&fit=crop&q=80",
        alt: "Folded charcoal grey tee on a plain surface",
      },
      {
        src: "https://images.unsplash.com/photo-1665661322980-150a6163ab6f?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the charcoal tee's collar and fabric",
      },
      {
        src: "https://images.unsplash.com/photo-1674736384543-9842d8ac7484?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the charcoal tee, side profile",
      },
    ],
    colors: [
      { name: "Charcoal", hex: "#3a372f" },
      { name: "Olive", hex: "#55573c" },
    ],
    badge: "low-stock",
    rating: 4.8,
    reviewCount: 88,
    stockCount: 4,
    soldLast24h: 15,
  },
  {
    slug: "relic-tee-moss",
    name: "Relic Tee",
    colorName: "Moss",
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "A muted moss green in our regular cut, built from the same 220GSM combed cotton as the Ridge Tee.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1667640735309-a3406409338f?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing a moss green tee outdoors",
      },
      {
        src: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200&auto=format&fit=crop&q=80",
        alt: "Row of moss green tees hanging",
      },
      {
        src: "https://images.unsplash.com/photo-1696572783012-498f63eb341c?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up portrait of a model wearing the moss tee",
      },
    ],
    colors: [
      { name: "Moss", hex: "#6b7351" },
      { name: "Bone", hex: "#c9bfa6" },
    ],
    rating: 4.5,
    reviewCount: 37,
  },
  {
    slug: "cinder-tee-blackwash",
    name: "Cinder Tee",
    colorName: "Black Wash",
    price: 40,
    weightGsm: 200,
    fit: "Slim Fit",
    description:
      "A garment-washed black in our lightest 200GSM cotton, slim-cut with a slightly faded, worn-in look.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1654570407658-dc06d6ae45c2?w=1200&auto=format&fit=crop&q=80",
        alt: "Black wash tee laid flat on a plain surface",
      },
      {
        src: "https://images.unsplash.com/photo-1618453292471-4d5d75d0e2dd?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the black wash tee's collar tag",
      },
      {
        src: "https://images.unsplash.com/photo-1628259748819-9bc7c7417fbb?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the black wash tee outdoors",
      },
    ],
    colors: [{ name: "Black Wash", hex: "#3d3a36" }],
    badge: "restocked",
    rating: 4.3,
    reviewCount: 29,
  },
  {
    slug: "timber-tee-umber",
    name: "Timber Tee",
    colorName: "Umber",
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description:
      "A rich umber brown in our heaviest 240GSM cotton, cut oversized for a boxy, worn-in silhouette.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1616523806653-5835da64ff68?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing an umber brown tee",
      },
      {
        src: "https://images.unsplash.com/photo-1753256373476-bd6367dd7b19?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up portrait of a model wearing the umber tee",
      },
      {
        src: "https://images.unsplash.com/photo-1654463313126-be90d0eac796?w=1200&auto=format&fit=crop&q=80",
        alt: "Side view of a model wearing the umber tee",
      },
    ],
    colors: [
      { name: "Umber", hex: "#5a3a26" },
      { name: "Stone", hex: "#6c6252" },
    ],
    rating: 4.7,
    reviewCount: 46,
  },
  {
    slug: "basecamp-tee-khaki",
    name: "Basecamp Tee",
    colorName: "Khaki",
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "A workwear-inspired khaki in our regular cut, 220GSM cotton with the same durable double-stitching throughout.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1643188557711-5b650712512e?w=1200&auto=format&fit=crop&q=80",
        alt: "Khaki tee folded next to a mustard tee on a drying line",
      },
      {
        src: "https://images.unsplash.com/photo-1781106476595-ac88cc3695f2?w=1200&auto=format&fit=crop&q=80",
        alt: "Model wearing the khaki tee outdoors",
      },
      {
        src: "https://images.unsplash.com/photo-1666358070746-881bce1ccb3f?w=1200&auto=format&fit=crop&q=80",
        alt: "Close-up of the khaki tee's sleeve and hem",
      },
    ],
    colors: [
      { name: "Khaki", hex: "#a08e64" },
      { name: "Ink", hex: "#2a251e" },
    ],
    badge: "new",
    rating: 4.6,
    reviewCount: 24,
    soldLast24h: 9,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
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
