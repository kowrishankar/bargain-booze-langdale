import Link from "next/link";
import { ShoppingBasket, User, MapPin } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCart, cartItemCount } from "@/lib/cart";
import { SignOutButton } from "@/components/account/SignOutButton";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const [session, cart] = await Promise.all([auth(), getCart()]);
  const count = cartItemCount(cart);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-brand bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Logo size="md" />

        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          <Link href="/shop" className="text-stone-800 transition hover:text-brand">
            Shop
          </Link>
          <Link href="/#delivery" className="text-stone-800 transition hover:text-brand">
            Delivery
          </Link>
          <Link href="/#visit" className="flex items-center gap-1 text-stone-800 transition hover:text-brand">
            <MapPin className="h-4 w-4 text-brand" />
            Find us
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand transition hover:bg-brand/10"
            aria-label={`Basket${count ? `, ${count} items` : ""}`}
          >
            <ShoppingBasket className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-md bg-brand px-1 text-xs font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          {session ? (
            <>
              <Link
                href="/account/orders"
                className="hidden h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-stone-800 transition hover:bg-brand-light hover:text-brand md:flex"
              >
                <User className="h-4 w-4" />
                Orders
              </Link>
              <SignOutButton className="hidden h-10 items-center rounded-lg px-3 text-sm font-semibold text-stone-600 transition hover:bg-brand-light hover:text-brand md:inline-flex" />
            </>
          ) : (
            <Link
              href="/account/login"
              className="hidden h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-stone-800 transition hover:bg-brand-light hover:text-brand md:flex"
            >
              <User className="h-4 w-4" />
              Sign in
            </Link>
          )}
          <MobileNav session={!!session} cartCount={count} />
        </div>
      </div>
    </header>
  );
}
