import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Package, Tag, ClipboardList, MapPin, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/postcodes", label: "Postcodes", icon: MapPin },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="border-b border-stone-200 bg-brand text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <p className="font-semibold">Admin — Bargain Booze Langdale</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="text-sm font-semibold text-white/90 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        <nav className="flex shrink-0 gap-2 overflow-x-auto md:w-48 md:flex-col">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link href="/" className="mt-2 px-3 text-sm text-brand hover:underline">
            ← Back to shop
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
