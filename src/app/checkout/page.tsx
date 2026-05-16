import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { loadPricedCart } from "@/lib/cart-actions";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { prisma } from "@/lib/prisma";
import { isStripeEnabled } from "@/lib/stripe";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/account/login?callbackUrl=/checkout");
  }

  const { lines, subtotal } = await loadPricedCart();
  if (lines.length === 0) {
    redirect("/cart");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
      <Link href="/cart" className="mt-1 inline-block text-sm text-brand hover:underline">
        ← Back to basket
      </Link>
      <div className="mt-6">
        <CheckoutForm
          subtotal={subtotal}
          stripeEnabled={isStripeEnabled()}
          defaultName={user?.name ?? session.user.name ?? ""}
          defaultEmail={user?.email ?? session.user.email ?? ""}
          defaultPhone={user?.phone ?? ""}
        />
      </div>
    </div>
  );
}
