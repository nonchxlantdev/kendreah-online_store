"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useOrderStore } from "@/store/order-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { DEMO_SHIPPING_RATES } from "@/lib/shipping";

export default function AdminSettingsPage() {
  const resetProducts = useCatalogStore((s) => s.resetProducts);
  const resetOrders = useOrderStore((s) => s.resetOrders);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState(false);

  function resetDemoData() {
    resetProducts();
    resetOrders();
    clearCart();
    clearWishlist();
    try {
      localStorage.removeItem("kendreah-cart");
      localStorage.removeItem("kendreah-wishlist");
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
    setConfirmOpen(false);
    setDone(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Prototype settings
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
          Settings
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          This panel is part of an unauthenticated local demonstration. It is
          not a secure production admin and must not be used with real customer
          data.
        </p>
      </div>

      <div className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-ink">
        <p className="flex items-start gap-2 font-medium text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Prototype warning
        </p>
        <p className="mt-2 text-muted">
          Ken&apos; Dreah admin demo has no login, roles, or server-side
          authorization. Anyone with browser access can change LocalStorage
          catalog and order data. Treat everything here as client-presentation
          scaffolding only.
        </p>
      </div>

      <section className="border border-border bg-soft-white p-6">
        <h3 className="font-serif text-lg font-semibold">Store information</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">
              Store name
            </dt>
            <dd className="mt-1 font-medium">Ken&apos; Dreah Online Store</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">
              Currency
            </dt>
            <dd className="mt-1 font-medium">USD</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-muted">
              Shipping destinations
            </dt>
            <dd className="mt-2 space-y-2">
              {Object.entries(DEMO_SHIPPING_RATES).map(([country, rate]) => (
                <div
                  key={country}
                  className="border border-border bg-warm-grey/40 px-3 py-2 text-sm"
                >
                  <p className="font-medium">{country}</p>
                  <p className="text-muted">
                    {rate.label} — illustrative demo only
                  </p>
                </div>
              ))}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-muted">
              Persistence
            </dt>
            <dd className="mt-1 text-sm text-muted">
              Catalog and orders sync with the storefront through{" "}
              <code className="text-ink">kendreah-catalog</code> and{" "}
              <code className="text-ink">kendreah-orders</code> LocalStorage
              keys.
            </dd>
          </div>
        </dl>
      </section>

      <section className="border border-border bg-soft-white p-6">
        <h3 className="font-serif text-lg font-semibold">Reset demo data</h3>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Restores the seed product catalog and seed orders, and clears the
          demo cart and wishlist. Use this before a client walkthrough if the
          LocalStorage state has drifted.
        </p>
        <Button
          type="button"
          variant="pink"
          className="mt-5"
          onClick={() => {
            setDone(false);
            setConfirmOpen(true);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset demo data
        </Button>
        {done && (
          <p className="mt-3 text-sm text-success">
            Demo catalog, orders, cart, and wishlist were reset.
          </p>
        )}
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all demonstration data?</DialogTitle>
            <DialogDescription>
              This restores seed products and seed orders, then clears cart and
              wishlist LocalStorage. Any products or orders you created in this
              browser will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="pink" onClick={resetDemoData}>
              Confirm reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
