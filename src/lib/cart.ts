import { cookies } from "next/headers";

export const CART_COOKIE = "bb_cart";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export async function getCart(): Promise<CartState> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE)?.value;
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

export function cartItemCount(cart: CartState): number {
  return cart.items.reduce((s, i) => s + i.quantity, 0);
}
