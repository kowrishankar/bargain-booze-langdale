import type { Promotion } from "@/generated/prisma/client";

export function isPromotionActive(promo: Promotion, now = new Date()): boolean {
  if (!promo.active) return false;
  if (promo.startDate && promo.startDate > now) return false;
  if (promo.endDate && promo.endDate < now) return false;
  return true;
}
