"use server";

import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder, createPayPalOrder, type PayPalCaptureResult } from "@/lib/paypal";
import { resolveCheckoutLines, resolveValidUserId, type CheckoutLineInput } from "@/lib/actions/checkout-shared";

export type PayPalOrderState = { orderId: string } | { error: string };
export type PayPalCaptureState = { orderId: string } | { error: string };

export async function createPayPalOrderAction(lines: CheckoutLineInput[]): Promise<PayPalOrderState> {
  const resolved = await resolveCheckoutLines(lines);
  if ("error" in resolved) return { error: resolved.error };

  const userId = await getSessionUserId();
  const total = resolved.lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);

  try {
    const order = await createPayPalOrder({
      items: resolved.lines.map((line) => ({
        variantId: line.variantId,
        name: `${line.productName} — ${line.colorName} (${line.size})`,
        quantity: line.quantity,
        unitAmount: line.unitAmount,
      })),
      total,
      userId,
    });
    return { orderId: order.id };
  } catch (error) {
    console.error("PayPal order creation failed:", error);
    return { error: "Could not reach the payment provider. Please try again shortly." };
  }
}

/** Builds the Order/Address/OrderItem/Payment rows from a completed PayPal order's details. Called
 * from two places: synchronously right after capture (below), and from the webhook at
 * app/api/webhooks/paypal/route.ts for captures that finish asynchronously (e.g. a PENDING risk
 * review that later resolves to COMPLETED) or if the client never got to call capture at all.
 * Idempotent via Payment.transactionRef, since both paths — or repeated webhook deliveries — can
 * race to fulfill the same order. Returns an error message, or null on success. */
export async function fulfillPayPalOrder(orderId: string, capture: PayPalCaptureResult): Promise<string | null> {
  const existingPayment = await prisma.payment.findFirst({ where: { transactionRef: orderId } });
  if (existingPayment) return null;

  const shippingAddr = capture.purchaseUnit.shippingAddress;
  if (!shippingAddr) return "Missing shipping address on PayPal order.";

  const variantIds = capture.purchaseUnit.items.map((item) => item.sku);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  const userId = await resolveValidUserId(capture.purchaseUnit.customId);
  const fullName = capture.purchaseUnit.shippingName || capture.payer.name || "Unknown";
  const orderNumber = `TW-PP-${orderId.toUpperCase().slice(0, 13)}`;

  await prisma.$transaction(async (tx) => {
    // PayPal Checkout only collects one address (shipping) — reuse it for billing too.
    const shippingAddress = await tx.address.create({
      data: {
        userId,
        fullName,
        phone: "",
        line1: shippingAddr.line1,
        line2: shippingAddr.line2,
        city: shippingAddr.city,
        state: shippingAddr.state,
        postalCode: shippingAddr.postalCode,
        country: shippingAddr.country,
      },
    });
    const billingAddress = await tx.address.create({
      data: {
        userId,
        fullName,
        phone: "",
        line1: shippingAddr.line1,
        line2: shippingAddr.line2,
        city: shippingAddr.city,
        state: shippingAddr.state,
        postalCode: shippingAddr.postalCode,
        country: shippingAddr.country,
      },
    });

    const subtotal = capture.purchaseUnit.items.reduce((sum, item) => {
      const variant = variants.find((candidate) => candidate.id === item.sku);
      if (!variant) return sum;
      return sum + Number(variant.priceOverride ?? variant.product.basePrice) * item.quantity;
    }, 0);
    const total = Number(capture.purchaseUnit.amount ?? subtotal);

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        status: "PAID",
        subtotal,
        shippingCost: 0,
        tax: Math.max(0, total - subtotal),
        total,
        currency: "USD",
      },
    });

    for (const item of capture.purchaseUnit.items) {
      const variant = variants.find((candidate) => candidate.id === item.sku);
      if (!variant) continue;

      const unitPrice = Number(variant.priceOverride ?? variant.product.basePrice);
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          variantId: variant.id,
          productNameSnapshot: variant.product.name,
          colorSnapshot: variant.colorName,
          sizeSnapshot: variant.size,
          unitPrice,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
        },
      });
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        provider: "paypal",
        method: "paypal",
        status: "SUCCEEDED",
        amount: total,
        currency: "USD",
        transactionRef: orderId,
        paidAt: new Date(),
      },
    });
  });

  return null;
}

/** Triggers the actual capture (buyer just approved in the popup), then fulfills immediately if
 * PayPal confirms it as COMPLETED. If PayPal instead returns it as PENDING (held for risk review),
 * fulfillment is deferred to the PAYMENT.CAPTURE.COMPLETED webhook — the client still gets an
 * orderId to land on the success page, which shows a "confirming payment" state until then. */
export async function capturePayPalOrderAction(orderId: string): Promise<PayPalCaptureState> {
  try {
    const capture = await capturePayPalOrder(orderId);
    if (capture.status === "COMPLETED") {
      const error = await fulfillPayPalOrder(orderId, capture);
      if (error) return { error };
    }
    return { orderId };
  } catch (error) {
    console.error("PayPal capture failed:", error);
    return { error: "Could not confirm your PayPal payment. Please contact support." };
  }
}
