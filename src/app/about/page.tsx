import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ken' Dreah Online Store — trendy fashion, footwear and household appliances. US-based, online-only, shipping to Belize and the United States. Planned launch 2027.",
};

const DEPARTMENTS = [
  {
    name: "Clothes",
    description: "Accessible fashion for everyday wear and occasion looks.",
  },
  {
    name: "Footwear",
    description: "Stylish, practical shoes chosen for comfort and value.",
  },
  {
    name: "Household Appliances",
    description: "Useful home products that keep daily life running smoothly.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-border bg-warm-grey">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
              Our story
            </p>
            <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              Ken&apos; Dreah Online Store
            </h1>
            <p className="mt-4 text-lg text-muted">
              Shop • Save • Enjoy
            </p>
            <p className="mt-6 max-w-md text-muted">
              A US-based, online-only destination for trendy fashion, footwear
              and practical household products — priced to feel accessible.
            </p>
          </div>
          <div className="flex items-center justify-center bg-ink p-12 lg:col-span-7 lg:min-h-[320px]">
            <BrandLogo href={null} size="lg" inverted showTagline />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Style you love. Prices you&apos;ll love more.
            </h2>
            <div className="mt-6 space-y-5 text-muted">
              <p>
                Ken&apos; Dreah Online Store brings together clothes, footwear
                and household appliances under one clear promise:{" "}
                <span className="text-ink">Trendy • Quality • Affordable</span>.
                We focus on accessible fashion and practical home products so
                shopping feels simple, useful and good value.
              </p>
              <p>
                We are based in the United States and operate entirely online —
                browse from anywhere, shop in USD, and check out when you are
                ready. Stripe and PayPal payments are planned for launch.
              </p>
              <p>
                From day one, we are building for two markets: shipping to{" "}
                <span className="text-ink">Belize</span> and the{" "}
                <span className="text-ink">United States</span>. Our planned
                launch is <span className="text-ink">2027</span>.
              </p>
            </div>
          </div>
          <aside className="space-y-3 lg:col-span-5">
            <div className="bg-pink-blush p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-pink">
                Where we ship
              </p>
              <p className="mt-3 font-display text-2xl text-ink">
                Belize &amp; the United States
              </p>
              <p className="mt-2 text-sm text-muted">
                One brand, two destinations — with destination shipping details
                shared as they are confirmed.
              </p>
            </div>
            <div className="bg-warm-grey p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Planned launch
              </p>
              <p className="mt-3 font-display text-2xl text-ink">2027</p>
              <p className="mt-2 text-sm text-muted">
                Online-only storefront · Currency USD · Stripe + PayPal planned
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-warm-grey">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              What we offer
            </h2>
            <p className="mt-3 text-muted">
              Three departments designed around everyday style and home life.
            </p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {DEPARTMENTS.map((dept, i) => (
              <div
                key={dept.name}
                className={`min-h-[160px] p-6 ${
                  i === 1 ? "bg-pink-blush" : "bg-soft-white"
                }`}
              >
                <h3 className="font-display text-xl text-ink">{dept.name}</h3>
                <p className="mt-3 text-sm text-muted">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 bg-ink p-8 text-soft-white md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-3xl">Ready to explore?</h2>
            <p className="mt-2 text-soft-white/80">
              Browse the collection or ask a question — we are building toward
              2027.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link href="/shop">Shop the collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-soft-white/40 text-soft-white hover:bg-soft-white hover:text-ink"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
