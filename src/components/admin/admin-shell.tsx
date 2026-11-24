"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-pink text-white"
                : "text-soft-white/75 hover:bg-white/10 hover:text-soft-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-warm-grey">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink lg:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <BrandLogo href="/admin" size="sm" inverted />
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-gold">
            Admin demo
          </p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="block text-center text-xs text-soft-white/60 transition hover:text-gold"
          >
            ← Back to storefront
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <BrandLogo href="/admin" size="sm" inverted />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-soft-white/80 hover:text-soft-white"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-white/10 p-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block text-center text-xs text-soft-white/60 transition hover:text-gold"
              >
                ← Back to storefront
              </Link>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <div className="border-b border-gold/40 bg-ink px-4 py-2.5 text-center text-xs text-soft-white sm:text-sm">
          <span className="inline-flex items-center justify-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span>
              Local demonstration — not a secure production admin
            </span>
          </span>
        </div>

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-soft-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                Ken&apos; Dreah
              </p>
              <h1 className="font-serif text-lg font-semibold text-ink sm:text-xl">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="hidden text-sm font-medium text-pink hover:underline sm:inline"
          >
            View storefront
          </Link>
        </header>

        <main className="flex-1 overflow-x-auto px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
