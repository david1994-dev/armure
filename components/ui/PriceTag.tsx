import { formatPrice } from "@/lib/format";

interface PriceTagProps {
  amount: number;
  className?: string;
}

export function PriceTag({ amount, className = "" }: PriceTagProps) {
  return <span className={`font-bold tabular-nums ${className}`}>{formatPrice(amount)}</span>;
}
