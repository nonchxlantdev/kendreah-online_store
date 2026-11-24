import { CreditCard, DollarSign, Globe2, ShoppingBag } from "lucide-react";

const ITEMS = [
  { icon: Globe2, title: "Shipping to Belize & USA" },
  { icon: DollarSign, title: "Shop in USD" },
  { icon: ShoppingBag, title: "Convenient shopping" },
  { icon: CreditCard, title: "Secure checkout at launch" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-pink sm:h-4 sm:w-4" aria-hidden />
            <p className="text-[9px] font-semibold uppercase leading-snug tracking-[0.06em] text-ink sm:text-[11px] sm:tracking-[0.08em]">
              {title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
