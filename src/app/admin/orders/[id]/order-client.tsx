"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  Money,
  StatusPill,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsClient } from "@/hooks/use-is-client";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useOrderStore } from "@/store/order-store";
import type { OrderStatus } from "@/types";

const TIMELINE: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export function OrderDetailClient({ id }: { id: string }) {
  const mounted = useIsClient();
  const order = useOrderStore((s) => s.getOrder(id));
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const setTracking = useOrderStore((s) => s.setTracking);
  const addNote = useOrderStore((s) => s.addNote);
  const simulateRefund = useOrderStore((s) => s.simulateRefund);
  const updateStock = useCatalogStore((s) => s.updateStock);
  const getProduct = useCatalogStore((s) => s.getProduct);
  const logAdjustment = useInventoryStore((s) => s.logAdjustment);
  const log = useActivityStore((s) => s.log);
  const [tracking, setTrackingInput] = useState("");
  const [note, setNote] = useState("");

  if (!mounted) return <p className="text-sm text-admin-muted">Loading…</p>;
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order is not available in the current demo dataset."
        action={
          <Button asChild variant="pink">
            <Link href="/admin/orders">Back to orders</Link>
          </Button>
        }
      />
    );
  }

  const statusIndex = TIMELINE.indexOf(
    order.status === "cancelled" ? "pending" : order.status
  );

  const setStatus = (status: OrderStatus, restoreStock = false) => {
    if (status === "cancelled" && order.status !== "cancelled") {
      if (!confirm("Cancel this order? Eligible stock will be restored once."))
        return;
    }
    if (status === "shipped" && !order.trackingNumber && !tracking.trim()) {
      toast.error("Add a tracking number before marking shipped.");
      return;
    }
    if (tracking.trim()) setTracking(order.id, tracking.trim());
    updateStatus(order.id, status);
    if (restoreStock && order.status !== "cancelled") {
      for (const item of order.items) {
        const product = getProduct(item.productId);
        if (!product) continue;
        const next = product.stock + item.quantity;
        updateStock(product.id, next);
        logAdjustment({
          productId: product.id,
          previousStock: product.stock,
          nextStock: next,
          delta: item.quantity,
          reason: `Order ${order.orderNumber} cancelled — stock restored`,
        });
      }
    }
    log({
      type: "order_status_changed",
      description: `Order ${order.orderNumber} → ${status}`,
      entityType: "order",
      entityId: order.id,
    });
    toast.success(`Order marked ${status}`);
  };

  return (
    <div>
      <AdminPageHeader
        title={order.orderNumber}
        description={`Placed ${new Date(order.createdAt).toLocaleString()} · Demo order`}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              Print summary
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">Back</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <AdminCard title="Items">
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 bg-neutral">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-admin-muted">
                      Qty {item.quantity}
                      {(item.color || item.size) &&
                        ` · ${[item.color, item.size].filter(Boolean).join(" · ")}`}
                    </p>
                  </div>
                  <Money amount={item.price * item.quantity} />
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <Money amount={order.subtotal} />
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-pink">
                  <span>Discount ({order.discountCode})</span>
                  <span>
                    -<Money amount={order.discountAmount} />
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Shipping</span>
                <Money amount={order.shipping} />
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <Money amount={order.total} />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Customer & delivery">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-admin-muted">Customer</dt>
                <dd className="font-medium">{order.shippingAddress.fullName}</dd>
                <dd>{order.shippingAddress.email}</dd>
                <dd>{order.shippingAddress.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-admin-muted">Address</dt>
                <dd>{order.shippingAddress.street}</dd>
                <dd>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.stateOrDistrict}{" "}
                  {order.shippingAddress.postalCode}
                </dd>
                <dd>{order.shippingAddress.country}</dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard title="Order timeline">
            {order.status === "cancelled" ? (
              <p className="text-sm text-danger">Order cancelled</p>
            ) : (
              <ol className="space-y-3">
                {TIMELINE.map((step, i) => {
                  const done = statusIndex >= i;
                  return (
                    <li key={step} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                          done
                            ? "bg-pink text-white"
                            : "bg-neutral text-admin-muted"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={
                          done ? "font-medium capitalize" : "capitalize text-admin-muted"
                        }
                      >
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </AdminCard>

          <AdminCard title="Internal notes">
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add note…"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!note.trim()) return;
                  addNote(order.id, note.trim());
                  log({
                    type: "note_added",
                    description: `Note on ${order.orderNumber}`,
                    entityId: order.id,
                    entityType: "order",
                  });
                  setNote("");
                  toast.success("Note added");
                }}
              >
                Add
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {(order.notes ?? []).map((n) => (
                <li key={n.id} className="border border-border px-3 py-2 text-sm">
                  <p>{n.text}</p>
                  <p className="mt-1 text-[11px] text-admin-muted">
                    {n.adminName} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title="Status">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fulfillment</span>
                <StatusPill tone="pink">{order.status}</StatusPill>
              </div>
              <div className="flex justify-between">
                <span>Payment</span>
                <StatusPill tone="success">{order.paymentStatus}</StatusPill>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between gap-2">
                  <span>Tracking</span>
                  <span className="font-medium">{order.trackingNumber}</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <Input
                value={tracking}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Tracking number"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStatus("processing")}
              >
                Mark processing
              </Button>
              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={() => setStatus("shipped")}
              >
                Mark shipped
              </Button>
              <Button
                type="button"
                variant="pink"
                className="w-full"
                onClick={() => setStatus("delivered")}
              >
                Mark delivered
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-danger"
                disabled={
                  order.status === "cancelled" || order.status === "delivered"
                }
                onClick={() => setStatus("cancelled", true)}
              >
                Cancel order
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={order.paymentStatus === "refunded"}
                onClick={() => {
                  if (
                    !confirm(
                      "Simulate refund? No real payment is processed."
                    )
                  )
                    return;
                  simulateRefund(order.id);
                  log({
                    type: "order_status_changed",
                    description: `Simulated refund for ${order.orderNumber}`,
                    entityId: order.id,
                    entityType: "order",
                  });
                  toast.success("Refund simulated");
                }}
              >
                Simulate refund
              </Button>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
