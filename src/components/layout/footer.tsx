"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { CreditCard } from "lucide-react";
import { useStorefrontStore } from "@/store/storefront-store";

export function Footer() {
  const brand = useStorefrontStore((s) => s.published.brand);
  const categories = useStorefrontStore((s) => s.categories)
    .filter((c) => c.visible)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const catHref: Record<string, string> = {
    clothes: "/category/clothes",
    footwear: "/category/footwear",
    appliances: "/category/appliances",
  };

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-3 py-10 sm:grid-cols-2 sm:gap-10 sm:px-4 sm:py-14 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-4">
          <BrandLogo href={null} size="md" inverted showTagline />
          <p className="mt-5 max-w-xs text-sm text-white/65">
            {brand.aboutBlurb}
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Shop
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>
              <Link href="/shop" className="hover:text-pink">
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={catHref[c.id]} className="hover:text-pink">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop?sort=newest" className="hover:text-pink">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Help
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>
              <Link href="/about" className="hover:text-pink">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-pink">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/delivery-returns" className="hover:text-pink">
                Delivery &amp; returns
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Contact
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>{brand.contactEmail}</li>
            <li>{brand.contactPhone}</li>
            <li>{brand.socialInstagram}</li>
            <li>{brand.socialFacebook}</li>
          </ul>
          <div className="mt-6 flex items-center gap-2 text-white/50">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Demo payments only</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-3 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 lg:px-8">
          <p>© {new Date().getFullYear()} Ken&apos; Dreah. Demo storefront.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="hidden sm:block">{brand.tagline}</p>
            <Link
              href="/admin/login"
              className="inline-flex h-9 items-center justify-center border border-white/25 bg-white/5 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-pink hover:bg-pink hover:text-white"
            >
              Admin dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
