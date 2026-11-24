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
    <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8 lg:py-16">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
          Shop by category
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {CATS.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative aspect-[3/4] overflow-hidden bg-neutral"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p className="font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
                {cat.title}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-pink-soft transition group-hover:text-white">
                {cat.cta} →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
