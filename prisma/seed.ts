import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getDatabaseUrl } from "../src/lib/db-url";

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 60_000,
  max: 1,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function dbHost(): string {
  try {
    return new URL(getDatabaseUrl().replace(/^postgresql:/, "http:")).hostname;
  } catch {
    return "(invalid DATABASE_URL)";
  }
}

async function assertDatabaseReachable() {
  try {
    await pool.query("SELECT 1");
  } catch {
    console.error(`
Cannot connect to Postgres at: ${dbHost()}

Common fixes:
  1. Copy a fresh pooled connection string from https://console.neon.tech
     (project: bargain-booze-langdale) into .env as DATABASE_URL
  2. Remove channel_binding from the URL if present
  3. Ensure the Neon project is not deleted (old hosts like ep-raspy-rice-* will time out)
  4. If you are on a restricted network, try another connection or seed via Neon SQL editor
`);
    throw new Error("Database connection failed");
  }
}

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

const PRODUCTS = [
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
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41e2bd2722f3?w=400&h=400&fit=crop",
    promotionKey: "2for" as const,
  },
  {
    name: "Walkers Cheese & Onion",
    description: "32.5g crisps",
    price: 1.1,
    category: "Snacks & Confectionery",
    stock: 80,
    promotionKey: "bogof" as const,
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

async function main() {
  console.log(`Connecting to ${dbHost()}…`);
  await assertDatabaseReachable();

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
  console.log("✓ Admin user");

  for (const pc of LU6_POSTCODES) {
    await prisma.allowedPostcode.upsert({
      where: { postcode: pc.postcode },
      update: { area: pc.area },
      create: pc,
    });
  }
  console.log("✓ Delivery postcodes");

  const bogof = await prisma.promotion.upsert({
    where: { id: "seed-bogof" },
    update: { active: true },
    create: {
      id: "seed-bogof",
      name: "BOGOF Crisps",
      type: "BOGOF",
      active: true,
    },
  });

  const twoFor = await prisma.promotion.upsert({
    where: { id: "seed-2for" },
    update: { active: true },
    create: {
      id: "seed-2for",
      name: "2 for £5",
      type: "TWO_FOR_PRICE",
      dealPrice: 5,
      active: true,
    },
  });
  console.log("✓ Promotions");

  const promoIds = { bogof: bogof.id, "2for": twoFor.id };

  let created = 0;
  let updated = 0;

  for (const item of PRODUCTS) {
    const { promotionKey, ...data } = item;
    const promotionId =
      promotionKey === "bogof" ? promoIds.bogof : promotionKey === "2for" ? promoIds["2for"] : null;

    const existing = await prisma.product.findFirst({ where: { name: data.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { ...data, promotionId, archived: false },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: { ...data, promotionId, archived: false },
      });
      created++;
    }
  }

  const total = await prisma.product.count();
  console.log(`✓ Products: ${created} created, ${updated} updated (${total} total in database)`);
  console.log("\nSeed complete.");
  console.log("Admin login: admin@bargainbooze-langdale.co.uk / Admin123!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
