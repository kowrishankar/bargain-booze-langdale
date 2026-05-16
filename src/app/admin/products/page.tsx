import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { promotion: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-100">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-stone-600">{p.category}</td>
                <td className="p-3">{formatGBP(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  {p.archived ? (
                    <span className="text-stone-400">Archived</span>
                  ) : (
                    <span className="text-green-700">Active</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-brand hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
