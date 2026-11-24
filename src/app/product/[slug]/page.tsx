import type { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductPageClient } from "./product-page-client";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Shop this product at Ken' Dreah Online Store. Prices in USD. Shipping to Belize and the United States.",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
