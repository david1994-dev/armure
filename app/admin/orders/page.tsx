import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orders | TeeWorld Admin",
  robots: { index: false, follow: false },
};

type BadgeTone = "default" | "ok" | "accent" | "urgent";

const paymentStatusTone: Record<string, BadgeTone> = {
  PENDING: "default",
  SUCCEEDED: "ok",
  FAILED: "urgent",
  REFUNDED: "urgent",
};

const PAGE_SIZE = 20;

interface AdminOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { page: pageParam } = await searchParams;
  const requestedPage = Number(pageParam);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const totalOrders = await prisma.order.count();
  const totalPages = Math.max(1, Math.ceil(totalOrders / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      shippingAddress: true,
      user: { select: { username: true } },
    },
  });

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-[-0.01em]">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {totalOrders} total &middot; page {currentPage} of {totalPages}
      </p>

      <div className="mt-6 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-strong bg-surface-2 text-left font-mono text-[0.65rem] uppercase tracking-[0.06em] text-ink-faint">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const payment = order.payments[0];
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <tr key={order.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {order.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span>{order.shippingAddress.fullName}</span>
                    {order.user ? (
                      <span className="block text-xs text-ink-faint">@{order.user.username}</span>
                    ) : (
                      <span className="block text-xs text-ink-faint">Guest</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{itemCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <PriceTag amount={Number(order.total)} />
                  </td>
                  <td className="px-4 py-3">
                    {payment ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs capitalize text-ink-soft">{payment.provider}</span>
                        <Badge tone={paymentStatusTone[payment.status] ?? "default"} shape="pill">
                          {payment.status}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-faint">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-faint">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.06em]">
          {currentPage > 1 ? (
            <Link
              href={`/admin/orders?page=${currentPage - 1}`}
              className="border border-line-strong px-4 py-2 transition-colors hover:border-ink"
            >
              &larr; Prev
            </Link>
          ) : (
            <span className="border border-line px-4 py-2 text-ink-faint">&larr; Prev</span>
          )}
          <span className="text-ink-soft">
            Page {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={`/admin/orders?page=${currentPage + 1}`}
              className="border border-line-strong px-4 py-2 transition-colors hover:border-ink"
            >
              Next &rarr;
            </Link>
          ) : (
            <span className="border border-line px-4 py-2 text-ink-faint">Next &rarr;</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
