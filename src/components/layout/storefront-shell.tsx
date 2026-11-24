"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BrandLogo } from "@/components/brand/logo";
import { Lock } from "lucide-react";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isCheckout =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-confirmation");

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isCheckout) {
    return (
      <div className="flex min-h-screen flex-col bg-soft-white">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
            <BrandLogo size="sm" href="/" />
            <p className="flex items-center gap-2 text-xs text-muted sm:text-sm">
              <Lock className="h-3.5 w-3.5" />
              Secure demo checkout
            </p>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
