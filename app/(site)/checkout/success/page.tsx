import type { Metadata } from "next";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PriceTag } from "@/components/ui/PriceTag";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = buildMetadata({
  title: "Order Confirmed",
  description: "Your TeeWorld order is confirmed.",
  path: "/checkout/success",
});

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { ref: transactionRef } = await searchParams;

  // Stripe's webhook that creates the Order/Payment can lag a few seconds behind this redirect
  // (PayPal's capture is synchronous, so it's already created by the time we land here) — a null
  // result just means "not confirmed yet," not a failure.
  const payment = transactionRef
    ? await prisma.payment.findFirst({
        where: { transactionRef },
        include: { order: { include: { items: true } } },
      })
    : null;

  return (
    <Container className="py-16 lg:py-24">
      <ClearCartOnMount />
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
          {payment?.order ? "Order Confirmed" : "Payment Received"}
        </h1>

        {payment?.order ? (
          <>
            <p className="mt-4 text-ink-soft">
              Thanks for your order <span className="font-semibold text-ink">#{payment.order.orderNumber}</span>.
              A confirmation email is on its way.
            </p>
            <ul className="mt-8 flex flex-col gap-3 border border-line bg-surface p-5 text-left">
              {payment.order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {item.productNameSnapshot} &mdash; {item.colorSnapshot}, {item.sizeSnapshot} &times;{" "}
                    {item.quantity}
                  </span>
                  <PriceTag amount={Number(item.lineTotal)} />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm font-bold">
              <span>Total</span>
              <PriceTag amount={Number(payment.order.total)} />
            </div>
          </>
        ) : (
          <p className="mt-4 text-ink-soft">
            We&apos;re confirming your payment now &mdash; this can take a few seconds. Check your email shortly
            for your order confirmation.
          </p>
        )}

        <Button href="/shop" variant="primary" className="mt-9">
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}
