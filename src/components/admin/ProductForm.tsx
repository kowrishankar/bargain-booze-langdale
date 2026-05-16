"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import { upsertProduct, archiveProduct } from "@/lib/admin-actions";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import type { Product, Promotion } from "@/generated/prisma/client";

type Props = {
  product?: Product & { promotion: Promotion | null };
  promotions: Promotion[];
};

export function ProductForm({ product, promotions }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await upsertProduct({
        id: product?.id,
        name: String(form.get("name")),
        description: String(form.get("description") || ""),
        price: parseFloat(String(form.get("price"))),
        category: String(form.get("category")),
        stock: parseInt(String(form.get("stock")), 10),
        imageUrl: imageUrl || String(form.get("imageUrl") || ""),
        promotionId: String(form.get("promotionId") || "") || null,
        archived: form.get("archived") === "on",
      });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <Input label="Name" name="name" required defaultValue={product?.name} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-stone-700">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </label>
      <Input label="Price (£)" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-stone-700">Category</span>
        <select name="category" defaultValue={product?.category ?? CATEGORIES[0]} className="w-full rounded-xl border border-stone-300 px-3 py-2">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <Input label="Stock" name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} />

      <ProductImageUpload value={imageUrl} onChange={setImageUrl} />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-stone-700">Promotion</span>
        <select name="promotionId" defaultValue={product?.promotionId ?? ""} className="w-full rounded-xl border border-stone-300 px-3 py-2">
          <option value="">None</option>
          {promotions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="archived" defaultChecked={product?.archived} />
        Archived (hidden from shop)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : product ? "Update product" : "Add product"}
      </Button>
      {product && (
        <Button
          type="button"
          variant="danger"
          onClick={async () => {
            await archiveProduct(product.id, !product.archived);
            router.refresh();
          }}
        >
          {product.archived ? "Unarchive" : "Archive"}
        </Button>
      )}
    </form>
  );
}
