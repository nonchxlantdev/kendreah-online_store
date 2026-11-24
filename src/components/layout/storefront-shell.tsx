"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { BrandLogo } from "@/components/brand/logo";
import { Lock } from "lucide-react";

function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar />
      <Header searchOpen={searchOpen} onSearchOpenChange={setSearchOpen} />
      <main className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav onSearch={() => setSearchOpen(true)} />
    </div>
  );
}

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
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 lg:px-8">
            <BrandLogo size="sm" href="/" />
            <p className="flex items-center gap-2 text-[11px] text-muted sm:text-sm">
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
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col">
          <AnnouncementBar />
          <div className="h-14 border-b border-border bg-white sm:h-16" />
          <main className="flex-1">{children}</main>
        </div>
      }
    >
      <StorefrontChrome>{children}</StorefrontChrome>
    </Suspense>
  );
}
