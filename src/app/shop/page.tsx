import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopListing } from "@/components/shop/shop-listing";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Ken' Dreah Online Store — clothes, footwear and household appliances. Prices in USD. Shipping to Belize and the United States.",
};

function ShopFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="h-10 w-48 animate-pulse bg-warm-grey" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse bg-warm-grey" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-warm-grey" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopListing />
    </Suspense>
  );
}
