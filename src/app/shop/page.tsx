import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { category, q } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      archived: false,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { category: { contains: q } },
            ],
          }
        : {}),
    },
    include: { promotion: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="brand-display text-3xl sm:text-4xl">Shop</h1>
      <p className="mt-2 text-stone-600">Browse our range and add to your basket.</p>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="flex-1 rounded-xl border border-stone-300 px-4 py-2.5"
        />
        <button type="submit" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold italic text-white hover:bg-brand-dark">
          Search
        </button>
      </form>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Link
          href="/shop"
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${!category ? "bg-brand text-white" : "bg-stone-200 text-stone-700"}`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/shop?category=${encodeURIComponent(cat)}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${category === cat ? "bg-brand text-white" : "bg-stone-200 text-stone-700"}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">No products found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
