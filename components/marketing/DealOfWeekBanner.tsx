import Link from "next/link";
import { CountdownTimer } from "@/components/marketing/CountdownTimer";
import { Container } from "@/components/ui/Container";
import { TeeIcon } from "@/components/ui/TeeIcon";
import { DEAL_OF_WEEK } from "@/lib/data/deals";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

export function DealOfWeekBanner() {
  const product = getProductBySlug(DEAL_OF_WEEK.productSlug);
  if (!product) return null;

  const discountedPrice = Math.round(product.price * (1 - DEAL_OF_WEEK.discountPercent / 100));

  return (
    <section className="border-y border-line-strong bg-ink">
      <Container className="flex flex-col items-center gap-6 py-9 lg:flex-row lg:justify-between lg:py-10">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-bg/10">
            <TeeIcon color={product.swatchHex} className="h-12 w-12" />
          </div>
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-accent">Deal of the Week</p>
            <h2 className="mt-1 font-display text-xl font-extrabold uppercase tracking-[-0.01em] text-bg">
              {product.name} &mdash; {DEAL_OF_WEEK.discountPercent}% off
            </h2>
            <p className="mt-1 text-sm">
              <span className="text-bg/50 line-through">{formatPrice(product.price)}</span>{" "}
              <span className="font-bold text-bg">{formatPrice(discountedPrice)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <CountdownTimer targetDate={DEAL_OF_WEEK.endsAt} label="Ends in" tone="inverted" />
          <Link
            href={`/shop/${product.slug}`}
            className="whitespace-nowrap border border-bg px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
          >
            Shop the Deal
          </Link>
        </div>
      </Container>
    </section>
  );
}
