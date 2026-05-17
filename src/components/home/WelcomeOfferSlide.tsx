import Link from "next/link";
import { Gift, Sparkles, ShoppingBag, UserPlus } from "lucide-react";
import { WELCOME_OFFER } from "@/lib/constants";

export function WelcomeOfferSlide() {
  return (
    <section className="relative overflow-hidden border-b-4 border-brand bg-brand">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-full w-1/2 skew-x-[-8deg] bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-white/10 sm:h-40 sm:w-40"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:flex lg:items-center lg:px-4">
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div className="order-1 w-full max-w-[min(100%,260px)] sm:max-w-[280px] lg:order-2 lg:max-w-[300px]">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 rotate-3 rounded-2xl border-4 border-white/40 bg-white/15"
                aria-hidden
              />
              <div className="relative rounded-2xl border-4 border-white bg-white px-5 py-6 text-center shadow-xl sm:px-7 sm:py-8">
                <Gift className="mx-auto h-10 w-10 text-brand sm:h-12 sm:w-12" strokeWidth={1.5} />
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-600 sm:text-sm">
                  Your welcome gift
                </p>
                <p className="mt-1 text-[clamp(3rem,14vw,5rem)] font-black italic leading-none tracking-tight text-brand">
                  {WELCOME_OFFER.discountPercent}
                  <span className="text-[0.5em]">%</span>
                </p>
                <p className="mt-0.5 text-lg font-black italic text-stone-900 sm:text-xl">OFF</p>
                <p className="mt-3 inline-block rounded-md bg-brand-light px-3 py-1 text-xs font-bold text-brand sm:text-sm">
                  First order only
                </p>
              </div>
              <Sparkles
                className="pointer-events-none absolute -right-1 -top-1 h-7 w-7 text-white drop-shadow-md sm:h-8 sm:w-8"
                aria-hidden
              />
            </div>
          </div>

          <div className="order-2 w-full min-w-0 text-center text-white lg:order-1 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              New customers
            </p>
            <h2 className="brand-display mt-3 text-3xl !text-white sm:mt-4 sm:text-4xl lg:text-5xl">
              {WELCOME_OFFER.headline}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-white/90 sm:mt-4 sm:text-lg lg:mx-0">
              {WELCOME_OFFER.description}
            </p>

            <ul className="mt-4 hidden space-y-2 text-left sm:mt-6 sm:block sm:space-y-3">
              {WELCOME_OFFER.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm font-semibold sm:text-base">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-brand">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">{perk}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-white/90 sm:hidden">
              Free account · track orders · exclusive deals
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 lg:justify-start">
              <Link
                href="/account/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold italic tracking-tight text-brand shadow-sm transition hover:bg-brand-light sm:w-auto"
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                Create free account
              </Link>
              <Link href="/shop" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-lg border-2 border-white px-5 py-2.5 text-sm font-bold italic text-white transition hover:bg-white/10 sm:w-auto">
                  Browse shop
                </span>
              </Link>
            </div>

            <p className="mt-3 text-[0.65rem] leading-snug text-white/70 sm:mt-4 sm:text-xs">
              {WELCOME_OFFER.terms}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
