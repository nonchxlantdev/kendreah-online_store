"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";
import { formatUSD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCatalogStore } from "@/store/catalog-store";

export default function CartPage() {
  const mounted = useIsClient();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
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

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted">Loading cart…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <ShoppingBag className="mb-4 h-10 w-10 text-muted" strokeWidth={1.25} />
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Discover trendy finds across clothes, footwear and home essentials.
        </p>
        <Button asChild variant="default" className="mt-8">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Ken&apos; Dreah
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Your cart
          </h1>
        </div>
        <p className="text-sm text-muted">
          {lines.reduce((n, { item }) => n + item.quantity, 0)} item
          {lines.reduce((n, { item }) => n + item.quantity, 0) === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-0 divide-y divide-border border-y border-border">
          {lines.map(({ item, product }) => (
            <div key={item.key} className="flex gap-4 py-5 sm:gap-5">
              <Link
                href={`/product/${product.slug}`}
                className="relative h-28 w-20 shrink-0 bg-warm-grey sm:h-32 sm:w-24"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-medium text-ink hover:text-pink sm:text-base"
                    >
                      {product.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="mt-1 text-xs text-muted">
                        {[item.color, item.size].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {formatUSD(product.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-xs text-muted underline-offset-2 hover:text-pink hover:underline"
                    onClick={() => removeItem(item.key)}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      className="px-3 py-2 text-ink transition hover:bg-warm-grey"
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
                      className="px-3 py-2 text-ink transition hover:bg-warm-grey disabled:opacity-40"
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
                  <p className="text-sm font-semibold text-ink">
                    {formatUSD(product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-border bg-soft-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-ink">
                {formatUSD(subtotal)}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Estimated shipping calculated at checkout. Illustrative demo rates
              for Belize and the United States.
            </p>
          </div>
          <div className="mt-6 grid gap-2">
            <Button asChild variant="default" size="lg" className="w-full">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
