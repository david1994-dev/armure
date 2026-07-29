import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "teeworld_admin_session";
const COOKIE_NAME = ADMIN_SESSION_COOKIE_NAME;
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours — shorter than the shopper session since this gates order/customer data.

function getSecret(): string {
  // Deliberately separate from the shopper session's SESSION_SECRET (lib/session.ts) — sharing one
  // secret across both trust boundaries means a leak of either compromises both, and rotating the
  // shopper secret (e.g. after a breach) would also silently invalidate every admin session.
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Pure token check shared by the Server Component/Action path (isAdminAuthenticated, via the
 * cookies() store) and proxy.ts (which only has the raw cookie value off a NextRequest). */
export function isValidAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [marker, expiresAtRaw, signature] = token.split(".");
  if (marker !== "admin" || !expiresAtRaw || !signature) return false;

  const expected = sign(`${marker}.${expiresAtRaw}`);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return false;
  }
  if (Date.now() > Number(expiresAtRaw)) return false;

  return true;
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  const token = `${payload}.${sign(payload)}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(COOKIE_NAME)?.value);
}
