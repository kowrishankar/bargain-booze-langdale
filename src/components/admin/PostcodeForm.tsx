"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addAllowedPostcode, removeAllowedPostcode } from "@/lib/admin-actions";
import { formatPostcode } from "@/lib/postcodes";
import type { AllowedPostcode } from "@/generated/prisma/client";

export function PostcodeManager({ postcodes }: { postcodes: AllowedPostcode[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const form = new FormData(e.currentTarget);
          await addAllowedPostcode(String(form.get("postcode")), String(form.get("area") || ""));
          e.currentTarget.reset();
          router.refresh();
          setLoading(false);
        }}
      >
        <Input label="Postcode" name="postcode" required placeholder="LU6 3BS" className="flex-1" />
        <Input label="Area name" name="area" placeholder="Dunstable" className="flex-1" />
        <Button type="submit" disabled={loading}>
          Add
        </Button>
      </form>
      <ul className="divide-y divide-stone-200 rounded-2xl bg-white shadow-sm">
        {postcodes.map((pc) => (
          <li key={pc.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              <strong>{formatPostcode(pc.postcode)}</strong>
              {pc.area && <span className="ml-2 text-stone-500">{pc.area}</span>}
            </span>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={async () => {
                await removeAllowedPostcode(pc.id);
                router.refresh();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
