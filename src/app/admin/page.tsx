import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";

export default async function AdminDashboard() {
  const [orderCount, productCount, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { archived: false } }),
    prisma.order.findMany({
      where: { status: { in: ["CONFIRMED", "PREPARING"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Total orders</p>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Active products</p>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="font-semibold">Orders needing attention</h2>
        {pendingOrders.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No pending orders.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {pendingOrders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="block rounded-xl bg-white p-3 text-sm shadow-sm hover:ring-2 hover:ring-brand/30">
                  <span className="font-medium">{o.orderNumber}</span>
                  <span className="mx-2 text-stone-400">·</span>
                  {ORDER_STATUS_LABELS[o.status]}
                  <span className="float-right font-medium">{formatGBP(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

