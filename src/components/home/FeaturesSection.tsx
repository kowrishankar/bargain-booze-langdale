import { Clock, ShieldCheck, Store, Truck, type LucideIcon } from "lucide-react";
import { STORE } from "@/lib/constants";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    icon: Store,
    title: "Collect in store",
    text: "Ready when you are — skip the queue at our Langdale Road shop.",
    accent: "",
  },
  {
    icon: Truck,
    title: "Local delivery",
    text: "We deliver to LU6 postcodes around Dunstable. Check yours at checkout.",
    accent: "",
  },
  {
    icon: Clock,
    title: STORE.openingHours,
    text: "Open seven days for your convenience — pop in or order online anytime.",
    accent: "",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Pay safely online with Stripe, or pay in store when you collect.",
    accent: "",
  },
];

function FeatureCard({ icon: Icon, title, text, accent }: Feature) {
  return (
    <article className="group relative overflow-hidden rounded-lg border-2 border-stone-100 bg-white p-5 shadow-sm transition hover:border-brand/50 hover:shadow-md sm:p-6">
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/10 transition group-hover:bg-brand/15"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm ring-4 ring-brand-light">
          <Icon className="h-7 w-7" strokeWidth={2} />
        </div>
        <span
          className="brand-display text-3xl leading-none text-brand/20 transition group-hover:text-brand/30"
          aria-hidden
        >
          {accent}
        </span>
      </div>

      <h2 className="relative mt-5 text-lg font-bold text-stone-900">{title}</h2>
      <p className="relative mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
    </article>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-stone-50 py-12 sm:py-14">
      <div
        className="absolute right-0 top-0 h-32 w-1/3 skew-x-[-6deg] bg-brand-light opacity-60"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-8 border-l-4 border-brand pl-4 sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Simple · Local · Trusted</p>
          <h2 className="brand-display mt-2 text-2xl sm:text-3xl">Why shop with us</h2>
          <p className="mt-2 max-w-xl text-stone-600">
            Everything you need from your neighbourhood off-licence — online or in person.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <span className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-stone-800 shadow-sm ring-1 ring-stone-200">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            LU6 delivery
          </span>
          <span className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-stone-800 shadow-sm ring-1 ring-stone-200">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            Click &amp; collect
          </span>
          <span className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold italic text-white shadow-sm">
            {STORE.name}
          </span>
        </div>
      </div>
    </section>
  );
}
