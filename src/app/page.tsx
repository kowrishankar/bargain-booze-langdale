import Link from "next/link";
import Image from "next/image";
import { Truck, Store, Clock, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { STORE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { archived: false },
    include: { promotion: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <section className="relative overflow-hidden border-b-4 border-brand bg-white">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brand-light opacity-80 skew-x-[-6deg] origin-top-right translate-x-1/4" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">Dunstable · Langdale Road</p>
              <h1 className="brand-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
                Your local
                <br />
                off-licence
              </h1>
              <p className="mt-4 text-lg text-stone-600">
                Order beer, wine, spirits &amp; essentials online. Collect from{" "}
                <strong className="text-stone-900">{STORE.fullAddress}</strong> or get local delivery to
                selected LU6 postcodes.
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

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Store, title: "Collect in store", text: "Ready when you are — skip the queue." },
            { icon: Truck, title: "Local delivery", text: "We deliver to LU6 postcodes around Dunstable." },
            { icon: Clock, title: STORE.openingHours, text: "Open seven days for your convenience." },
            { icon: ShieldCheck, title: "Secure checkout", text: "Pay safely online and track your order." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border-2 border-stone-100 bg-white p-4 shadow-sm transition hover:border-brand/30">
              <Icon className="h-8 w-8 text-brand" />
              <h2 className="mt-2 font-bold text-stone-900">{title}</h2>
              <p className="mt-1 text-sm text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6 flex items-end justify-between border-l-4 border-brand pl-4">
            <h2 className="brand-display text-2xl sm:text-3xl">Popular picks</h2>
            <Link href="/shop" className="text-sm font-bold text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section id="delivery" className="border-y-4 border-brand bg-brand-light py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="brand-display text-2xl sm:text-3xl">Local delivery area</h2>
          <p className="mt-3 max-w-2xl text-stone-700">
            We deliver to selected postcodes around Dunstable (mainly LU6). Enter your postcode at checkout — if
            we cover your area, you can have your order brought to your door for a small delivery fee.
          </p>
        </div>
      </section>

      <section id="visit" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="brand-display text-2xl sm:text-3xl">Visit us</h2>
        <address className="mt-4 not-italic text-stone-600">
          <p className="font-bold text-brand">{STORE.name}</p>
          <p className="mt-1">{STORE.fullAddress}</p>
          <p className="mt-2 font-semibold text-stone-900">{STORE.openingHours}</p>
        </address>
        <div className="mt-6 aspect-video max-w-2xl overflow-hidden rounded-lg border-2 border-stone-200">
          <iframe
            title="Store location map"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=62+Langdale+Rd,+Dunstable+LU6+3BS&output=embed"
          />
        </div>
      </section>
    </>
  );
}
