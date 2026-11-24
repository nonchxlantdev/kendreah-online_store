"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, Store } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/shop",
    label: "Shop",
    icon: Store,
    match: (p: string) =>
      p.startsWith("/shop") || p.startsWith("/category") || p.startsWith("/product"),
  },
  {
    href: "/shop?focus=search",
    label: "Search",
    icon: Search,
    match: () => false,
    action: "search" as const,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
    match: (p: string) => p.startsWith("/wishlist"),
  },
  {
    href: "/cart",
    label: "Bag",
    icon: ShoppingBag,
    match: (p: string) => p.startsWith("/cart"),
    bag: true,
  },
];

export function MobileBottomNav({
  onSearch,
}: {
  onSearch?: () => void;
}) {
  const pathname = usePathname();
  const mounted = useIsClient();
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-14 max-w-lg grid-cols-5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          const content = (
            <>
              <span className="relative">
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={active ? 2.4 : 1.8} />
                {item.bag && mounted && itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-pink px-1 text-[9px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
                {item.href === "/wishlist" && mounted && wishlistCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-pink px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.06em]">
                {item.label}
              </span>
            </>
          );

          if (item.action === "search") {
            return (
              <li key={item.label} className="flex">
                <button
                  type="button"
                  onClick={onSearch}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 text-muted",
                    "active:text-pink"
                  )}
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5",
                  active ? "text-pink" : "text-muted"
                )}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
