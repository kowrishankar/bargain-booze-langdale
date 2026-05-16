import type { Product, Promotion } from "@/generated/prisma/client";

export type CartLine = {
  product: Product & { promotion: Promotion | null };
  quantity: number;
};

export type PricedLine = CartLine & {
  unitPrice: number;
  lineTotal: number;
  promotionLabel: string | null;
};

export function priceCartLine(line: CartLine): PricedLine {
  const { product, quantity } = line;
  const base = product.price;
  const promo = product.promotion;

  if (!promo?.active) {
    return {
      ...line,
      unitPrice: base,
      lineTotal: round(base * quantity),
      promotionLabel: null,
    };
  }

  const now = new Date();
  if (promo.startDate && promo.startDate > now) {
    return defaultPrice(line, base);
  }
  if (promo.endDate && promo.endDate < now) {
    return defaultPrice(line, base);
  }

  switch (promo.type) {
    case "BOGOF": {
      const chargeable = Math.ceil(quantity / 2);
      return {
        ...line,
        unitPrice: base,
        lineTotal: round(base * chargeable),
        promotionLabel: promo.name,
      };
    }
    case "TWO_FOR_PRICE": {
      if (!promo.dealPrice) return defaultPrice(line, base);
      const sets = Math.floor(quantity / 2);
      const remainder = quantity % 2;
      const total = sets * promo.dealPrice + remainder * base;
      return {
        ...line,
        unitPrice: base,
        lineTotal: round(total),
        promotionLabel: promo.name,
      };
    }
    case "THREE_FOR_PRICE": {
      if (!promo.dealPrice) return defaultPrice(line, base);
      const sets = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      const total = sets * promo.dealPrice + remainder * base;
      return {
        ...line,
        unitPrice: base,
        lineTotal: round(total),
        promotionLabel: promo.name,
      };
    }
    default:
      return defaultPrice(line, base);
  }
}

function defaultPrice(line: CartLine, base: number): PricedLine {
  return {
    ...line,
    unitPrice: base,
    lineTotal: round(base * line.quantity),
    promotionLabel: null,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export function sumCart(lines: PricedLine[]): number {
  return round(lines.reduce((s, l) => s + l.lineTotal, 0));
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
