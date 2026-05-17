import Link from "next/link";
import Image from "next/image";
import { STORE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function HeroSlide() {
  return (
    <section className="relative overflow-hidden border-b-4 border-brand bg-white">
      <div
        className="absolute right-0 top-0 h-full w-1/3 bg-brand-light opacity-80 skew-x-[-6deg] origin-top-right translate-x-1/4"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">Dunstable · Langdale Road</p>
            <h1 className="brand-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Your local
              <br />
              off-licence
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Order beer, wine, spirits &amp; essentials online. Collect from{" "}
              <strong className="text-stone-900">{STORE.fullAddress}</strong> or get local delivery to selected
              LU6 postcodes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="secondary">Shop now</Button>
              </Link>
              <Link href="/account/register">
                <Button variant="outline">Create account</Button>
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt={STORE.name}
              width={280}
              height={160}
              className="h-auto w-48 sm:w-64 lg:w-72"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
