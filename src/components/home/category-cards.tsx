import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/assets";

const CATS = [
  {
    href: "/category/clothes",
    title: "Clothing",
    cta: "Shop now",
    image: withBase("/products/cat-clothes.jpg"),
  },
  {
    href: "/category/footwear",
    title: "Footwear",
    cta: "Shop now",
    image: withBase("/products/cat-footwear.jpg"),
  },
  {
    href: "/category/appliances",
    title: "Home & Living",
    cta: "Shop now",
    image: withBase("/products/cat-appliances.jpg"),
  },
];

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8 lg:py-14">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl md:text-3xl">
          Shop by category
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {CATS.map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group relative aspect-[3/4] overflow-hidden bg-neutral ${
              i === 2 ? "col-span-2 md:col-span-1" : ""
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5 md:p-6">
              <p className="font-display text-base font-bold uppercase tracking-tight sm:text-xl md:text-2xl">
                {cat.title}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-pink-soft transition group-hover:text-white sm:mt-1 sm:text-xs sm:tracking-[0.16em]">
                {cat.cta} →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
