import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PROMOTION_TYPE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { formatGBP } from "@/lib/pricing";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Link href="/admin/promotions/new">
          <Button>Create promotion</Button>
        </Link>
      </div>
      <ul className="mt-6 space-y-3">
        {promotions.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-stone-600">
                  {PROMOTION_TYPE_LABELS[p.type]}
                  {p.dealPrice != null && ` · ${formatGBP(p.dealPrice)}`}
                </p>
                <p className="text-xs text-stone-500">{p._count.products} products · {p.active ? "Active" : "Inactive"}</p>
              </div>
              <Link href={`/admin/promotions/${p.id}`} className="text-sm text-brand hover:underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
