"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/assets";
import { useCatalogStore } from "@/store/catalog-store";

export function HomeLiving() {
  const products = useCatalogStore((s) => s.products);
  const appliances = products
    .filter((p) => p.department === "appliances" && p.status !== "draft")
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative min-h-[320px] overflow-hidden bg-neutral lg:col-span-5 lg:min-h-full">
          <Image
            src={withBase("/products/home-living.jpg")}
            alt="Modern kitchen lifestyle"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-soft">
              Home essentials
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">
              Home &amp; Living
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/85">
              Practical appliances to upgrade everyday kitchens and living
              spaces — without losing the fashion-forward vibe.
            </p>
            <Button asChild variant="pink" size="sm" className="mt-5">
              <Link href="/category/appliances">Shop appliances</Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-x-3 gap-y-8">
            {appliances.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
