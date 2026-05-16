import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/pricing";
import { PROMOTION_TYPE_LABELS } from "@/lib/constants";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, archived: false },
    include: { promotion: true },
  });
  if (!product) notFound();

  const promo = product.promotion?.active ? product.promotion : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/shop" className="text-sm text-brand hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl text-stone-300">🛒</div>
          )}
        </div>
        <div>
          <p className="text-sm text-stone-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-black text-stone-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-black text-brand">{formatGBP(product.price)}</p>
          {promo && (
            <p className="mt-2 rounded-lg border-l-4 border-brand bg-brand-light px-3 py-2 text-sm font-bold text-brand">
              {promo.name}: {PROMOTION_TYPE_LABELS[promo.type]}
              {promo.dealPrice != null && ` — ${formatGBP(promo.dealPrice)}`}
            </p>
          )}
          {product.description && <p className="mt-4 text-stone-600">{product.description}</p>}
          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={product.stock < 1} label="Add to basket" />
          </div>
          {product.stock < 1 ? (
            <p className="mt-2 text-sm text-red-600">Currently out of stock</p>
          ) : (
            <p className="mt-2 text-sm text-stone-500">{product.stock} in stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
