import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart, CART_COOKIE } from "@/lib/cart";
import { priceCartLine, sumCart } from "@/lib/pricing";
import { generateOrderNumber } from "@/lib/orders";
import { normalisePostcode, isValidUkPostcodeFormat } from "@/lib/postcodes";
import { DELIVERY_FEE } from "@/lib/constants";
import { stripe, isStripeEnabled } from "@/lib/stripe";

const schema = z.object({
  fulfillmentType: z.enum(["COLLECTION", "DELIVERY"]),
  paymentMethod: z.enum(["STRIPE", "PAY_IN_STORE"]),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to checkout." }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const cart = await getCart();
    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
    }

    if (body.fulfillmentType === "DELIVERY" && body.paymentMethod !== "STRIPE") {
      return NextResponse.json({ error: "Delivery orders must be paid online." }, { status: 400 });
    }

    if (body.paymentMethod === "STRIPE" && !isStripeEnabled()) {
      return NextResponse.json(
        {
          error:
            body.fulfillmentType === "DELIVERY"
              ? "Online payment is required for delivery. Please try again later or contact the store."
              : "Online payment is not available right now. Please choose pay in store.",
        },
        { status: 503 },
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: cart.items.map((i) => i.productId) },
        archived: false,
      },
      include: { promotion: true },
    });

    const lines = cart.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.stock < item.quantity) return null;
        return priceCartLine({ product, quantity: item.quantity });
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    if (lines.length === 0) {
      return NextResponse.json({ error: "Some items are unavailable." }, { status: 400 });
    }

    let deliveryFee = 0;
    let normalisedPostcode: string | undefined;

    if (body.fulfillmentType === "DELIVERY") {
      if (!body.addressLine1 || !body.city || !body.postcode) {
        return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
      }
      if (!isValidUkPostcodeFormat(body.postcode)) {
        return NextResponse.json({ error: "Invalid postcode." }, { status: 400 });
      }
      normalisedPostcode = normalisePostcode(body.postcode);
      const allowed = await prisma.allowedPostcode.findUnique({
        where: { postcode: normalisedPostcode },
      });
      if (!allowed) {
        return NextResponse.json(
          { error: "We do not deliver to this postcode. Please choose collection or a different address." },
          { status: 400 },
        );
      }
      deliveryFee = DELIVERY_FEE;
    }

    const subtotal = sumCart(lines);
    const total = Math.round((subtotal + deliveryFee) * 100) / 100;
    const orderNumber = generateOrderNumber();
    const payInStore = body.paymentMethod === "PAY_IN_STORE";

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          status: payInStore ? "CONFIRMED" : "PENDING_PAYMENT",
          fulfillmentType: body.fulfillmentType,
          paymentMethod: body.paymentMethod,
          contactName: body.contactName,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          addressLine1: body.addressLine1,
          addressLine2: body.addressLine2,
          city: body.city,
          postcode: normalisedPostcode ?? body.postcode,
          subtotal,
          deliveryFee,
          discount: 0,
          total,
          items: {
            create: lines.map((l) => ({
              productId: l.product.id,
              productName: l.product.name,
              unitPrice: l.unitPrice,
              quantity: l.quantity,
              lineTotal: l.lineTotal,
              promotionApplied: l.promotionLabel,
            })),
          },
          statusHistory: {
            create: {
              status: payInStore ? "CONFIRMED" : "PENDING_PAYMENT",
              note: payInStore ? "Order placed — pay in store when you collect" : "Order placed",
            },
          },
        },
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.product.id },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return created;
    });

    const origin = new URL(request.url).origin;

    if (payInStore) {
      const jar = await cookies();
      jar.delete(CART_COOKIE);

      return NextResponse.json({
        orderId: order.id,
        placed: true,
      });
    }

    const stripeSession = await stripe!.checkout.sessions.create({
      mode: "payment",
      customer_email: body.contactEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Order ${orderNumber}`,
              description: `Bargain Booze Langdale — ${body.fulfillmentType === "DELIVERY" ? "Delivery" : "Collection"}`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order.id, orderNumber },
      success_url: `${origin}/account/orders/${order.id}?paid=1`,
      cancel_url: `${origin}/checkout?cancelled=1`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ checkoutUrl: stripeSession.url, orderId: order.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
