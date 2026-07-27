"use client";

import { useState } from "react";
import { SIZE_CHART } from "@/lib/data/sizing";
import type { Product } from "@/lib/types";

interface ProductTabsProps {
  product: Product;
}

const TABS = ["Description", "Sizing", "Shipping & Returns"] as const;
type Tab = (typeof TABS)[number];

const SHIPPING_FAQ = [
  {
    q: "How long does shipping take?",
    a: "Orders ship within 1–2 business days and arrive in 3–5 business days via standard US ground shipping. Free on orders $75+.",
  },
  {
    q: "What's your return policy?",
    a: "Free returns and exchanges within 30 days of delivery, as long as the tee is unworn and unwashed.",
  },
  {
    q: "Do you ship internationally?",
    a: "Not yet — we currently ship to addresses within the United States only.",
  },
  {
    q: "What if my tee pills?",
    a: "Every TeeWorld tee is covered by our 1-year guarantee against pilling. Reach out and we'll replace it.",
  },
];

export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div className="mt-16 border-t border-line pt-10 lg:mt-24">
      <div role="tablist" aria-label="Product information" className="flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`-mb-px border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
              active === tab ? "border-ink text-ink" : "border-transparent text-ink-faint hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-[62ch] py-8">
        {active === "Description" ? <p className="text-ink-soft">{product.description}</p> : null}

        {active === "Sizing" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-2 pr-4 font-bold uppercase tracking-[0.04em] text-ink-faint">Size</th>
                  <th className="py-2 pr-4 font-bold uppercase tracking-[0.04em] text-ink-faint">Chest (in)</th>
                  <th className="py-2 font-bold uppercase tracking-[0.04em] text-ink-faint">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <td className="py-2 pr-4 font-bold tabular-nums">{row.size}</td>
                    <td className="py-2 pr-4 tabular-nums text-ink-soft">{row.chestIn}</td>
                    <td className="py-2 tabular-nums text-ink-soft">{row.lengthIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {active === "Shipping & Returns" ? (
          <dl className="flex flex-col gap-5">
            {SHIPPING_FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-ink">{item.q}</dt>
                <dd className="mt-1 text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}
