import { prisma } from "@/lib/prisma";
import { PromotionForm } from "@/components/admin/PromotionForm";

export default async function NewPromotionPage() {
  const products = await prisma.product.findMany({ where: { archived: false }, orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create promotion</h1>
      <PromotionForm products={products} />
    </div>
  );
}
