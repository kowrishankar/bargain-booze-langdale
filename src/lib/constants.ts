export const BRAND = {
  red: "#E31E24",
  redDark: "#C4191E",
  redLight: "#FEF2F2",
} as const;

export const STORE = {
  name: "Bargain Booze",
  tagline: "LANGDALE ROAD",
  address: "62 Langdale Rd",
  city: "Dunstable",
  postcode: "LU6 3BS",
  fullAddress: "62 Langdale Rd, Dunstable LU6 3BS",
  phone: "01582 000000",
  email: "orders@bargainbooze-langdale.co.uk",
  openingHours: "Mon–Sun 7am–10pm",
} as const;

export const DELIVERY_FEE = 2.99;

export const CATEGORIES = [
  "Beer & Lager",
  "Wine & Spirits",
  "Cider",
  "Soft Drinks",
  "Snacks & Confectionery",
  "Grocery",
  "Tobacco & Vapes",
  "Household",
] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  STRIPE: "Paid online (Stripe)",
  PAY_IN_STORE: "Pay in store on collection",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Order confirmed",
  PREPARING: "Being prepared",
  OUT_FOR_DELIVERY: "Out for delivery",
  READY_FOR_COLLECTION: "Ready to collect",
  DELIVERED: "Delivered",
  COLLECTED: "Collected",
  CANCELLED: "Cancelled",
};

export const PROMOTION_TYPE_LABELS: Record<string, string> = {
  BOGOF: "Buy one get one free",
  TWO_FOR_PRICE: "2 for a set price",
  THREE_FOR_PRICE: "3 for a set price",
};

export const WELCOME_OFFER = {
  discountPercent: 10,
  headline: "10% off your first order",
  description:
    "Join Bargain Booze online — create a free account and save on your first shop. Collection or local delivery.",
  perks: [
    "Quick checkout with saved details",
    "Track orders from your account",
    "Exclusive deals & promotions",
  ],
  terms: "New registered customers only. One use per account on first completed order. Cannot be combined with other offers.",
} as const;
