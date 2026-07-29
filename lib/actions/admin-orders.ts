"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/lib/generated/prisma/enums";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export type UpdateOrderStatusState = { error: string } | null;

const VALID_STATUSES = new Set<string>(Object.values(OrderStatus));

export async function updateOrderStatusAction(orderId: string, status: OrderStatus): Promise<UpdateOrderStatusState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Not authorized." };
  }
  if (!VALID_STATUSES.has(status)) {
    return { error: "Invalid status." };
  }

  try {
    await prisma.order.update({ where: { id: orderId }, data: { status } });
  } catch {
    return { error: "Could not update order status." };
  }

  revalidatePath("/admin/orders");
  return null;
}
