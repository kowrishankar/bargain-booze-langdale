"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE, type CartItem, type CartState, getCart } from "@/lib/cart";
import { priceCartLine, sumCart, type CartLine } from "@/lib/pricing";

async function saveCart(items: CartItem[]) {
  const jar = await cookies();
  jar.set(CART_COOKIE, JSON.stringify({ items: items.filter((i) => i.quantity > 0) }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  revalidatePath("/", "layout");
}

export async function addToCart(productId: string, quantity = 1) {
  const cart = await getCart();
  const existing = cart.items.find((i) => i.productId === productId);
  const items = existing
    ? cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i,
      )
    : [...cart.items, { productId, quantity }];
  await saveCart(items);
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const cart = await getCart();
  const items =
    quantity <= 0
      ? cart.items.filter((i) => i.productId !== productId)
      : cart.items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
  await saveCart(items);
}

export async function removeFromCart(productId: string) {
  const cart = await getCart();
  await saveCart(cart.items.filter((i) => i.productId !== productId));
}

export async function clearCart() {
  await saveCart([]);
}

export async function loadPricedCart(): Promise<{
  cart: CartState;
  lines: ReturnType<typeof priceCartLine>[];
  subtotal: number;
}> {
  const cart = await getCart();
  if (cart.items.length === 0) {
    return { cart, lines: [], subtotal: 0 };
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: cart.items.map((i) => i.productId) },
      archived: false,
    },
    include: { promotion: true },
  });

  const lines: CartLine[] = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter((l): l is CartLine => l !== null);

  const priced = lines.map(priceCartLine);
  return { cart, lines: priced, subtotal: sumCart(priced) };
}
