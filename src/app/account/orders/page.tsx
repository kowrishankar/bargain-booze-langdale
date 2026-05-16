import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";
import { formatPostcode } from "@/lib/postcodes";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Your orders</h1>
      {orders.length === 0 ? (
        <p className="mt-8 text-stone-500">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 hover:border-brand/40"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-semibold">{order.orderNumber}</span>
                  <span className="text-sm text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{ORDER_STATUS_LABELS[order.status]}</p>
                <p className="mt-2 font-medium">{formatGBP(order.total)}</p>
                {order.postcode && (
                  <p className="text-xs text-stone-500">
                    {order.fulfillmentType === "DELIVERY" ? "Delivery" : "Collection"}
                    {order.postcode && ` · ${formatPostcode(order.postcode)}`}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
