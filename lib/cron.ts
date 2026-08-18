import { timingSafeEqual } from "node:crypto";

/** Verifies Vercel Cron's `Authorization: Bearer <CRON_SECRET>` header — same length-guard +
 * timingSafeEqual idiom as lib/admin-session.ts/lib/session.ts, shared by both cron routes. */
export function verifyCronSecret(headerValue: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !headerValue) return false;

  const expected = `Bearer ${secret}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(headerValue);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}
