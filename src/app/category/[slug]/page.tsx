import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopListing } from "@/components/shop/shop-listing";
import {
  DEPARTMENT_DESCRIPTIONS,
  DEPARTMENT_LABELS,
  type Department,
} from "@/types";

const VALID: Department[] = ["clothes", "footwear", "appliances"];

function isDepartment(slug: string): slug is Department {
  return VALID.includes(slug as Department);
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isDepartment(slug)) {
    return { title: "Category not found" };
  }
  return {
    title: DEPARTMENT_LABELS[slug],
    description: DEPARTMENT_DESCRIPTIONS[slug],
  };
}

export function generateStaticParams() {
  return VALID.map((slug) => ({ slug }));
}

function CategoryFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="h-10 w-56 animate-pulse bg-warm-grey" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse bg-warm-grey" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-warm-grey" />
        ))}
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isDepartment(slug)) {
    notFound();
  }

  return (
    <Suspense fallback={<CategoryFallback />}>
      <ShopListing department={slug} />
    </Suspense>
  );
}
