"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/store/catalog-store";

export function FeaturedProducts() {
  const products = useCatalogStore((s) => s.products);
  const featured = products
    .filter((p) => p.isFeatured && p.status !== "draft")
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8 lg:py-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink">
            Popular picks
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
            Trending now
          </h2>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/shop">View all</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
