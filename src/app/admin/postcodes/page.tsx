import { prisma } from "@/lib/prisma";
import { PostcodeManager } from "@/components/admin/PostcodeForm";

export default async function AdminPostcodesPage() {
  const postcodes = await prisma.allowedPostcode.findMany({ orderBy: { postcode: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Delivery postcodes</h1>
      <p className="mt-1 text-sm text-stone-600">Only customers with these postcodes can choose delivery at checkout.</p>
      <div className="mt-6">
        <PostcodeManager postcodes={postcodes} />
      </div>
    </div>
  );
}
