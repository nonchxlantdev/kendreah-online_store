import type { ShippingCountry } from "@/types";

/** Illustrative demo rates only — not final shipping pricing. */
export const DEMO_SHIPPING_RATES: Record<
  ShippingCountry,
  { label: string; amount: number; note: string }
> = {
  Belize: {
    label: "Belize delivery (demo rate)",
    amount: 24.99,
    note: "Illustrative demo rate. Final shipping rates will be confirmed before launch.",
  },
  "United States": {
    label: "United States delivery (demo rate)",
    amount: 9.99,
    note: "Illustrative demo rate. Final shipping rates will be confirmed before launch.",
  },
};

export function getDemoShipping(country: ShippingCountry) {
  return DEMO_SHIPPING_RATES[country];
}
