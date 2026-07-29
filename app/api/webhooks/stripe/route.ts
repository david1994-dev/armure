import { headers } from "next/headers";
import type Stripe from "stripe";
import { resolveValidUserId } from "@/lib/actions/checkout-shared";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

interface CheckoutMetadataItem {
  variantId: string;
  quantity: number;
}

/** Builds an Order/OrderItem/Payment (and Address rows from Stripe's collected shipping/billing
 * details) once Stripe confirms payment — see lib/actions/checkout.ts for why order creation is
 * deferred to this webhook rather than happening before redirect. */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return new Response(`Webhook signature verification failed: ${(error as Error).message}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("ok", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return new Response("ok", { status: 200 });
  }

  // Stripe retries webhooks on timeout/non-200s — skip if we've already recorded this session.
  const existingPayment = await prisma.payment.findFirst({ where: { transactionRef: session.id } });
  if (existingPayment) {
    return new Response("ok", { status: 200 });
  }

  const items: CheckoutMetadataItem[] = JSON.parse(session.metadata?.items ?? "[]");
  const userId = await resolveValidUserId(session.metadata?.userId || null);
  if (items.length === 0) {
    return new Response("Missing line items in session metadata", { status: 400 });
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: items.map((item) => item.variantId) } },
    include: { product: true },
  });

  const shippingDetails = session.collected_information?.shipping_details ?? session.customer_details;
  const billingDetails = session.customer_details;
  if (!shippingDetails?.address || !billingDetails?.address) {
    return new Response("Missing address details on session", { status: 400 });
  }

  const phone = session.customer_details?.phone ?? "";

  try {
    await prisma.$transaction(async (tx) => {
      const shippingAddress = await tx.address.create({
        data: {
          userId,
          fullName: shippingDetails.name ?? billingDetails.name ?? "Unknown",
          phone,
          line1: shippingDetails.address?.line1 ?? "",
          line2: shippingDetails.address?.line2,
          city: shippingDetails.address?.city ?? "",
          state: shippingDetails.address?.state ?? "",
          postalCode: shippingDetails.address?.postal_code ?? "",
          country: shippingDetails.address?.country ?? "",
        },
      });

      const billingAddress = await tx.address.create({
        data: {
          userId,
          fullName: billingDetails.name ?? "Unknown",
          phone,
          line1: billingDetails.address?.line1 ?? "",
          line2: billingDetails.address?.line2,
          city: billingDetails.address?.city ?? "",
          state: billingDetails.address?.state ?? "",
          postalCode: billingDetails.address?.postal_code ?? "",
          country: billingDetails.address?.country ?? "",
        },
      });

      const subtotal = items.reduce((sum, item) => {
        const variant = variants.find((candidate) => candidate.id === item.variantId);
        if (!variant) return sum;
        return sum + Number(variant.priceOverride ?? variant.product.basePrice) * item.quantity;
      }, 0);
      const total = (session.amount_total ?? Math.round(subtotal * 100)) / 100;

      const order = await tx.order.create({
        data: {
          orderNumber: `TW-${session.id.replace("cs_", "").toUpperCase().slice(0, 16)}`,
          userId,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          status: "PAID",
          subtotal,
          shippingCost: 0,
          tax: Math.max(0, total - subtotal),
          total,
          currency: (session.currency ?? "usd").toUpperCase(),
        },
      });

      for (const item of items) {
        const variant = variants.find((candidate) => candidate.id === item.variantId);
        if (!variant) continue;

        const unitPrice = Number(variant.priceOverride ?? variant.product.basePrice);
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: variant.id,
            productNameSnapshot: variant.product.name,
            colorSnapshot: variant.colorName,
            sizeSnapshot: variant.size,
            unitPrice,
            quantity: item.quantity,
            lineTotal: unitPrice * item.quantity,
          },
        });

        // Payment is already captured by Stripe at this point, so an oversell can't block the
        // order — floor stock at 0 instead of letting a lost decrement race drive it negative.
        const decremented = await tx.productVariant.updateMany({
          where: { id: variant.id, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (decremented.count === 0) {
          console.error(`[stripe-webhook] oversold variant ${variant.id}, flooring stock at 0`);
          await tx.productVariant.update({ where: { id: variant.id }, data: { stockQuantity: 0 } });
        }
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "stripe",
          method: "card",
          status: "SUCCEEDED",
          amount: total,
          currency: (session.currency ?? "usd").toUpperCase(),
          transactionRef: session.id,
          paidAt: new Date(),
        },
      });
    });
  } catch (error) {
    // A concurrent/retried delivery can race past the findFirst check above; the unique
    // constraint on transactionRef is the real guard, so treat its conflict as a no-op success.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return new Response("ok", { status: 200 });
    }
    throw error;
  }

  return new Response("ok", { status: 200 });
}
