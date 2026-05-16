import Link from "next/link";
import Image from "next/image";
import type { Product, Promotion } from "@/generated/prisma/client";
import { formatGBP } from "@/lib/pricing";
import { PROMOTION_TYPE_LABELS } from "@/lib/constants";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

type Props = {
  product: Product & { promotion: Promotion | null };
};

export function ProductCard({ product }: Props) {
  const promo = product.promotion?.active ? product.promotion : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border-2 border-stone-100 bg-white shadow-sm transition hover:border-brand/40 hover:shadow-md">
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-stone-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-stone-300">🛒</div>
        )}
        {promo && (
          <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-1 text-xs font-black italic tracking-tight text-white">
            Offer
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-bold text-stone-900">{product.name}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-stone-500">{product.category}</p>
        {promo && (
          <p className="mt-1 text-xs font-bold text-brand">
            {PROMOTION_TYPE_LABELS[promo.type] ?? promo.name}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-lg font-black text-brand">{formatGBP(product.price)}</p>
          <AddToCartButton productId={product.id} disabled={product.stock < 1} />
        </div>
        {product.stock < 1 && <p className="mt-1 text-xs font-semibold text-red-600">Out of stock</p>}
      </div>
    </article>
  );
}
