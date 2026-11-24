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
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-5 px-4 py-16 text-white lg:px-8 lg:py-20">
        <p className="font-promo text-sm font-semibold uppercase tracking-[0.28em] text-white/90">
          The Pink Edit
        </p>
        <h2 className="max-w-xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
          Pretty.
          <br />
          Powerful.
          <br />
          Affordable.
        </h2>
        <p className="max-w-md text-sm text-white/90 sm:text-base">
          Feminine fashion finds and everyday essentials — curated for
          customers in Belize and the United States.
        </p>
        <Button asChild variant="default" size="lg" className="bg-ink hover:bg-white hover:text-ink">
          <Link href="/category/clothes">Shop the edit</Link>
        </Button>
      </div>
    </section>
  );
}
