"use client";

import { useEffect, useState } from "react";
import { EyeIcon, FireIcon } from "@/components/ui/MarketingIcons";
import type { Product } from "@/lib/types";

interface UrgencyIndicatorsProps {
  product: Product;
  className?: string;
}

/** Assumed restock ceiling used only to size the low-stock progress bar. */
const ASSUMED_MAX_STOCK = 20;

export function UrgencyIndicators({ product, className = "" }: UrgencyIndicatorsProps) {
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    // Mount-time seeded mock counter, not state derived from props/state —
    // the recommended exception to this rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewing(8 + Math.floor(Math.random() * 27));

    const interval = window.setInterval(() => {
      setViewing((current) => {
        if (current === null) return current;
        const next = current + (Math.random() > 0.5 ? 1 : -1);
        return Math.min(42, Math.max(6, next));
      });
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  const showLowStock = product.badge === "low-stock" && product.stockCount !== undefined;
  const stockPercent = showLowStock
    ? Math.min(100, Math.max(6, ((product.stockCount as number) / ASSUMED_MAX_STOCK) * 100))
    : 0;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {showLowStock ? (
        <div>
          <p className="text-sm font-semibold text-urgent">Only {product.stockCount} left in stock</p>
          <div className="mt-1.5 h-1.5 w-full max-w-[14rem] overflow-hidden bg-surface-2">
            <div className="h-full bg-urgent" style={{ width: `${stockPercent}%` }} />
          </div>
        </div>
      ) : null}

      {product.soldLast24h ? (
        <p className="flex items-center gap-1.5 text-sm text-ink-soft">
          <FireIcon className="h-4 w-4 text-accent" />
          {product.soldLast24h} sold in the last 24 hours
        </p>
      ) : null}

      {viewing !== null ? (
        <p className="flex items-center gap-1.5 text-sm text-ink-soft">
          <EyeIcon className="h-4 w-4 text-ink-faint" />
          {viewing} people viewing this right now
        </p>
      ) : null}
    </div>
  );
}
