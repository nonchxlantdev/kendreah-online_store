"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Percent,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/store/admin-auth-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useCustomerStore } from "@/store/customer-store";
import { useOrderStore } from "@/store/order-store";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tag },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/discounts", label: "Discounts", icon: Percent },
    ],
  },
  {
    label: "Online store",
    items: [
      { href: "/admin/storefront", label: "Storefront", icon: Store },
      { href: "/admin/shipping", label: "Shipping", icon: Truck },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
    ],
  },
] as const;

function crumbLabel(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  if (last === "new") return "New";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function AdminNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {group.label}
            </p>
          )}
          <nav className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const exact = "exact" in item && item.exact;
              const active = exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-pink text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsClient();
  const isLogin = pathname.startsWith("/admin/login");
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const adminName = useAdminAuthStore((s) => s.adminName);
  const adminEmail = useAdminAuthStore((s) => s.adminEmail);
  const signOut = useAdminAuthStore((s) => s.signOut);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const products = useCatalogStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);
  const customers = useCustomerStore((s) => s.customers);

  useEffect(() => {
    if (!mounted || isLogin) return;
    if (!isAuthenticated) router.replace("/admin/login");
  }, [mounted, isAuthenticated, isLogin, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], orders: [], customers: [] };
    return {
      products: products
        .filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
        .slice(0, 5),
      orders: orders
        .filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.shippingAddress.fullName.toLowerCase().includes(q)
        )
        .slice(0, 5),
      customers: customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        )
        .slice(0, 5),
    };
  }, [query, products, orders, customers]);

  if (isLogin) return <>{children}</>;

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-admin-bg text-sm text-admin-muted">
        Loading admin…
      </div>
    );
  }

  const sidebarWidth = collapsed ? "lg:w-[72px]" : "lg:w-[250px]";
  const contentPad = collapsed ? "lg:pl-[72px]" : "lg:pl-[250px]";

  return (
    <div className="min-h-dvh bg-admin-bg text-ink">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col bg-ink text-white transition-[width] lg:flex",
          sidebarWidth
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          {!collapsed ? (
            <BrandLogo href="/admin" size="xs" inverted className="!text-white [&_.script-wordmark]:!text-pink" />
          ) : (
            <Link href="/admin" className="mx-auto text-pink" aria-label="Admin home">
              KD
            </Link>
          )}
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center text-white/60 hover:text-white lg:flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <AdminNav pathname={pathname} collapsed={collapsed} />
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className={cn(
              "mb-2 flex items-center gap-2 px-2 py-2 text-xs text-white/60 hover:text-gold",
              collapsed && "justify-center"
            )}
          >
            <Store className="h-4 w-4" />
            {!collapsed && "View online store"}
          </Link>
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-2",
              collapsed && "justify-center"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center bg-pink text-[11px] font-bold">
              {adminName.slice(0, 1)}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{adminName}</p>
                <p className="truncate text-[10px] text-white/50">{adminEmail}</p>
              </div>
            )}
            <button
              type="button"
              aria-label="Sign out"
              className="text-white/50 hover:text-white"
              onClick={() => {
                signOut();
                router.push("/admin/login");
              }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[250px] flex-col bg-ink">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
              <BrandLogo href="/admin" size="xs" inverted />
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <AdminNav
              pathname={pathname}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className={cn("flex min-h-dvh flex-col", contentPad)}>
        <div className="border-b border-gold/30 bg-ink px-4 py-1.5 text-center text-[11px] text-white/90">
          Demo Mode — simulated admin. Not production-secure. Data stays in this browser.
        </div>
        <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-3 py-2.5 sm:px-5 lg:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <nav className="hidden text-xs text-admin-muted sm:block">
              <span>Admin</span>
              <span className="mx-1.5">/</span>
              <span className="text-ink">{crumbLabel(pathname)}</span>
            </nav>
            <div className="relative ml-auto w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search products, orders, customers…"
                className="h-9 border-border bg-admin-bg pl-9 text-sm"
                aria-label="Global admin search"
              />
              {searchOpen && query.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-40 border border-border bg-white shadow-lg">
                  <SearchBlock
                    title="Products"
                    items={results.products.map((p) => ({
                      href: `/admin/products/edit?id=${p.id}`,
                      label: p.name,
                    }))}
                    onPick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  />
                  <SearchBlock
                    title="Orders"
                    items={results.orders.map((o) => ({
                      href: `/admin/orders/detail?id=${o.id}`,
                      label: o.orderNumber,
                    }))}
                    onPick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  />
                  <SearchBlock
                    title="Customers"
                    items={results.customers.map((c) => ({
                      href: `/admin/customers/detail?id=${c.id}`,
                      label: c.name,
                    }))}
                    onPick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  />
                  {!results.products.length &&
                    !results.orders.length &&
                    !results.customers.length && (
                      <p className="px-3 py-4 text-sm text-admin-muted">
                        No matches.
                      </p>
                    )}
                </div>
              )}
            </div>
            <button
              type="button"
              className="relative hidden h-9 w-9 items-center justify-center text-admin-muted hover:text-ink sm:flex"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-pink" />
            </button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/">View store</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 px-3 py-5 sm:px-5 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}

function SearchBlock({
  title,
  items,
  onPick,
}: {
  title: string;
  items: { href: string; label: string }[];
  onPick: () => void;
}) {
  if (!items.length) return null;
  return (
    <div className="border-b border-border px-2 py-2 last:border-b-0">
      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
        {title}
      </p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onPick}
          className="block px-2 py-1.5 text-sm hover:bg-admin-bg"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
