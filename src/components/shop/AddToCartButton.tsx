"use client";

import { useTransition } from "react";
import { Plus } from "lucide-react";
import { addToCart } from "@/lib/cart-actions";

type Props = {
  productId: string;
  disabled?: boolean;
  label?: string;
};

export function AddToCartButton({ productId, disabled, label }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() => startTransition(() => addToCart(productId))}
      className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-xs font-bold italic tracking-tight text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-40 sm:text-sm"
    >
      <Plus className="h-4 w-4" />
      {label ?? (pending ? "Adding…" : "Add")}
    </button>
  );
}
