"use client";

import Link from "next/link";
import { ProductDetail } from "@/components/product/product-detail";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/store/catalog-store";

export function ProductPageClient({ slug }: { slug: string }) {
  const product = useCatalogStore((s) => s.getBySlug(slug));

  if (!product || product.status === "draft") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-pink">
          Ken&apos; Dreah
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Product not found
        </h1>
        <p className="mt-3 text-muted">
          This item is unavailable or the link may be outdated. Browse the shop
          for current demonstration products.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/shop">Back to shop</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
