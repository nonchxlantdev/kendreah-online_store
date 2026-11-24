"use client";

import Image from "next/image";
import Link from "next/link";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        aria-label="Close bag"
        onClick={closeCart}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em]">
            Your bag ({lines.reduce((n, l) => n + l.item.quantity, 0)})
          </h2>
          <button type="button" aria-label="Close bag" onClick={closeCart}>
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
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {lines.map(({ item, product }) => (
                <div key={item.key} className="flex gap-3">
                  <div className="relative h-24 w-20 shrink-0 bg-neutral">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted">
                          {[item.color, item.size].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-muted hover:text-pink"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="px-2 py-1"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= product.stock}
                          onClick={() =>
                            updateQuantity(
                              item.key,
                              Math.min(product.stock, item.quantity + 1)
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
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
            <div className="border-t border-border px-5 py-4">
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
                <Button asChild variant="default" onClick={closeCart}>
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
