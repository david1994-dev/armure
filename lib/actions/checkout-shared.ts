import { prisma } from "@/lib/prisma";

export interface CheckoutLineInput {
  slug: string;
  colorName: string;
  size: string;
  quantity: number;
}

export interface ResolvedCheckoutLine {
  variantId: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  unitAmount: number;
}

export type ResolveCheckoutLinesResult = { error: string } | { lines: ResolvedCheckoutLine[] };

/** Shared by both payment providers: looks up each cart line's ProductVariant fresh from
 * Postgres and computes its price server-side, so neither provider ever trusts a client-submitted total. */
export async function resolveCheckoutLines(lines: CheckoutLineInput[]): Promise<ResolveCheckoutLinesResult> {
  if (lines.length === 0) return { error: "Your cart is empty." };

  const variants = await prisma.productVariant.findMany({
    where: {
      OR: lines.map((line) => ({
        product: { slug: line.slug },
        colorName: line.colorName,
        size: line.size,
      })),
    },
    include: { product: true },
  });

  const resolved: ResolvedCheckoutLine[] = [];
  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      return { error: `Invalid quantity for ${line.slug} (${line.colorName}, ${line.size}).` };
    }

    const variant = variants.find(
      (candidate) =>
        candidate.product.slug === line.slug &&
        candidate.colorName === line.colorName &&
        candidate.size === line.size,
    );
    if (!variant) {
      return { error: `${line.slug} (${line.colorName}, ${line.size}) is no longer available.` };
    }
    if (variant.stockQuantity < line.quantity) {
      return {
        error: `Only ${variant.stockQuantity} left of ${variant.product.name} — ${line.colorName}, ${line.size}.`,
      };
    }

    resolved.push({
      variantId: variant.id,
      productName: variant.product.name,
      colorName: variant.colorName,
      size: variant.size,
      quantity: line.quantity,
      unitAmount: Number(variant.priceOverride ?? variant.product.basePrice),
    });
  }

  return { lines: resolved };
}

/** Session cookies are only HMAC-verified, not checked against the database (lib/session.ts) — if
 * the referenced account was deleted, or the DB was reset/reseeded after the cookie was issued, the
 * signature still checks out but the id no longer exists. Both providers write this id straight
 * into Address/Order as a foreign key, so it must be confirmed live before use, or the write throws
 * a foreign key violation instead of just falling back to a guest order. */
export async function resolveValidUserId(userId: string | null): Promise<string | null> {
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return user ? userId : null;
}
