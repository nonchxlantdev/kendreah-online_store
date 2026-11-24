"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { SearchOverlay } from "@/components/layout/search-overlay";
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

const DRAWER_NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/category/clothes", label: "Clothing" },
  { href: "/category/footwear", label: "Footwear" },
  { href: "/category/appliances", label: "Home & Living" },
  { href: "/shop?sale=1", label: "Sale" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/delivery-returns", label: "Delivery & Returns" },
];

export function Header({
  searchOpen,
  onSearchOpenChange,
}: {
  searchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPath, setMenuPath] = useState(pathname);
  const mounted = useIsClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const searchIsOpen = searchOpen ?? internalSearch;
  const setSearchOpen = onSearchOpenChange ?? setInternalSearch;

  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      setSearchOpen(true);
    }
  }, [searchParams, setSearchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  };

  const isActive = (item: (typeof PRIMARY_NAV)[number]) => {
    if (item.match === "sale") return searchParams.get("sale") === "1";
    if (item.match === "/shop") {
      return pathname === "/shop" && searchParams.get("sale") !== "1";
    }
    return pathname.startsWith(item.match);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white transition-shadow duration-300",
          scrolled ? "border-border shadow-sm" : "border-border/60"
        )}
      >
        <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-1 px-3 sm:h-16 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-2 sm:px-4 lg:flex lg:h-[4.5rem] lg:gap-4 lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center justify-self-start lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex min-w-0 items-center justify-center overflow-hidden lg:justify-start lg:shrink-0">
            <BrandLogo size="xs" className="lg:hidden" />
            <BrandLogo size="sm" className="hidden lg:inline-flex" />
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

          <div className="flex items-center justify-end gap-0.5 sm:gap-1 lg:ml-auto">
            <form
              onSubmit={submitSearch}
              className="mr-1 hidden max-w-xs items-center border border-border lg:flex"
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search products"
                className="h-9 border-0 bg-transparent text-sm shadow-none outline-none focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
            <button
              type="button"
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center hover:text-pink lg:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-11 w-11 items-center justify-center hover:text-pink sm:flex"
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
              className="relative flex h-11 w-11 items-center justify-center hover:text-pink"
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
      </header>

      <SearchOverlay open={searchIsOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span id={titleId} className="sr-only">
                Menu
              </span>
              <BrandLogo size="sm" href={null} />
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-4">
              {DRAWER_NAV.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded px-3 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] hover:bg-pink-blush hover:text-pink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="border-t border-border px-5 py-4 text-[11px] uppercase tracking-wider text-muted">
              Ships to Belize &amp; USA · USD
            </p>
          </div>
        </div>
      )}
    </>
  );
}
