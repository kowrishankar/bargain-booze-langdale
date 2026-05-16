"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartQuantity, removeFromCart } from "@/lib/cart-actions";
import { formatGBP } from "@/lib/pricing";

type Props = {
  productId: string;
  name: string;
  quantity: number;
  lineTotal: number;
  promotionLabel?: string | null;
};

export function CartLineControls({ productId, name, quantity, lineTotal, promotionLabel }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <li className={`flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 ${pending ? "opacity-60" : ""}`}>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900 truncate">{name}</p>
        {promotionLabel && <p className="text-xs text-brand">{promotionLabel}</p>}
        <p className="mt-1 font-semibold">{formatGBP(lineTotal)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 rounded-full border border-stone-200">
          <button
            type="button"
            className="p-2"
            onClick={() => startTransition(() => updateCartQuantity(productId, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            className="p-2"
            onClick={() => startTransition(() => updateCartQuantity(productId, quantity + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          className="text-stone-400 hover:text-red-600"
          onClick={() => startTransition(() => removeFromCart(productId))}
          aria-label={`Remove ${name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
