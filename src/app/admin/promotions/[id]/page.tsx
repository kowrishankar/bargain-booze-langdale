import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromotionForm } from "@/components/admin/PromotionForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditPromotionPage({ params }: Props) {
  const { id } = await params;
  const [promotion, products] = await Promise.all([
    prisma.promotion.findUnique({ where: { id }, include: { products: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!promotion) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit promotion</h1>
      <PromotionForm promotion={promotion} products={products} />
    </div>
  );
}
