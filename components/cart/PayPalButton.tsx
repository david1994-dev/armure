"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { capturePayPalOrderAction, createPayPalOrderAction } from "@/lib/actions/checkout-paypal";
import type { CheckoutLineInput } from "@/lib/actions/checkout-shared";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => { render: (container: HTMLElement) => void };
    };
  }
}

const PAYPAL_SCRIPT_ID = "paypal-sdk-script";

interface PayPalButtonProps {
  lines: CheckoutLineInput[];
  onError: (message: string) => void;
}

export function PayPalButton({ lines, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Kept fresh via refs so the PayPal SDK buttons (rendered once, in the effect below) always act
  // on the current cart/handler without needing to be torn down and re-rendered on every cart edit.
  const linesRef = useRef(lines);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    linesRef.current = lines;
    onErrorRef.current = onError;
  }, [lines, onError]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      onErrorRef.current("PayPal checkout isn't configured yet.");
      return;
    }

    let cancelled = false;

    function renderButtons() {
      if (cancelled || !containerRef.current || !window.paypal) return;
      // Guards against duplicate button rows if this effect fires more than once for the same
      // container — e.g. React Strict Mode's dev-only double-invoke, or the script's "load"
      // event somehow firing twice — since .render() only ever appends, never replaces.
      containerRef.current.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "vertical", label: "paypal" },
          createOrder: async () => {
            const result = await createPayPalOrderAction(linesRef.current);
            if ("error" in result) {
              onErrorRef.current(result.error);
              throw new Error(result.error);
            }
            return result.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const result = await capturePayPalOrderAction(data.orderID);
            if ("error" in result) {
              onErrorRef.current(result.error);
              return;
            }
            router.push(`/checkout/success?ref=${data.orderID}`);
          },
          onError: () => {
            onErrorRef.current("Something went wrong with PayPal. Please try again.");
          },
        })
        .render(containerRef.current);
    }

    const existingScript = document.getElementById(PAYPAL_SCRIPT_ID) as HTMLScriptElement | null;
    if (window.paypal) {
      renderButtons();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderButtons);
    } else {
      const script = document.createElement("script");
      script.id = PAYPAL_SCRIPT_ID;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`;
      script.addEventListener("load", renderButtons);
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}
