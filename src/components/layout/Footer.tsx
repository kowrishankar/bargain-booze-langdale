import Link from "next/link";
import Image from "next/image";
import { STORE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-brand bg-white text-stone-600">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Image src="/logo.png" alt={STORE.name} width={140} height={80} className="h-14 w-auto" />
          <p className="mt-3 text-sm font-semibold text-stone-800">{STORE.tagline}</p>
          <p className="mt-2 text-sm">{STORE.fullAddress}</p>
          <p className="text-sm">{STORE.openingHours}</p>
        </div>
        <div>
          <p className="font-bold text-stone-900">Shop online</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/shop" className="font-medium hover:text-brand">
                Browse products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="font-medium hover:text-brand">
                Your basket
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="font-medium hover:text-brand">
                Track orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-stone-900">Responsible retail</p>
          <p className="mt-2 text-sm">
            You must be 18+ to purchase alcohol. Challenge 25 in operation. Please drink responsibly.
          </p>
        </div>
      </div>
      <div className="border-t border-stone-200 bg-brand-light px-4 py-4 text-center text-xs font-medium text-stone-700">
        © {new Date().getFullYear()} {STORE.name} — {STORE.address}, {STORE.city}
      </div>
    </footer>
  );
}
