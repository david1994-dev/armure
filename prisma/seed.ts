import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"] as const;

const BEST_SELLER_SLUGS = new Set([
  "bastion-tee-ink",
  "anchor-tee-bone",
  "ridge-tee-clay",
  "fieldwork-tee-olive",
  "depot-tee-stone",
  "outpost-tee-rust",
]);

interface SeedProduct {
  slug: string;
  name: string;
  price: number;
  weightGsm: number;
  fit: string;
  description: string;
  images: { src: string; alt: string }[];
  colors: { name: string; hex: string }[];
  badge?: "new" | "low-stock" | "restocked";
  rating: number;
  reviewCount: number;
  stockCount?: number;
  soldLast24h?: number;
}

const products: SeedProduct[] = [
  {
    slug: "ridge-tee-clay",
    name: "Ridge Tee",
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description:
      "Our signature weight — 220GSM combed cotton with a reinforced collar that holds its shape wash after wash.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/ridge-tee-clay/1.webp", alt: "Clay orange tee folded on top of a jacket" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/ridge-tee-clay/2.webp", alt: "Close-up of the clay tee's collar and shoulder seam" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/ridge-tee-clay/3.webp", alt: "Model wearing the clay tee outdoors against a rock wall" },
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
    price: 46,
    weightGsm: 240,
    fit: "Boxy Fit",
    description:
      "Heavier 240GSM cotton in a boxy, drop-shoulder cut for a fit that stays relaxed instead of shapeless.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/fieldwork-tee-olive/1.webp", alt: "Model wearing an olive green oversized tee outdoors" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/fieldwork-tee-olive/2.webp", alt: "Model wearing the olive tee with arms crossed" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/fieldwork-tee-olive/3.webp", alt: "Model wearing the olive tee, hand resting on belt" },
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
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description: "The one-tee-forever black. Piece-dyed for even, fade-resistant color and double-stitched throughout.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/bastion-tee-ink/1.webp", alt: "Ink black tee hanging among other black tees" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/bastion-tee-ink/2.webp", alt: "Model wearing the ink black tee, front view" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/bastion-tee-ink/3.webp", alt: "Model wearing the ink black tee on a city street" },
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
    price: 38,
    weightGsm: 200,
    fit: "Slim Fit",
    description: "Our lightest tee at 200GSM, cut slim for layering, in a soft off-white that won't yellow over time.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/anchor-tee-bone/1.webp", alt: "Model wearing a bone colored tee against a plain studio wall" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/anchor-tee-bone/2.webp", alt: "Close-up of the bone tee's shoulder and torso" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/anchor-tee-bone/3.webp", alt: "Bone tee laid flat against a plain background" },
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
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description: "Oversized block cut in a burnt rust tone, built from the same 240GSM cotton as our Fieldwork line.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/outpost-tee-rust/1.webp", alt: "Model wearing a rust orange tee outdoors in autumn" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/outpost-tee-rust/2.webp", alt: "Model wearing the rust tee beside a chain-link fence" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/outpost-tee-rust/3.webp", alt: "Model wearing the rust tee against a rolldown shutter" },
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
    price: 42,
    weightGsm: 220,
    fit: "Oversized",
    description: "A quiet stone grey in our oversized block cut, with the same 220GSM weight as the Ridge Tee.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/depot-tee-stone/1.webp", alt: "Model wearing a stone colored tee" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/depot-tee-stone/2.webp", alt: "Model wearing the stone tee, arms crossed against a wall" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/depot-tee-stone/3.webp", alt: "Close-up of the stone tee's fabric and collar" },
    ],
    colors: [{ name: "Stone", hex: "#6c6252" }],
    rating: 4.3,
    reviewCount: 42,
  },
  {
    slug: "harbor-tee-slate",
    name: "Harbor Tee",
    price: 44,
    weightGsm: 220,
    fit: "Regular Fit",
    description: "A cool slate grey in our regular cut — 220GSM cotton with the same reinforced collar as the Ridge Tee.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/harbor-tee-slate/1.webp", alt: "Model wearing a slate blue-grey tee against a grey wall" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/harbor-tee-slate/2.webp", alt: "Model wearing the slate tee, hand in hair" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/harbor-tee-slate/3.webp", alt: "Model wearing the slate tee outdoors" },
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
    price: 40,
    weightGsm: 200,
    fit: "Slim Fit",
    description: "Our lightest 200GSM cotton, slim-cut and dyed a deep forest green that won't fade under repeated washing.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/summit-tee-forest/1.webp", alt: "Forest green tee hanging outdoors on a street sign" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/summit-tee-forest/2.webp", alt: "Model walking through a forest wearing the forest green tee, back view" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/summit-tee-forest/3.webp", alt: "Close-up of a model wearing the forest green tee" },
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
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description: "A sun-bleached sand tone in our heaviest 240GSM cotton, cut oversized with a dropped shoulder seam.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/drift-tee-sand/1.webp", alt: "Stack of folded tees including a sand colored one" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/drift-tee-sand/2.webp", alt: "Back view of a model wearing the sand tee" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/drift-tee-sand/3.webp", alt: "Model seated wearing the sand tee" },
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
    price: 44,
    weightGsm: 220,
    fit: "Boxy Fit",
    description: "A deep charcoal boxy tee in 220GSM cotton, piece-dyed for even color that won't streak in the wash.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/vantage-tee-charcoal/1.webp", alt: "Folded charcoal grey tee on a plain surface" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/vantage-tee-charcoal/2.webp", alt: "Close-up of the charcoal tee's collar and fabric" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/vantage-tee-charcoal/3.webp", alt: "Model wearing the charcoal tee, side profile" },
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
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description: "A muted moss green in our regular cut, built from the same 220GSM combed cotton as the Ridge Tee.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/relic-tee-moss/1.webp", alt: "Model wearing a moss green tee outdoors" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/relic-tee-moss/2.webp", alt: "Row of moss green tees hanging" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/relic-tee-moss/3.webp", alt: "Close-up portrait of a model wearing the moss tee" },
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
    price: 40,
    weightGsm: 200,
    fit: "Slim Fit",
    description: "A garment-washed black in our lightest 200GSM cotton, slim-cut with a slightly faded, worn-in look.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/cinder-tee-blackwash/1.webp", alt: "Black wash tee laid flat on a plain surface" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/cinder-tee-blackwash/2.webp", alt: "Close-up of the black wash tee's collar tag" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/cinder-tee-blackwash/3.webp", alt: "Model wearing the black wash tee outdoors" },
    ],
    colors: [{ name: "Black Wash", hex: "#3d3a36" }],
    badge: "restocked",
    rating: 4.3,
    reviewCount: 29,
  },
  {
    slug: "timber-tee-umber",
    name: "Timber Tee",
    price: 46,
    weightGsm: 240,
    fit: "Oversized",
    description: "A rich umber brown in our heaviest 240GSM cotton, cut oversized for a boxy, worn-in silhouette.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/timber-tee-umber/1.webp", alt: "Model wearing an umber brown tee" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/timber-tee-umber/2.webp", alt: "Close-up portrait of a model wearing the umber tee" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/timber-tee-umber/3.webp", alt: "Side view of a model wearing the umber tee" },
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
    price: 42,
    weightGsm: 220,
    fit: "Regular Fit",
    description: "A workwear-inspired khaki in our regular cut, 220GSM cotton with the same durable double-stitching throughout.",
    images: [
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/basecamp-tee-khaki/1.webp", alt: "Khaki tee folded next to a mustard tee on a drying line" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/basecamp-tee-khaki/2.webp", alt: "Model wearing the khaki tee outdoors" },
      { src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/products/basecamp-tee-khaki/3.webp", alt: "Close-up of the khaki tee's sleeve and hem" },
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

interface SeedReview {
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

const reviews: SeedReview[] = [
  { productSlug: "ridge-tee-clay", author: "Marcus T.", rating: 5, title: "Holds up after a year of washes", body: "Bought this for work and it still looks new after weekly washes. The collar hasn't stretched out at all.", date: "2026-05-12", verified: true },
  { productSlug: "ridge-tee-clay", author: "Dana R.", rating: 4, title: "Great weight, runs slightly large", body: "Fabric feels substantial without being stiff. I'd size down if you like a closer fit.", date: "2026-04-02", verified: true },
  { productSlug: "fieldwork-tee-olive", author: "Priya K.", rating: 5, title: "The boxy cut is perfect", body: "Exactly the relaxed silhouette I wanted. Olive color is richer in person than photos.", date: "2026-06-01", verified: true },
  { productSlug: "fieldwork-tee-olive", author: "Sam O.", rating: 4, title: "Heavy and warm", body: "Definitely on the heavier side — great for cooler months, might be too much for summer.", date: "2026-05-20", verified: false },
  { productSlug: "bastion-tee-ink", author: "Elena V.", rating: 5, title: "My third one — no fading", body: "This is my third Bastion Tee. Unlike other black tees I've owned, this one hasn't gone grey in the wash.", date: "2026-03-18", verified: true },
  { productSlug: "bastion-tee-ink", author: "Chris N.", rating: 5, title: "The only black tee I need", body: "Double stitching is obvious quality. Fits true to size and the black is genuinely deep black.", date: "2026-06-14", verified: true },
  { productSlug: "anchor-tee-bone", author: "Jules F.", rating: 4, title: "Great layering piece", body: "Lightweight enough to layer under a jacket without adding bulk. Bone color stayed clean-looking.", date: "2026-04-28", verified: true },
  { productSlug: "outpost-tee-rust", author: "Theo B.", rating: 5, title: "Oversized done right", body: "Boxy without looking sloppy. The rust colorway is unique — get compliments every time I wear it.", date: "2026-05-30", verified: true },
  { productSlug: "depot-tee-stone", author: "Nadia P.", rating: 4, title: "Solid everyday grey", body: "Good weight, neutral color goes with everything. Wish it came in more colorways.", date: "2026-06-08", verified: false },
];

const SEED_BASE = new Date("2026-01-01T00:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

function slugifyColor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`products table already has ${existing} row(s) — skipping seed.`);
    return;
  }

  console.log(`Seeding ${products.length} products...`);

  for (const [index, p] of products.entries()) {
    const isNew = p.badge === "new";
    // "new"-badged products get the most recent createdAt so `orderBy: createdAt desc`
    // (the "newest" sort) surfaces them first — a real, DB-native equivalent of the old
    // badge-based mock sort, instead of a computed/raw-SQL tiebreak.
    const createdAt = isNew
      ? new Date(SEED_BASE.getTime() + (1000 + index) * DAY_MS)
      : new Date(SEED_BASE.getTime() + index * DAY_MS);

    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        basePrice: p.price,
        weightGsm: p.weightGsm,
        fit: p.fit,
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isBestSeller: BEST_SELLER_SLUGS.has(p.slug),
        soldLast24h: p.soldLast24h,
        createdAt,
      },
    });

    await prisma.productImage.createMany({
      data: p.images.map((image, position) => ({
        productId: product.id,
        url: image.src,
        altText: image.alt,
        position,
        isCover: position === 0,
      })),
    });

    // Mock stock: spread the old product-level stockCount (low-stock items only) evenly
    // across every color x size combo; everything else gets a generous default stock.
    const totalVariants = p.colors.length * SIZES.length;
    const stockPerVariant =
      p.stockCount !== undefined ? Math.max(1, Math.round(p.stockCount / totalVariants)) : 50;

    let sortOrder = 0;
    const variantRows = [];
    for (const color of p.colors) {
      for (const size of SIZES) {
        variantRows.push({
          productId: product.id,
          colorName: color.name,
          colorHex: color.hex,
          size,
          sku: `${p.slug}-${slugifyColor(color.name)}-${size}`.toUpperCase(),
          stockQuantity: stockPerVariant,
          sortOrder: sortOrder++,
        });
      }
    }
    await prisma.productVariant.createMany({ data: variantRows });

    console.log(`✓ ${p.slug} — ${p.images.length} images, ${variantRows.length} variants`);
  }

  console.log(`\nSeeding ${reviews.length} reviews...`);
  for (const review of reviews) {
    const product = await prisma.product.findUniqueOrThrow({ where: { slug: review.productSlug } });
    await prisma.review.create({
      data: {
        productId: product.id,
        authorName: review.author,
        rating: review.rating,
        title: review.title,
        body: review.body,
        verified: review.verified,
        createdAt: new Date(review.date),
      },
    });
  }

  console.log("\nDone.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
