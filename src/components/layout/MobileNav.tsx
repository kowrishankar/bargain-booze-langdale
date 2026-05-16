"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBasket, User } from "lucide-react";

type Props = {
  session: boolean;
  cartCount: number;
};

export function MobileNav({ session, cartCount }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <nav className="fixed inset-x-0 top-[73px] z-50 border-b-4 border-brand bg-white px-4 py-4 shadow-xl">
            <ul className="flex flex-col gap-1 text-sm font-bold">
              <li>
                <Link href="/shop" onClick={() => setOpen(false)} className="flex rounded-lg px-3 py-3 text-stone-800 hover:bg-brand-light hover:text-brand">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-stone-800 hover:bg-brand-light hover:text-brand">
                  <ShoppingBasket className="h-4 w-4 text-brand" />
                  Basket {cartCount > 0 && `(${cartCount})`}
                </Link>
              </li>
              <li>
                <Link
                  href={session ? "/account/orders" : "/account/login"}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-stone-800 hover:bg-brand-light hover:text-brand"
                >
                  <User className="h-4 w-4 text-brand" />
                  {session ? "My orders" : "Sign in"}
                </Link>
              </li>
              <li>
                <Link href="/#visit" onClick={() => setOpen(false)} className="flex rounded-lg px-3 py-3 text-stone-800 hover:bg-brand-light hover:text-brand">
                  Find us
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
