import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/assets";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-pink">
      <div className="absolute inset-0 opacity-35">
        <Image
          src={withBase("/products/pink-edit.jpg")}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-4 px-4 py-12 text-white sm:gap-5 sm:py-16 lg:px-8 lg:py-20">
        <p className="font-promo text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-sm sm:tracking-[0.28em]">
          The Pink Edit
        </p>
        <h2 className="max-w-xl font-display text-[clamp(2rem,8vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
          Pretty.
          <br />
          Powerful.
          <br />
          Affordable.
        </h2>
        <p className="max-w-md text-[13px] text-white/90 sm:text-sm md:text-base">
          Feminine fashion finds and everyday essentials — curated for
          customers in Belize and the United States.
        </p>
        <Button asChild variant="default" size="lg" className="w-full bg-ink hover:bg-white hover:text-ink sm:w-auto">
          <Link href="/category/clothes">Shop the edit</Link>
        </Button>
      </div>
    </section>
  );
}
