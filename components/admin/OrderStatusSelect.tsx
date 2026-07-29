"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { OrderStatus } from "@/lib/generated/prisma/enums";

const STATUS_OPTIONS = Object.values(OrderStatus);

const STATUS_TEXT_TONE: Record<OrderStatus, string> = {
  PENDING: "text-ink-soft",
  PAID: "text-ok",
  FULFILLED: "text-accent",
  CANCELLED: "text-ink-faint",
  REFUNDED: "text-urgent",
};

interface OrderStatusSelectProps {
  orderId: string;
  status: OrderStatus;
}

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as OrderStatus;
    const previous = current;
    setCurrent(next);
    setError(null);

    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
      if (result?.error) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={current}
        onChange={handleChange}
        disabled={isPending}
        className={`border border-line-strong bg-surface py-1 pl-2 pr-6 font-mono text-[0.62rem] font-bold uppercase tracking-[0.05em] disabled:opacity-60 ${STATUS_TEXT_TONE[current]}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-[0.65rem] text-urgent">{error}</span> : null}
    </div>
  );
}
