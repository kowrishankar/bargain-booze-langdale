"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateOrderStatus } from "@/lib/admin-actions";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { FulfillmentType, OrderStatus } from "@/generated/prisma/client";
import { Button } from "@/components/ui/Button";

const COLLECTION_STATUSES: OrderStatus[] = ["CONFIRMED", "PREPARING", "READY_FOR_COLLECTION", "COLLECTED", "CANCELLED"];
const DELIVERY_STATUSES: OrderStatus[] = ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

type Props = {
  orderId: string;
  current: OrderStatus;
  fulfillmentType: FulfillmentType;
};

export function OrderStatusForm({ orderId, current, fulfillmentType }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const options = fulfillmentType === "DELIVERY" ? DELIVERY_STATUSES : COLLECTION_STATUSES;

  return (
    <form
      className="space-y-3 rounded-2xl bg-white p-4 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateOrderStatus(orderId, status, note || undefined);
        router.refresh();
        setLoading(false);
      }}
    >
      <label className="block text-sm">
        <span className="font-medium">Update status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium">Note (optional)</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          placeholder="e.g. Left with neighbour"
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating…" : "Update order"}
      </Button>
    </form>
  );
}
