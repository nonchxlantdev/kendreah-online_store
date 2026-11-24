"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsClient } from "@/hooks/use-is-client";
import { getDemoShipping } from "@/lib/shipping";
import { formatUSD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useOrderStore } from "@/store/order-store";
import type { PaymentMethod, ShippingCountry } from "@/types";

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  country: ShippingCountry;
  street: string;
  city: string;
  stateOrDistrict: string;
  postalCode: string;
}

const INITIAL_FORM: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "Belize",
  street: "",
  city: "",
  stateOrDistrict: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useIsClient();
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const products = useCatalogStore((s) => s.products);
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return { item, product };
        })
        .filter(Boolean) as {
        item: (typeof items)[number];
        product: (typeof products)[number];
      }[],
    [items, products]
  );

  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + product.price * item.quantity,
    0
  );
  const shippingInfo = getDemoShipping(form.country);
  const shipping = shippingInfo.amount;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!mounted) return;
    if (lines.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, lines.length, router]);

  const updateField = <K extends keyof CheckoutForm>(
    key: K,
    value: CheckoutForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (!form.phone.trim()) return "Please enter a phone number.";
    if (!form.street.trim()) return "Please enter a street address.";
    if (!form.city.trim()) return "Please enter a city.";
    if (!form.stateOrDistrict.trim()) {
      return form.country === "United States"
        ? "Please enter a state."
        : "Please enter a district.";
    }
    if (form.country === "United States" && !form.postalCode.trim()) {
      return "Please enter a ZIP code.";
    }
    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      router.replace("/cart");
      return;
    }

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      const order = placeOrder({
        items: lines.map(({ item, product }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: product.images[0],
        })),
        subtotal,
        shipping,
        total,
        paymentMethod,
        shippingAddress: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country,
          street: form.street.trim(),
          city: form.city.trim(),
          stateOrDistrict: form.stateOrDistrict.trim(),
          postalCode: form.postalCode.trim(),
        },
      });
      clearCart();
      toast.success("Demo order placed");
      router.push(`/order-confirmation?order=${order.id}`);
    } catch {
      toast.error("Could not place demo order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted || lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted">Loading checkout…</p>
      </div>
    );
  }

  const regionLabel =
    form.country === "United States" ? "State" : "District";
  const postalLabel =
    form.country === "United States"
      ? "ZIP code"
      : "Postal code (optional)";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Ken&apos; Dreah
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
          Checkout
        </h1>
      </div>

      <div className="mb-8 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
        <strong className="font-semibold">Demo checkout.</strong> No real
        payment is processed. Shipping rates are illustrative only.
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-xl text-ink">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-ink">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={(e) =>
                    updateField("country", e.target.value as ShippingCountry)
                  }
                  className="flex h-11 w-full border border-border bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                >
                  <option value="Belize">Belize</option>
                  <option value="United States">United States</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Street address</Label>
                <Input
                  id="street"
                  name="street"
                  autoComplete="street-address"
                  value={form.street}
                  onChange={(e) => updateField("street", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stateOrDistrict">{regionLabel}</Label>
                <Input
                  id="stateOrDistrict"
                  name="stateOrDistrict"
                  autoComplete="address-level1"
                  value={form.stateOrDistrict}
                  onChange={(e) =>
                    updateField("stateOrDistrict", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="postalCode">{postalLabel}</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  required={form.country === "United States"}
                />
              </div>
            </div>
            <p className="text-xs text-muted">{shippingInfo.note}</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-ink">Payment</h2>
            <p className="text-xs text-muted">
              Demonstration only — no card numbers or payment credentials are
              collected.
            </p>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 border border-border p-4 transition hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-warm-grey/40">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1 accent-pink"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    Card (Stripe demonstration)
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Simulated card checkout — no payment details required.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 border border-border p-4 transition hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-warm-grey/40">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="mt-1 accent-pink"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    PayPal demonstration
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Simulated PayPal flow — no account login required.
                  </span>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-border bg-soft-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto">
            {lines.map(({ item, product }) => (
              <li key={item.key} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 bg-warm-grey">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted">
                    Qty {item.quantity}
                    {(item.color || item.size) &&
                      ` · ${[item.color, item.size].filter(Boolean).join(" · ")}`}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatUSD(product.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatUSD(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{shippingInfo.label}</span>
              <span className="font-medium">{formatUSD(shipping)}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted">
              Illustrative demo rates — not final shipping pricing.
            </p>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <span className="font-medium text-ink">Total (USD)</span>
              <span className="font-semibold text-ink">{formatUSD(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting ? "Placing order…" : "Place Demo Order"}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
