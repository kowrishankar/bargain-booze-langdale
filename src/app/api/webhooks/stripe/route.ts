import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order && order.status === "PENDING_PAYMENT") {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CONFIRMED",
              stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            },
          }),
          prisma.orderStatusHistory.create({
            data: { orderId, status: "CONFIRMED", note: "Payment received via Stripe" },
          }),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
