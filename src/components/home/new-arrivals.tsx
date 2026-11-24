"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/store/catalog-store";

export function NewArrivals() {
  const products = useCatalogStore((s) => s.products);
  const arrivals = [...products]
    .filter((p) => p.isNew && p.status !== "draft")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
            New arrivals
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/shop?sort=newest">Shop all new</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
          {arrivals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
