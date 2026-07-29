import { headers } from "next/headers";

interface Attempt {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, Attempt>();

/** Best-effort brute-force guard: in-memory and per-instance, so it resets on cold start and
 * isn't shared across concurrent serverless instances. Not a substitute for a real store (e.g.
 * Upstash Redis) under sustained attack, but raises the bar against casual scripted attempts at
 * this app's scale. Sweeps its own expired entries so the map doesn't grow unbounded. */
export function checkRateLimit(
  key: string,
  { maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {},
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  if (attempts.size > 5000) {
    for (const [existingKey, entry] of attempts) {
      if (now > entry.resetAt) attempts.delete(existingKey);
    }
  }

  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

/** Vercel (and most reverse proxies) set x-forwarded-for to "client, proxy1, proxy2" — the first
 * entry is the original client. Falls back to "unknown" so at least all un-proxied requests share
 * one bucket rather than throwing. */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}
