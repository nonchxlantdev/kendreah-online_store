"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCatalogStore } from "@/store/catalog-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } =
    useCartStore();
  const products = useCatalogStore((s) => s.products);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as {
    item: (typeof items)[number];
    product: (typeof products)[number];
  }[];

  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + product.price * item.quantity,
    0
  );
  const count = lines.reduce((n, l) => n + l.item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        aria-label="Close bag"
        onClick={closeCart}
      />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em]">
            Your bag ({count})
          </h2>
          <button
            type="button"
            aria-label="Close bag"
            className="flex h-10 w-10 items-center justify-center"
            onClick={closeCart}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-xl font-bold uppercase tracking-tight">
              Your bag is empty
            </p>
            <p className="text-sm text-muted">
              Discover fashion, footwear and home essentials.
            </p>
            <Button asChild variant="pink" onClick={closeCart}>
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
              {lines.map(({ item, product }) => (
                <div key={item.key} className="flex gap-3 sm:gap-4">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeCart}
                    className="relative h-28 w-20 shrink-0 bg-neutral sm:h-24 sm:w-20"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium leading-snug hover:text-pink"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {[item.color, item.size].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 px-1 py-1 text-xs text-muted hover:text-pink"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= product.stock}
                          onClick={() =>
                            updateQuantity(
                              item.key,
                              Math.min(product.stock, item.quantity + 1)
                            )
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold tabular-nums">
                        {formatUSD(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-4 sm:px-5">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold tabular-nums">
                  {formatUSD(subtotal)}
                </span>
              </div>
              <p className="mb-4 text-xs text-muted">
                Shipping calculated at checkout. Demo rates for Belize &amp;
                USA.
              </p>
              <div className="grid gap-2">
                <Button asChild variant="default" size="lg" onClick={closeCart}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" onClick={closeCart}>
                  <Link href="/cart">View bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
