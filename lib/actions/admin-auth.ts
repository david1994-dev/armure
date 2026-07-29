"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession } from "@/lib/admin-session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type AdminAuthState = { error: string } | null;

export async function loginAdminAction(_prevState: AdminAuthState, formData: FormData): Promise<AdminAuthState> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`admin-login:${ip}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60)} min.` };
  }

  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "Admin login isn't configured yet." };
  }

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(password);
  const matches = expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);

  if (!matches) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin/orders");
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
