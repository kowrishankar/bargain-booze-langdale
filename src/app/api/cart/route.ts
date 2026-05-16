import { NextResponse } from "next/server";
import { z } from "zod";
import { CART_COOKIE, type CartState } from "@/lib/cart";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(0).max(99),
    }),
  ),
});

export async function GET(request: Request) {
  const cart = request.headers.get("x-cart");
  if (!cart) {
    return NextResponse.json({ items: [] } satisfies CartState);
  }
  try {
    return NextResponse.json(JSON.parse(cart) as CartState);
  } catch {
    return NextResponse.json({ items: [] } satisfies CartState);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const items = data.items.filter((i) => i.quantity > 0);

    const response = NextResponse.json({ items } satisfies CartState);
    response.cookies.set(CART_COOKIE, JSON.stringify({ items }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }
}
