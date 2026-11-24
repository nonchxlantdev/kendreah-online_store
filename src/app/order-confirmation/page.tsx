"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";
import { formatUSD } from "@/lib/utils";
import { useOrderStore } from "@/store/order-store";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const mounted = useIsClient();
  const order = useOrderStore((s) =>
    orderId ? s.orders.find((o) => o.id === orderId) : undefined
  );

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted">Loading order…</p>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Order not found
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          We couldn&apos;t find that demo order. It may have been cleared, or
          the link is incomplete.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">View cart</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { shippingAddress: addr } = order;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <CheckCircle2 className="h-10 w-10 text-pink" strokeWidth={1.5} />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Demo order confirmed
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Thank you
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your demonstration order was placed successfully. No real payment
            was processed.
          </p>
        </div>
      </div>

      <div className="border border-border bg-soft-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Order number
            </p>
            <p className="mt-1 font-display text-2xl text-ink">
              {order.orderNumber}
            </p>
          </div>
          <p className="text-sm text-muted">
            {new Date(order.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <ul className="divide-y divide-border py-2">
          {order.items.map((item, index) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}-${index}`}
              className="flex gap-4 py-4"
            >
              <div className="relative h-20 w-16 shrink-0 bg-warm-grey">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Qty {item.quantity}
                  {(item.color || item.size) &&
                    ` · ${[item.color, item.size].filter(Boolean).join(" · ")}`}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">
                {formatUSD(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatUSD(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping (demo)</span>
            <span>{formatUSD(order.shipping)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <span className="font-medium text-ink">Total (USD)</span>
            <span className="font-semibold text-ink">
              {formatUSD(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs uppercase tracking-wider text-muted">
            Ship to
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{addr.fullName}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {addr.street}
            <br />
            {addr.city}, {addr.stateOrDistrict}
            {addr.postalCode ? ` ${addr.postalCode}` : ""}
            <br />
            {addr.country}
          </p>
          <p className="mt-2 text-xs text-muted">
            {addr.email} · {addr.phone}
          </p>
          <p className="mt-3 text-xs text-muted">
            Payment:{" "}
            {order.paymentMethod === "card"
              ? "Card (Stripe demonstration)"
              : "PayPal demonstration"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="default">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-sm text-muted">Loading order…</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
