"use client";

import { useEffect, useRef } from "react";
import { clearCart } from "@/lib/cart-actions";

type Props = {
  shouldClear: boolean;
};

/** Clears the basket cookie after checkout — must run on the client (server action). */
export function ClearCartOnSuccess({ shouldClear }: Props) {
  const cleared = useRef(false);

  useEffect(() => {
    if (!shouldClear || cleared.current) return;
    cleared.current = true;
    void clearCart();
  }, [shouldClear]);

  return null;
}
