"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/store/catalog-store";
import { useStorefrontStore } from "@/store/storefront-store";

export function FeaturedProducts() {
  const products = useCatalogStore((s) => s.products);
  const featuredIds = useStorefrontStore((s) => s.published.featuredProductIds);

  const byId = new Map(products.map((p) => [p.id, p]));
  const featured = featuredIds
    .map((id) => byId.get(id))
    .filter(
      (p): p is NonNullable<typeof p> =>
        !!p && p.status !== "draft" && p.status !== "archived"
    )
    .slice(0, 8);

  const fallback =
    featured.length > 0
      ? featured
      : products
          .filter((p) => p.isFeatured && p.status !== "draft" && p.status !== "archived")
          .slice(0, 8);

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8 lg:py-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-7 sm:gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-pink sm:text-[11px] sm:tracking-[0.2em]">
            Popular picks
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl md:text-3xl">
            Trending now
          </h2>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/shop">View all</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
        {fallback.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
