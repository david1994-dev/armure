"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/** Fires once when the Stripe success page mounts. Runs with an empty dependency array on
 * purpose — `clearCart` is a new function identity every CartProvider render, so depending on
 * it would re-fire the effect (and re-clear an already-empty cart) in a loop. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
