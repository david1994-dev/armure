import type { ComponentType } from "react";
import { LockIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/ui/MarketingIcons";
import { Container } from "@/components/ui/Container";

interface TrustItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: TruckIcon, label: "Free US shipping $75+" },
  { icon: ShieldIcon, label: "1-year pilling guarantee" },
  { icon: ReturnIcon, label: "Free 30-day returns" },
  { icon: LockIcon, label: "Secure checkout" },
];

interface TrustBadgeStripProps {
  variant?: "full" | "compact";
  className?: string;
}

export function TrustBadgeStrip({ variant = "full", className = "" }: TrustBadgeStripProps) {
  if (variant === "compact") {
    return (
      <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
        {TRUST_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5 text-[0.78rem] text-ink-soft">
            <item.icon className="h-4 w-4 shrink-0 text-accent" />
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={`border-b border-line bg-surface ${className}`}>
      <Container className="grid grid-cols-2 gap-6 py-6 lg:grid-cols-4 lg:gap-8 lg:py-8">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon className="h-6 w-6 shrink-0 text-accent" />
            <span className="text-[0.82rem] font-semibold uppercase tracking-[0.02em] text-ink">
              {item.label}
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}
