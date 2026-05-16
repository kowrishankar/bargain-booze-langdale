import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/constants";

type Props = {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

const heights = { sm: 36, md: 48, lg: 64 } as const;

export function Logo({ className = "", showTagline = true, size = "md" }: Props) {
  const h = heights[size];

  return (
    <Link href="/" className={`flex min-w-0 items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt={STORE.name}
        width={Math.round(h * 1.8)}
        height={h}
        className="h-auto w-auto shrink-0"
        style={{ height: h, width: "auto" }}
        priority
      />
      {showTagline && (
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block truncate text-xs font-semibold uppercase tracking-wide text-stone-500">
            {STORE.tagline}
          </span>
          <span className="block truncate text-xs text-stone-400">{STORE.postcode}</span>
        </span>
      )}
    </Link>
  );
}
