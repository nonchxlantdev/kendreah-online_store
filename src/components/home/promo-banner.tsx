"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStorefrontStore } from "@/store/storefront-store";

export function PromoBanner() {
  const promo = useStorefrontStore((s) => s.published.promo);

  if (!promo.visible) return null;

  return (
    <section className="relative overflow-hidden bg-pink">
      <div className="absolute inset-0 opacity-35">
        <Image
          src={promo.image}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-4 px-4 py-12 text-white sm:gap-5 sm:py-16 lg:px-8 lg:py-20">
        <p className="font-promo text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-sm sm:tracking-[0.28em]">
          Campaign
        </p>
        <h2 className="max-w-xl whitespace-pre-line font-display text-[clamp(2rem,8vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
          {promo.title}
        </h2>
        <p className="max-w-md text-[13px] text-white/90 sm:text-sm md:text-base">
          {promo.description}
        </p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full bg-ink hover:bg-white hover:text-ink sm:w-auto"
        >
          <Link href={promo.href}>{promo.buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
