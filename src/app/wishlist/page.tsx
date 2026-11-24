"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";
import { useCatalogStore } from "@/store/catalog-store";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const mounted = useIsClient();
  const productIds = useWishlistStore((s) => s.productIds);
  const remove = useWishlistStore((s) => s.remove);
  const products = useCatalogStore((s) => s.products);

  const wishlistProducts = useMemo(
    () =>
      productIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as typeof products,
    [productIds, products]
  );

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted">Loading wishlist…</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <Heart className="mb-4 h-10 w-10 text-muted" strokeWidth={1.25} />
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Your wishlist is empty
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Save pieces you love and come back when you&apos;re ready. Tap the
          heart on any product to add it here.
        </p>
        <Button asChild variant="default" className="mt-8">
          <Link href="/shop">Browse the shop</Link>
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
            Wishlist
          </h1>
          <p className="mt-2 text-sm text-muted">
            {wishlistProducts.length} saved item
            {wishlistProducts.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {wishlistProducts.map((product, index) => (
          <div key={product.id} className="flex flex-col gap-3">
            <ProductCard product={product} index={index} />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/product/${product.slug}`}>View product</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted hover:text-pink"
                onClick={() => {
                  remove(product.id);
                  toast.success("Removed from wishlist");
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
