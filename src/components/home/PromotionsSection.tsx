import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";
import type { Product, Promotion } from "@/generated/prisma/client";
import { PROMOTION_TYPE_LABELS } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";

export type PromotionWithProducts = Promotion & { products: Product[] };

function promotionSummary(promo: PromotionWithProducts): string {
  switch (promo.type) {
    case "BOGOF":
      return PROMOTION_TYPE_LABELS.BOGOF;
    case "TWO_FOR_PRICE":
      return promo.dealPrice != null
        ? `2 for ${formatGBP(promo.dealPrice)}`
        : PROMOTION_TYPE_LABELS.TWO_FOR_PRICE;
    case "THREE_FOR_PRICE":
      return promo.dealPrice != null
        ? `3 for ${formatGBP(promo.dealPrice)}`
        : PROMOTION_TYPE_LABELS.THREE_FOR_PRICE;
    default:
      return promo.name;
  }
}

type Props = {
  promotions: PromotionWithProducts[];
};

export function PromotionsSection({ promotions }: Props) {
  if (promotions.length === 0) return null;

  return (
    <section id="offers" className="border-y-4 border-brand bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-2 border-l-4 border-brand pl-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand">In-store deals · online too</p>
            <h2 className="brand-display text-2xl sm:text-3xl">Current promotions</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-brand hover:underline">
            Shop all offers →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <article
              key={promo.id}
              className="group relative overflow-hidden rounded-lg border-2 border-stone-100 bg-white shadow-sm transition hover:border-brand/50 hover:shadow-md"
            >
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand opacity-10"
                aria-hidden
              />
              <div className="relative p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1 text-xs font-black italic tracking-tight text-white">
                    <Tag className="h-3.5 w-3.5" />
                    Offer
                  </span>
                  <p className="text-right text-lg font-black text-brand">{promotionSummary(promo)}</p>
                </div>
                <h3 className="mt-3 text-lg font-bold text-stone-900">{promo.name}</h3>
                <p className="mt-1 text-sm text-stone-600">{PROMOTION_TYPE_LABELS[promo.type]}</p>

                {promo.products.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {promo.products.slice(0, 3).map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.id}`}
                          className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 py-1 pl-1 pr-2 text-xs font-semibold text-stone-800 transition hover:border-brand hover:bg-brand-light"
                        >
                          {p.imageUrl ? (
                            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-white">
                              <Image src={p.imageUrl} alt="" fill className="object-contain p-0.5" sizes="32px" />
                            </span>
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded bg-white text-sm">🛒</span>
                          )}
                          <span className="line-clamp-1 max-w-[8rem]">{p.name}</span>
                        </Link>
                      </li>
                    ))}
                    {promo.products.length > 3 && (
                      <li className="flex items-center px-2 text-xs font-medium text-stone-500">
                        +{promo.products.length - 3} more
                      </li>
                    )}
                  </ul>
                )}

                <Link
                  href="/shop"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand group-hover:underline"
                >
                  View in shop
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
