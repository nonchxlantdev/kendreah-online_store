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
      <div className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8 lg:py-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl md:text-3xl">
            New arrivals
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/shop?sort=newest">Shop all new</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
          {arrivals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
