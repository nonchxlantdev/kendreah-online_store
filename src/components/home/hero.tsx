"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/assets";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[min(72vw,620px)] min-h-[420px] w-full overflow-hidden bg-ink">
      <Image
        src={withBase("/products/hero-campaign.jpg")}
        alt="Confident woman in contemporary fashion — Ken' Dreah campaign"
        fill
        priority
        className="object-cover object-[center_20%] md:object-[center_25%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent md:hidden" />

      <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-4 pb-10 pt-16 sm:items-center sm:pb-0 lg:px-8">
        <motion.div
          className="max-w-xl text-white"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-promo text-sm font-semibold uppercase tracking-[0.28em] text-pink-soft">
            The Ken&apos; Dreah Edit
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
            Your Style.
            <br />
            Your Rules.
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
            Fashion, footwear and everyday essentials you&apos;ll love — at
            prices you&apos;ll love even more.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="pink" size="lg">
              <Link href="/shop?sort=newest">Shop New Arrivals</Link>
            </Button>
            <Button asChild variant="outline-white" size="lg">
              <Link href="/shop">Explore Collections</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
