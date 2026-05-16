import Link from "next/link";
import { loadPricedCart } from "@/lib/cart-actions";
import { formatGBP } from "@/lib/pricing";
import { CartLineControls } from "@/components/cart/CartLineControls";
import { Button } from "@/components/ui/Button";

export default async function CartPage() {
  const { lines, subtotal } = await loadPricedCart();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Your basket</h1>

      {lines.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-stone-500">Your basket is empty.</p>
          <Link href="/shop" className="mt-4 inline-block font-medium text-brand hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {lines.map((line) => (
              <CartLineControls
                key={line.product.id}
                productId={line.product.id}
                name={line.product.name}
                quantity={line.quantity}
                lineTotal={line.lineTotal}
                promotionLabel={line.promotionLabel}
              />
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-stone-100 p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatGBP(subtotal)}</span>
            </div>
            <Link href="/checkout" className="mt-4 block">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
