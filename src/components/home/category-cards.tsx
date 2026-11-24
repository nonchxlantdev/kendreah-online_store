"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorefrontStore } from "@/store/storefront-store";
import type { Department } from "@/types";

const HREF: Record<Department, string> = {
  clothes: "/category/clothes",
  footwear: "/category/footwear",
  appliances: "/category/appliances",
};

export function CategoryCards() {
  const sections = useStorefrontStore((s) => s.categories)
    .filter((c) => c.visible)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8 lg:py-14">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl md:text-3xl">
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {sections.map((cat, i) => (
          <Link
            key={cat.id}
            href={HREF[cat.id]}
            className={`group relative aspect-[3/4] overflow-hidden bg-neutral ${
              i === 2 ? "col-span-2 md:col-span-1" : ""
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
              <h3 className="font-display text-lg font-extrabold uppercase text-white sm:text-xl">
                {cat.name}
              </h3>
              <span className="mt-1 inline-block text-[11px] font-semibold uppercase tracking-wider text-pink-soft underline-offset-4 group-hover:underline sm:text-xs">
                Shop now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
