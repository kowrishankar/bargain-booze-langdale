"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { normalisePostcode } from "@/lib/postcodes";
import { deleteLocalProductImage } from "@/lib/product-images";
import type { OrderStatus, PromotionType } from "@/generated/prisma/client";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/account/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");
}

export async function upsertProduct(data: {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  promotionId?: string | null;
  archived?: boolean;
}) {
  await assertAdmin();
  const payload = {
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    category: data.category,
    stock: data.stock,
    imageUrl: data.imageUrl ?? null,
    promotionId: data.promotionId || null,
    archived: data.archived ?? false,
  };

  if (data.id) {
    const existing = await prisma.product.findUnique({
      where: { id: data.id },
      select: { imageUrl: true },
    });
    if (existing?.imageUrl && existing.imageUrl !== payload.imageUrl) {
      await deleteLocalProductImage(existing.imageUrl);
    }
    await prisma.product.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function archiveProduct(id: string, archived: boolean) {
  await assertAdmin();
  await prisma.product.update({ where: { id }, data: { archived } });
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

const promotionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  type: z.enum(["BOGOF", "TWO_FOR_PRICE", "THREE_FOR_PRICE"]),
  dealPrice: z.number().positive().optional(),
  active: z.boolean(),
  productIds: z.array(z.string()).optional(),
});

export async function upsertPromotion(raw: z.infer<typeof promotionSchema>) {
  await assertAdmin();
  const data = promotionSchema.parse(raw);

  if (data.type !== "BOGOF" && !data.dealPrice) {
    throw new Error("Deal price is required for multi-buy promotions");
  }

  let promotionId = data.id;

  if (promotionId) {
    await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        name: data.name,
        type: data.type as PromotionType,
        dealPrice: data.dealPrice ?? null,
        active: data.active,
      },
    });
    await prisma.product.updateMany({
      where: { promotionId },
      data: { promotionId: null },
    });
  } else {
    const promo = await prisma.promotion.create({
      data: {
        name: data.name,
        type: data.type as PromotionType,
        dealPrice: data.dealPrice ?? null,
        active: data.active,
      },
    });
    promotionId = promo.id;
  }

  if (data.productIds?.length) {
    await prisma.product.updateMany({
      where: { id: { in: data.productIds } },
      data: { promotionId },
    });
  }

  revalidatePath("/admin/promotions");
  revalidatePath("/shop");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  await assertAdmin();
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status } }),
    prisma.orderStatusHistory.create({
      data: { orderId, status, note: note ?? `Status updated to ${status}` },
    }),
  ]);
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
}

export async function addAllowedPostcode(postcode: string, area?: string) {
  await assertAdmin();
  const normalised = normalisePostcode(postcode);
  await prisma.allowedPostcode.upsert({
    where: { postcode: normalised },
    create: { postcode: normalised, area },
    update: { area },
  });
  revalidatePath("/admin/postcodes");
}

export async function removeAllowedPostcode(id: string) {
  await assertAdmin();
  await prisma.allowedPostcode.delete({ where: { id } });
  revalidatePath("/admin/postcodes");
}
