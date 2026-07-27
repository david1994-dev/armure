import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Your Cart",
  description: "Review the tees in your TeeWorld cart before checkout.",
  path: "/cart",
});

export default function CartPage() {
  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
        Your Cart
      </h1>
      <CartView />
    </Container>
  );
}
