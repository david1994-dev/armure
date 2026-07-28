import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrossSellSection } from "@/components/product/CrossSellSection";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { SITE_URL } from "@/lib/constants";
import { getAllProductSlugs, getProductBySlug } from "@/lib/data/products";
import { buildMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: `${product.name} — ${product.colorName}`,
    description: product.description,
    path: `/shop/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.colorName}`,
    description: product.description,
    url: `${SITE_URL}/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.badge === "low-stock"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} />
      <ProductTabs product={product} />
      <ProductReviews product={product} />
      <CrossSellSection currentSlug={product.slug} />
    </Container>
  );
}
