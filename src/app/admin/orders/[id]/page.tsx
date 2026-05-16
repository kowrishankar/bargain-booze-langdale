import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, STORE } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";
import { formatPostcode } from "@/lib/postcodes";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, statusHistory: { orderBy: { createdAt: "desc" } }, user: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <p className="text-stone-600">{ORDER_STATUS_LABELS[order.status]}</p>
        <p className="text-sm text-stone-500">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrderStatusForm orderId={order.id} current={order.status} fulfillmentType={order.fulfillmentType} />

        <div className="rounded-2xl bg-white p-4 shadow-sm text-sm space-y-2">
          <h2 className="font-semibold">Customer</h2>
          <p>{order.contactName}</p>
          <p>{order.contactEmail}</p>
          <p>{order.contactPhone}</p>
          <h2 className="pt-2 font-semibold">Fulfilment</h2>
          <p>{order.fulfillmentType === "COLLECTION" ? `Collect: ${STORE.fullAddress}` : "Delivery"}</p>
          {order.addressLine1 && (
            <p>
              {order.addressLine1}
              {order.addressLine2 && `, ${order.addressLine2}`}
              <br />
              {order.city}
              {order.postcode && `, ${formatPostcode(order.postcode)}`}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-2 divide-y divide-stone-100 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>
                {i.productName} × {i.quantity}
              </span>
              <span>{formatGBP(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right font-bold">Total: {formatGBP(order.total)}</p>
      </div>

      <section>
        <h2 className="font-semibold">Status history</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {order.statusHistory.map((h) => (
            <li key={h.id} className="rounded-lg bg-white px-3 py-2 shadow-sm">
              <span className="font-medium">{ORDER_STATUS_LABELS[h.status]}</span>
              <span className="mx-2 text-stone-400">·</span>
              {new Date(h.createdAt).toLocaleString("en-GB")}
              {h.note && <p className="text-stone-500">{h.note}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
