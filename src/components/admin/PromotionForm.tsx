"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PROMOTION_TYPE_LABELS } from "@/lib/constants";
import { upsertPromotion } from "@/lib/admin-actions";
import type { Product, Promotion } from "@/generated/prisma/client";

type Props = {
  promotion?: Promotion & { products: Product[] };
  products: Product[];
};

export function PromotionForm({ promotion, products }: Props) {
  const router = useRouter();
  const [type, setType] = useState(promotion?.type ?? "BOGOF");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const productIds = products.filter((p) => form.get(`product-${p.id}`) === "on").map((p) => p.id);
    await upsertPromotion({
      id: promotion?.id,
      name: String(form.get("name")),
      type: type as "BOGOF" | "TWO_FOR_PRICE" | "THREE_FOR_PRICE",
      dealPrice: form.get("dealPrice") ? parseFloat(String(form.get("dealPrice"))) : undefined,
      active: form.get("active") === "on",
      productIds,
    });
    router.push("/admin/promotions");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <Input label="Promotion name" name="name" required defaultValue={promotion?.name} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        >
          {Object.entries(PROMOTION_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      {type !== "BOGOF" && (
        <Input label="Deal price (£)" name="dealPrice" type="number" step="0.01" min="0" defaultValue={promotion?.dealPrice ?? ""} required />
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={promotion?.active ?? true} />
        Active
      </label>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Apply to products</legend>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`product-${p.id}`}
                defaultChecked={promotion?.products.some((pp) => pp.id === p.id)}
              />
              {p.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save promotion"}
      </Button>
    </form>
  );
}
