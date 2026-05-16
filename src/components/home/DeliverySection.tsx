import Link from "next/link";
import { ArrowRight, MapPin, Package, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DELIVERY_FEE, STORE } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";

function formatPostcodeDisplay(postcode: string): string {
  const clean = postcode.replace(/\s/g, "").toUpperCase();
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, clean.length - 3)} ${clean.slice(-3)}`;
}

export async function DeliverySection() {
  const postcodes = await prisma.allowedPostcode.findMany({
    orderBy: { postcode: "asc" },
    take: 10,
  });

  const steps = [
    { icon: MapPin, label: "Enter your postcode at checkout" },
    { icon: Package, label: "We pack your order at the store" },
    { icon: Truck, label: "Delivered to your door locally" },
  ];

  return (
    <section id="delivery" className="relative overflow-hidden border-y-4 border-brand bg-brand-light py-12 sm:py-14">
      <div
        className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/4 skew-x-[-6deg] bg-white/40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="border-l-4 border-brand pl-4">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">LU6 &amp; nearby</p>
              <h2 className="brand-display mt-2 text-2xl sm:text-3xl">Local delivery area</h2>
            </div>
            <p className="mt-4 max-w-lg text-stone-700">
              We deliver to selected postcodes around Dunstable. Enter yours at checkout — if we cover your
              area, your order comes straight from {STORE.name} on Langdale Road.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-lg border-2 border-brand bg-white px-4 py-3 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
                <Truck className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Delivery fee</p>
                <p className="text-xl font-black text-brand">{formatGBP(DELIVERY_FEE)}</p>
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              {steps.map(({ icon: Icon, label }, i) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-2 ring-brand/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 pt-1">
                    <span className="text-xs font-bold uppercase text-brand">Step {i + 1}</span>
                    <p className="font-semibold text-stone-900">{label}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold italic text-white shadow-sm transition hover:bg-brand-dark"
            >
              Start your order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-white p-6 shadow-lg sm:p-8">
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10"
                aria-hidden
              />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light ring-4 ring-brand/20">
                    <MapPin className="h-10 w-10 text-brand" strokeWidth={2} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-5 text-sm font-bold uppercase tracking-widest text-stone-500">
                  Delivery zone
                </p>
                <p className="mt-1 font-bold text-stone-900">Dunstable &amp; surrounding LU6</p>
                <p className="mt-1 text-sm text-stone-600">From our store at {STORE.postcode}</p>
              </div>

              {postcodes.length > 0 && (
                <div className="relative mt-6 w-full border-t border-stone-100 pt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand">
                    Example postcodes we cover
                  </p>
                  <ul className="flex flex-wrap justify-center gap-2">
                    {postcodes.map((pc) => (
                      <li
                        key={pc.id}
                        className="rounded-md border border-brand/20 bg-brand-light px-2.5 py-1 text-xs font-bold text-brand"
                      >
                        {formatPostcodeDisplay(pc.postcode)}
                      </li>
                    ))}
                  </ul>
                  {postcodes.length >= 10 && (
                    <p className="mt-3 text-center text-xs text-stone-500">
                      + more — validated at checkout
                    </p>
                  )}
                </div>
              )}

              <div className="relative mt-6 w-full rounded-lg bg-stone-50 px-4 py-3 text-center">
                <p className="text-sm text-stone-600">
                  Not sure?{" "}
                  <span className="font-semibold text-stone-900">Enter your postcode when you checkout</span>{" "}
                  — we&apos;ll tell you instantly.
                </p>
              </div>
            </div>

            <div
              className="absolute -bottom-3 -left-3 hidden h-16 w-16 rotate-[-8deg] items-center justify-center rounded-lg border-4 border-brand bg-brand sm:flex"
              aria-hidden
            >
              <span className="brand-display text-lg text-white">LU6</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
