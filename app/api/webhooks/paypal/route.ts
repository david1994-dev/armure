import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { fulfillPayPalOrder } from "@/lib/actions/checkout-paypal";
import { getPayPalCaptureOrderId, getPayPalOrder, verifyPayPalWebhookSignature } from "@/lib/paypal";

interface PayPalWebhookEvent {
  event_type: string;
  resource: {
    id: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
    links?: { rel: string; href: string }[];
  };
}

/** Safety net around the synchronous capture flow in lib/actions/checkout-paypal.ts: fulfills
 * captures that complete asynchronously (e.g. held for PayPal risk review, so the client-triggered
 * capture returned PENDING), and marks orders REFUNDED when a refund/dispute lands after the fact —
 * neither of which the synchronous path can ever see on its own. */
const LOG_PREFIX = "[paypal-webhook]";

export async function POST(request: Request) {
  const bodyText = await request.text();
  const headerList = await headers();
  const transmissionId = headerList.get("paypal-transmission-id") ?? "unknown";

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(bodyText);
  } catch {
    console.error(`${LOG_PREFIX} invalid JSON body (transmission ${transmissionId})`);
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventType = (webhookEvent as { event_type?: string }).event_type ?? "unknown";
  const resourceId = (webhookEvent as { resource?: { id?: string } }).resource?.id ?? "unknown";
  console.log(`${LOG_PREFIX} received ${eventType} (resource ${resourceId}, transmission ${transmissionId})`);

  const verified = await verifyPayPalWebhookSignature({
    transmissionId: headerList.get("paypal-transmission-id") ?? "",
    transmissionTime: headerList.get("paypal-transmission-time") ?? "",
    certUrl: headerList.get("paypal-cert-url") ?? "",
    authAlgo: headerList.get("paypal-auth-algo") ?? "",
    transmissionSig: headerList.get("paypal-transmission-sig") ?? "",
    webhookEvent,
  });
  if (!verified) {
    console.error(`${LOG_PREFIX} signature verification failed for ${eventType} (transmission ${transmissionId})`);
    return new Response("Webhook signature verification failed", { status: 400 });
  }
  console.log(`${LOG_PREFIX} signature verified for ${eventType} (transmission ${transmissionId})`);

  const event = webhookEvent as PayPalWebhookEvent;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    if (!orderId) {
      console.error(`${LOG_PREFIX} PAYMENT.CAPTURE.COMPLETED missing related order id (capture ${resourceId})`);
      return new Response("Missing order id on capture event", { status: 400 });
    }

    console.log(`${LOG_PREFIX} fulfilling order ${orderId} from capture ${resourceId}`);
    const order = await getPayPalOrder(orderId);
    const error = await fulfillPayPalOrder(orderId, order);
    if (error) {
      console.error(`${LOG_PREFIX} fulfillment failed for order ${orderId}: ${error}`);
    } else {
      console.log(`${LOG_PREFIX} fulfilled order ${orderId} (or already fulfilled)`);
    }
    return new Response("ok", { status: 200 });
  }

  if (event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
    const captureLink = event.resource.links?.find((link) => link.rel === "up")?.href;
    const captureId = captureLink?.split("/").pop();
    const orderId = captureId ? await getPayPalCaptureOrderId(captureId) : null;
    console.log(`${LOG_PREFIX} refund ${resourceId} → capture ${captureId ?? "unknown"} → order ${orderId ?? "unknown"}`);

    if (!orderId) {
      console.error(`${LOG_PREFIX} could not resolve order id for refund ${resourceId}`);
      return new Response("ok", { status: 200 });
    }

    const payment = await prisma.payment.findFirst({ where: { transactionRef: orderId } });
    if (payment?.orderId) {
      await prisma.$transaction([
        prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } }),
        prisma.order.update({ where: { id: payment.orderId }, data: { status: "REFUNDED" } }),
      ]);
      console.log(`${LOG_PREFIX} marked order ${orderId} REFUNDED`);
    } else {
      console.error(`${LOG_PREFIX} no local Payment found for refunded order ${orderId}`);
    }
    return new Response("ok", { status: 200 });
  }

  console.log(`${LOG_PREFIX} ignoring unhandled event type ${eventType}`);
  return new Response("ok", { status: 200 });
}
