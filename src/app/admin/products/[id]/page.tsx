import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, promotions] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { promotion: true } }),
    prisma.promotion.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit product</h1>
      <ProductForm product={product} promotions={promotions} />
    </div>
  );
}
