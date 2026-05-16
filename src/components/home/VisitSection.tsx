import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone, Store } from "lucide-react";
import { STORE } from "@/lib/constants";

const MAPS_EMBED =
  "https://www.google.com/maps?q=62+Langdale+Rd,+Dunstable+LU6+3BS&output=embed";
const MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=62+Langdale+Rd,+Dunstable+LU6+3BS";

export function VisitSection() {
  return (
    <section id="visit" className="relative overflow-hidden bg-white py-12 sm:py-14">
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-1/3 -skew-x-6 bg-brand-light opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 top-8 h-40 w-40 rounded-full bg-brand/5"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-8 border-l-4 border-brand pl-4 sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Come and see us</p>
          <h2 className="brand-display mt-2 text-2xl sm:text-3xl">Visit our store</h2>
          <p className="mt-2 max-w-xl text-stone-600">
            Pop into {STORE.name} on Langdale Road — browse in person, collect online orders, or ask our
            team for a recommendation.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border-4 border-brand bg-brand-light p-5 shadow-sm sm:p-6">
              <div
                className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-brand/10"
                aria-hidden
              />
              <Image
                src="/logo.png"
                alt={STORE.name}
                width={160}
                height={90}
                className="relative h-12 w-auto sm:h-14"
              />
              <p className="relative mt-2 text-xs font-bold uppercase tracking-widest text-brand">
                {STORE.tagline}
              </p>

              <address className="relative mt-5 space-y-4 not-italic">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-500">Address</p>
                    <p className="font-bold text-stone-900">{STORE.name}</p>
                    <p className="mt-0.5 text-stone-700">{STORE.fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-2 ring-brand/20">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-500">Opening hours</p>
                    <p className="font-bold text-stone-900">{STORE.openingHours}</p>
                    <p className="mt-0.5 text-sm text-stone-600">Seven days a week</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-2 ring-brand/20">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-500">Phone</p>
                    <a href={`tel:${STORE.phone.replace(/\s/g, "")}`} className="font-bold text-brand hover:underline">
                      {STORE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-2 ring-brand/20">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-500">Email</p>
                    <a href={`mailto:${STORE.email}`} className="break-all font-semibold text-brand hover:underline">
                      {STORE.email}
                    </a>
                  </div>
                </div>
              </address>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold italic text-white shadow-sm transition hover:bg-brand-dark"
              >
                <Navigation className="h-4 w-4" />
                Get directions
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand bg-white px-5 py-2.5 text-sm font-bold italic text-brand transition hover:bg-brand-light"
              >
                <Store className="h-4 w-4" />
                Shop online
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] lg:min-h-0">
            <div className="relative h-full overflow-hidden rounded-2xl border-4 border-stone-200 bg-stone-100 shadow-lg ring-4 ring-brand/10">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold text-brand shadow-sm">
                <MapPin className="h-4 w-4" />
                Find us on the map
              </div>
              <iframe
                title="Store location map"
                className="h-full min-h-[280px] w-full border-0 lg:min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={MAPS_EMBED}
              />
            </div>
            <div
              className="pointer-events-none absolute -bottom-2 -right-2 hidden rounded-lg border-4 border-brand bg-white px-3 py-2 shadow-md sm:block"
              aria-hidden
            >
              <p className="text-center text-xs font-bold uppercase text-stone-500">Postcode</p>
              <p className="brand-display text-lg leading-none">{STORE.postcode}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
