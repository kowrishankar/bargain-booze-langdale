import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const LU6_POSTCODES = [
  { postcode: "LU63BS", area: "Langdale Rd, Dunstable" },
  { postcode: "LU61AE", area: "Dunstable town" },
  { postcode: "LU61BH", area: "Dunstable" },
  { postcode: "LU62AD", area: "Dunstable" },
  { postcode: "LU63AG", area: "Dunstable" },
  { postcode: "LU64GG", area: "Dunstable" },
  { postcode: "LU67RX", area: "Dunstable / Houghton Regis" },
  { postcode: "LU54PT", area: "Nearby LU5" },
];

async function main() {
  const adminHash = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@bargainbooze-langdale.co.uk" },
    update: {},
    create: {
      email: "admin@bargainbooze-langdale.co.uk",
      passwordHash: adminHash,
      name: "Store Admin",
      phone: "01582000000",
      role: "ADMIN",
    },
  });

  for (const pc of LU6_POSTCODES) {
    await prisma.allowedPostcode.upsert({
      where: { postcode: pc.postcode },
      update: { area: pc.area },
      create: pc,
    });
  }

  const bogof = await prisma.promotion.upsert({
    where: { id: "seed-bogof" },
    update: {},
    create: {
      id: "seed-bogof",
      name: "BOGOF Crisps",
      type: "BOGOF",
      active: true,
    },
  });

  const twoFor = await prisma.promotion.upsert({
    where: { id: "seed-2for" },
    update: {},
    create: {
      id: "seed-2for",
      name: "2 for £5",
      type: "TWO_FOR_PRICE",
      dealPrice: 5,
      active: true,
    },
  });

  const products = [
    {
      name: "Stella Artois 4×440ml",
      description: "Premium lager cans. 18+ only.",
      price: 6.49,
      category: "Beer & Lager",
      stock: 48,
      imageUrl: "https://images.unsplash.com/photo-1608270586620-248804c7d855?w=400&h=400&fit=crop",
    },
    {
      name: "Strongbow Original 2L",
      description: "Classic apple cider.",
      price: 4.29,
      category: "Cider",
      stock: 36,
      imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdabbb3d2?w=400&h=400&fit=crop",
    },
    {
      name: "Hardys Shiraz 75cl",
      description: "Australian red wine.",
      price: 7.99,
      category: "Wine & Spirits",
      stock: 24,
      promotionId: twoFor.id,
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41e2bd2722f3?w=400&h=400&fit=crop",
    },
    {
      name: "Walkers Cheese & Onion",
      description: "32.5g crisps",
      price: 1.1,
      category: "Snacks & Confectionery",
      stock: 80,
      promotionId: bogof.id,
    },
    {
      name: "Coca-Cola 2L",
      description: "Original taste",
      price: 2.49,
      category: "Soft Drinks",
      stock: 60,
    },
    {
      name: "Warburtons Toastie 800g",
      description: "Thick sliced white bread",
      price: 1.39,
      category: "Grocery",
      stock: 20,
    },
    {
      name: "Red Bull 250ml",
      description: "Energy drink",
      price: 1.75,
      category: "Soft Drinks",
      stock: 40,
    },
    {
      name: "Gordon's Gin 70cl",
      description: "London dry gin. 18+ only.",
      price: 16.99,
      category: "Wine & Spirits",
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop",
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.product.create({ data: p });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login: admin@bargainbooze-langdale.co.uk / Admin123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
