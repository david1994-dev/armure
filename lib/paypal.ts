const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status} ${await response.text()}`);
  }
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export interface PayPalOrderItemInput {
  variantId: string;
  name: string;
  quantity: number;
  unitAmount: number;
}

export async function createPayPalOrder(params: {
  items: PayPalOrderItemInput[];
  total: number;
  userId: string | null;
}): Promise<{ id: string }> {
  const accessToken = await getAccessToken();
  const itemTotal = params.items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: params.userId || undefined,
          amount: {
            currency_code: "USD",
            value: params.total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: itemTotal.toFixed(2) },
            },
          },
          // sku carries our variant id so the capture step can rebuild order lines
          // straight from PayPal's response, the same role Stripe's session metadata plays.
          items: params.items.map((item) => ({
            name: item.name.slice(0, 127),
            sku: item.variantId,
            quantity: String(item.quantity),
            unit_amount: { currency_code: "USD", value: item.unitAmount.toFixed(2) },
          })),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`PayPal order creation failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

export interface PayPalCaptureResult {
  status: string;
  purchaseUnit: {
    customId: string | null;
    amount: string | null;
    items: { sku: string; quantity: number }[];
    shippingName: string | null;
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    } | null;
  };
  payer: {
    name: string | null;
  };
}

interface PayPalOrderApiItem {
  sku: string;
  quantity: string;
}

interface PayPalOrderApiResponse {
  status: string;
  payer?: { name?: { given_name?: string; surname?: string } };
  purchase_units?: {
    custom_id?: string;
    items?: PayPalOrderApiItem[];
    payments?: { captures?: { amount?: { value?: string } }[] };
    shipping?: {
      name?: { full_name?: string };
      address?: {
        address_line_1?: string;
        address_line_2?: string;
        admin_area_2?: string;
        admin_area_1?: string;
        postal_code?: string;
        country_code?: string;
      };
    };
  }[];
}

function parsePayPalOrderResponse(data: PayPalOrderApiResponse): PayPalCaptureResult {
  const purchaseUnit = data.purchase_units?.[0];
  const shippingAddress = purchaseUnit?.shipping?.address;
  const payerName = data.payer?.name
    ? `${data.payer.name.given_name ?? ""} ${data.payer.name.surname ?? ""}`.trim()
    : null;

  return {
    status: data.status,
    purchaseUnit: {
      customId: purchaseUnit?.custom_id ?? null,
      amount: purchaseUnit?.payments?.captures?.[0]?.amount?.value ?? null,
      items: (purchaseUnit?.items ?? []).map((item) => ({ sku: item.sku, quantity: Number(item.quantity) })),
      shippingName: purchaseUnit?.shipping?.name?.full_name ?? null,
      shippingAddress: shippingAddress
        ? {
            line1: shippingAddress.address_line_1 ?? "",
            line2: shippingAddress.address_line_2,
            city: shippingAddress.admin_area_2 ?? "",
            state: shippingAddress.admin_area_1 ?? "",
            postalCode: shippingAddress.postal_code ?? "",
            country: shippingAddress.country_code ?? "",
          }
        : null,
    },
    payer: { name: payerName },
  };
}

async function paypalApiRequest<T>(path: string, method: "GET" | "POST"): Promise<T> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`PayPal API ${method} ${path} failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return data as T;
}

/** Actually captures payment — only the buyer-approval flow (checkout-paypal.ts) should call this;
 * the webhook only reads order state back via getPayPalOrder, never re-captures. */
export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const data = await paypalApiRequest<PayPalOrderApiResponse>(`/v2/checkout/orders/${orderId}/capture`, "POST");
  return parsePayPalOrderResponse(data);
}

/** Read-only fetch of an order's current state — used by the webhook to rebuild full order details
 * (items/shipping/payer) for captures that complete asynchronously (e.g. after a PENDING risk review). */
export async function getPayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const data = await paypalApiRequest<PayPalOrderApiResponse>(`/v2/checkout/orders/${orderId}`, "GET");
  return parsePayPalOrderResponse(data);
}

interface PayPalCaptureApiResponse {
  supplementary_data?: { related_ids?: { order_id?: string } };
}

/** PAYMENT.CAPTURE.REFUNDED webhook events only carry a refund id — this resolves the refund's
 * capture back to its checkout order id so we know which Order/Payment to mark refunded. */
export async function getPayPalCaptureOrderId(captureId: string): Promise<string | null> {
  const data = await paypalApiRequest<PayPalCaptureApiResponse>(`/v2/payments/captures/${captureId}`, "GET");
  return data.supplementary_data?.related_ids?.order_id ?? null;
}

export async function verifyPayPalWebhookSignature(params: {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
  webhookEvent: unknown;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transmission_id: params.transmissionId,
      transmission_time: params.transmissionTime,
      cert_url: params.certUrl,
      auth_algo: params.authAlgo,
      transmission_sig: params.transmissionSig,
      webhook_id: webhookId,
      webhook_event: params.webhookEvent,
    }),
  });
  if (!response.ok) return false;

  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}
