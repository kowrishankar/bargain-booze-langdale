import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, STORE } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";
import { formatPostcode } from "@/lib/postcodes";
import { OrderStatusTracker } from "@/components/orders/OrderStatusTracker";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string; placed?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const { id } = await params;
  const { paid, placed } = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <ClearCartOnSuccess shouldClear={paid === "1" || placed === "1"} />
      <Link href="/account/orders" className="text-sm text-brand hover:underline">
        ← All orders
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{order.orderNumber}</h1>
      <p className="text-stone-600">{ORDER_STATUS_LABELS[order.status]}</p>
      <p className="mt-1 text-sm text-stone-500">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>

      {paid === "1" && order.status !== "PENDING_PAYMENT" && (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Thank you! Your payment was successful. We&apos;ll prepare your order shortly.
        </p>
      )}

      {placed === "1" && order.paymentMethod === "PAY_IN_STORE" && (
        <p className="mt-4 rounded-xl bg-brand-light px-4 py-3 text-sm text-stone-800">
          Your order is confirmed. Please pay {formatGBP(order.total)} when you collect from the store.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-semibold text-stone-900">Order progress</h2>
        <div className="mt-4">
          <OrderStatusTracker
            current={order.status}
            fulfillmentType={order.fulfillmentType}
            history={order.statusHistory}
          />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-3 divide-y divide-stone-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.productName} × {item.quantity}
                {item.promotionApplied && (
                  <span className="ml-1 text-brand">({item.promotionApplied})</span>
                )}
              </span>
              <span className="font-medium">{formatGBP(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-stone-200 pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatGBP(order.subtotal)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatGBP(order.deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatGBP(order.total)}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 text-sm">
        <h2 className="font-semibold">Contact &amp; fulfilment</h2>
        <p className="mt-2">{order.contactName}</p>
        <p>{order.contactEmail}</p>
        <p>{order.contactPhone}</p>
        <p className="mt-3 font-medium">
          {order.fulfillmentType === "COLLECTION" ? "Collect in store" : "Home delivery"}
        </p>
        {order.fulfillmentType === "COLLECTION" ? (
          <p className="text-stone-600">{STORE.fullAddress}</p>
        ) : (
          <p className="text-stone-600">
            {order.addressLine1}
            {order.addressLine2 && `, ${order.addressLine2}`}
            <br />
            {order.city}
            {order.postcode && `, ${formatPostcode(order.postcode)}`}
          </p>
        )}
      </section>
    </div>
  );
}
