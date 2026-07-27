import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export type CurrentUser = {
  id: string;
  username: string;
  createdAt: Date;
  plan: "FREE" | "PAID";
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, createdAt: true, plan: true },
  });
}
