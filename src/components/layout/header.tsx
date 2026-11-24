"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const PRIMARY_NAV = [
  { href: "/shop?sort=newest", label: "New Arrivals", match: "/shop" },
  { href: "/category/clothes", label: "Clothing", match: "/category/clothes" },
  { href: "/category/footwear", label: "Footwear", match: "/category/footwear" },
  {
    href: "/category/appliances",
    label: "Home & Living",
    match: "/category/appliances",
  },
  { href: "/shop?sale=1", label: "Sale", match: "sale" },
];

const SECONDARY = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/delivery-returns", label: "Delivery" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPath, setMenuPath] = useState(pathname);
  const mounted = useIsClient();

  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (searchOpen) setSearchOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  };

  const isActive = (item: (typeof PRIMARY_NAV)[number]) => {
    if (item.match === "sale") return false;
    if (item.match === "/shop") return pathname === "/shop";
    return pathname.startsWith(item.match);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white transition-shadow duration-300",
        scrolled ? "border-border shadow-sm" : "border-border/60"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 lg:h-[4.5rem] lg:px-8">
        <button
          type="button"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="shrink-0">
          <BrandLogo size="sm" />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-7 xl:gap-9 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-pink",
                isActive(item) ? "text-pink" : "text-ink"
              )}
            >
              {item.label}
              {isActive(item) && (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-pink" />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <form
            onSubmit={submitSearch}
            className="mr-1 hidden max-w-xs items-center border border-border md:flex"
          >
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="h-9 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            />
          </form>
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center hover:text-pink md:hidden"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center hover:text-pink"
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-pink px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Shopping bag"
            className="relative flex h-10 w-10 items-center justify-center hover:text-pink"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-white px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              autoFocus
            />
            <button
              type="submit"
              className="bg-ink px-4 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <BrandLogo size="sm" href={null} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-display text-sm font-bold uppercase tracking-[0.12em]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
              {SECONDARY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted hover:text-pink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-auto text-[11px] uppercase tracking-wider text-muted">
              Ships to Belize &amp; USA · USD
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
