"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useStorefrontStore } from "@/store/storefront-store";

export function Hero() {
  const reduce = useReducedMotion();
  const hero = useStorefrontStore((s) => s.published.hero);

  return (
    <section className="relative h-[min(68svh,520px)] w-full overflow-hidden bg-ink sm:h-[min(62vw,560px)] md:h-[min(58vw,600px)] lg:h-[min(52vw,620px)]">
      <Image
        src={hero.image}
        alt="Ken' Dreah campaign"
        fill
        priority
        className="object-cover object-[68%_18%] sm:object-[60%_20%] md:object-[center_22%] lg:object-[center_25%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/20 sm:bg-gradient-to-r sm:from-ink/80 sm:via-ink/45 sm:to-ink/10" />

      <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-4 pb-8 pt-10 sm:items-center sm:px-6 sm:pb-0 lg:px-8">
        <motion.div
          className="max-w-xl text-white"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-promo text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-soft sm:text-sm sm:tracking-[0.28em]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-2 whitespace-pre-line font-display text-[clamp(2rem,9vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight sm:mt-3">
            {hero.heading}
          </h1>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/85 sm:mt-4 sm:text-sm md:text-base">
            {hero.supporting}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
            <Button asChild variant="pink" size="lg" className="w-full sm:w-auto">
              <Link href={hero.primaryHref}>{hero.primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outline-white"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href={hero.secondaryHref}>{hero.secondaryLabel}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
