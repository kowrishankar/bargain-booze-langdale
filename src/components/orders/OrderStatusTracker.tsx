import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus, OrderStatusHistory } from "@/generated/prisma/client";
import { Check } from "lucide-react";

type Props = {
  current: OrderStatus;
  fulfillmentType: "COLLECTION" | "DELIVERY";
  history: OrderStatusHistory[];
};

export function OrderStatusTracker({ current, fulfillmentType, history }: Props) {
  const steps =
    fulfillmentType === "DELIVERY"
      ? (["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"] as OrderStatus[])
      : (["CONFIRMED", "PREPARING", "READY_FOR_COLLECTION", "COLLECTED"] as OrderStatus[]);

  const reached = new Set(history.map((h) => h.status));
  reached.add(current);

  if (current === "CANCELLED" || current === "PENDING_PAYMENT") {
    return (
      <p className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
        {ORDER_STATUS_LABELS[current]}
      </p>
    );
  }

  const currentIdx = steps.indexOf(current);

  return (
    <ol className="space-y-0">
      {steps.map((status, i) => {
        const done = reached.has(status) && (currentIdx >= i || current === status);
        const active = current === status;
        return (
          <li key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  done ? "bg-brand text-white" : "bg-stone-200 text-stone-500"
                } ${active ? "ring-2 ring-brand ring-offset-2" : ""}`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className={`my-1 h-8 w-0.5 ${done ? "bg-brand" : "bg-stone-200"}`} />
              )}
            </div>
            <div className="pb-6 pt-1">
              <p className={`text-sm font-medium ${active ? "text-brand" : "text-stone-700"}`}>
                {ORDER_STATUS_LABELS[status]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
