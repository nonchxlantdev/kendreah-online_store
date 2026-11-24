import { CreditCard, DollarSign, Globe2, ShoppingBag } from "lucide-react";

const ITEMS = [
  {
    icon: Globe2,
    title: "Shipping to Belize & USA",
  },
  {
    icon: DollarSign,
    title: "Shop in USD",
  },
  {
    icon: ShoppingBag,
    title: "Convenient shopping",
  },
  {
    icon: CreditCard,
    title: "Secure checkout at launch",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-2.5 bg-white px-4 py-4 text-center"
          >
            <Icon className="h-4 w-4 shrink-0 text-pink" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink sm:text-xs">
              {title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
