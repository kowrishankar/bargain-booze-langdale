import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone-100">
                <td className="p-3 font-medium">{o.orderNumber}</td>
                <td className="p-3">
                  <p>{o.contactName}</p>
                  <p className="text-xs text-stone-500">{o.contactPhone}</p>
                </td>
                <td className="p-3">{o.fulfillmentType === "DELIVERY" ? "Delivery" : "Collection"}</td>
                <td className="p-3">{ORDER_STATUS_LABELS[o.status]}</td>
                <td className="p-3">{formatGBP(o.total)}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
