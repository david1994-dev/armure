"use client";

import { useEffect, useState } from "react";
import { TeeIcon } from "@/components/ui/TeeIcon";
import { getProductBySlug } from "@/lib/data/products";
import { recentPurchases } from "@/lib/data/recent-purchases";

const STORAGE_KEY = "armure-hide-purchase-toasts";
const COOKIE_CONSENT_KEY = "armure-cookie-consent";
const FIRST_DELAY_MS = 4000;
const CYCLE_MS = 8000;
const VISIBLE_MS = 5000;

function cookieBannerLikelyVisible() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === null;
  } catch {
    return false;
  }
}

export function RecentPurchaseToast() {
  const [enabled, setEnabled] = useState(false);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [stackAboveCookieBanner, setStackAboveCookieBanner] = useState(false);

  useEffect(() => {
    let dismissedForGood = false;
    try {
      dismissedForGood = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Ignore malformed or inaccessible storage.
    }
    if (dismissedForGood) return;
    // One-time sync from localStorage on mount, not state derived from
    // props/state — the recommended exception to this rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    let cycleTimer: number | undefined;
    let hideTimer: number | undefined;

    function showNext() {
      setStackAboveCookieBanner(cookieBannerLikelyVisible());
      setShown(true);
      hideTimer = window.setTimeout(() => setShown(false), VISIBLE_MS);
    }

    const firstTimer = window.setTimeout(() => {
      showNext();
      cycleTimer = window.setInterval(() => {
        setIndex((current) => (current + 1) % recentPurchases.length);
        showNext();
      }, CYCLE_MS);
    }, FIRST_DELAY_MS);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(cycleTimer);
    };
  }, []);

  function dismissForGood() {
    setShown(false);
    setEnabled(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore malformed or inaccessible storage.
    }
  }

  if (!enabled || !shown) return null;

  const purchase = recentPurchases[index];
  const product = getProductBySlug(purchase.productSlug);
  if (!product) return null;

  return (
    <div
      role="status"
      className={`fixed left-5 z-[55] flex w-[calc(100%-2.5rem)] max-w-[19rem] items-start gap-3 border border-line-strong bg-surface p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-[bottom] duration-200 ${
        stackAboveCookieBanner ? "bottom-24" : "bottom-5"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-surface-2">
        <TeeIcon color={product.swatchHex} className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.82rem] leading-snug text-ink">
          Someone in <span className="font-semibold">{purchase.buyerLocation}</span> just bought the{" "}
          <span className="font-semibold">{product.name}</span>
        </p>
        <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-ink-faint">
          {purchase.timeLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={dismissForGood}
        aria-label="Hide purchase notifications"
        className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-faint transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
