"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, isValidUsername, verifyPassword } from "@/lib/password";
import { createSession, clearSession } from "@/lib/session";

export type AuthFormState = { error: string } | null;

export async function registerAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!isValidUsername(username)) {
    return { error: "Username must be 3-20 characters: letters, numbers, or underscore." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const existing = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: { id: true },
  });
  if (existing) {
    return { error: "That username is already taken." };
  }

  let userId: string;
  try {
    const user = await prisma.user.create({
      data: { username, passwordHash: await hashPassword(password) },
      select: { id: true },
    });
    userId = user.id;
  } catch (error) {
    // Race-condition fallback if two requests slip past the check above at once.
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "That username is already taken." };
    }
    throw error;
  }

  await createSession(userId);
  redirect("/account");
}

export async function loginAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: { id: true, passwordHash: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect username or password." };
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/account");
}
