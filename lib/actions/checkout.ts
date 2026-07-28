"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { getSessionUserId } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { resolveCheckoutLines, type CheckoutLineInput } from "@/lib/actions/checkout-shared";

export type { CheckoutLineInput };
export type CheckoutState = { error: string } | null;

async function resolveOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("host");
  if (!host) throw new Error("Unable to determine request origin");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

/**
 * Builds a Stripe Checkout Session from server-trusted prices (never the client's cart totals),
 * then redirects the browser to Stripe's hosted page. The Order/Payment rows are created later,
 * in the webhook, once Stripe has confirmed payment and collected the shipping/billing address —
 * this app has no address-collection UI of its own yet.
 */
export async function createCheckoutSessionAction(lines: CheckoutLineInput[]): Promise<CheckoutState> {
  const resolved = await resolveCheckoutLines(lines);
  if ("error" in resolved) return { error: resolved.error };

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolved.lines.map((line) => ({
    quantity: line.quantity,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(line.unitAmount * 100),
      product_data: {
        name: `${line.productName} — ${line.colorName} (${line.size})`,
      },
    },
  }));
  const metadataItems = resolved.lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity }));

  const userId = await getSessionUserId();
  const origin = await resolveOrigin();

  let sessionUrl: string | null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?ref={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
      metadata: {
        userId: userId ?? "",
        items: JSON.stringify(metadataItems),
      },
    });
    sessionUrl = session.url;
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return { error: "Could not reach the payment provider. Please try again shortly." };
  }

  if (!sessionUrl) return { error: "Could not start checkout. Please try again." };

  redirect(sessionUrl);
}
