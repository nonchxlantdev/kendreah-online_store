"use client";

import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useOrderStore } from "@/store/order-store";
import { formatUSD } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_TONE: Record<OrderStatus, "ink" | "pink" | "gold" | "sale"> = {
  pending: "gold",
  processing: "pink",
  shipped: "ink",
  delivered: "sale",
};

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? sorted
        : sorted.filter((o) => o.status === statusFilter),
    [sorted, statusFilter]
  );

  const selected: Order | undefined = orders.find((o) => o.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Demonstration orders
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
            Orders
          </h2>
          <p className="mt-2 text-sm text-muted">
            Update fulfillment status — storefront order history uses the same
            data.
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="statusFilter" className="text-xs text-muted">
            Filter status
          </Label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatus | "all")
            }
            className="flex h-11 min-w-[180px] border border-border bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-soft-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-warm-grey/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>{order.shippingAddress.fullName}</div>
                    <div className="text-xs text-muted">
                      {order.shippingAddress.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.reduce((n, i) => n + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3">{formatUSD(order.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="h-9 border border-border bg-white px-2 text-xs capitalize"
                      aria-label={`Status for ${order.orderNumber}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedId(order.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Detail
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.orderNumber}</DialogTitle>
                <DialogDescription>
                  Demonstration order detail — not a live fulfillment system.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={STATUS_TONE[selected.status]}>
                    {selected.status}
                  </Badge>
                  <span className="text-muted">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <Label className="text-xs text-muted">Update status</Label>
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      updateStatus(selected.id, e.target.value as OrderStatus)
                    }
                    className="mt-1 flex h-11 w-full border border-border bg-white px-3 text-sm capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border border-border p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Ship to
                  </p>
                  <p className="mt-2 font-medium">
                    {selected.shippingAddress.fullName}
                  </p>
                  <p className="text-muted">{selected.shippingAddress.email}</p>
                  <p className="text-muted">{selected.shippingAddress.phone}</p>
                  <p className="mt-2">
                    {selected.shippingAddress.street}
                    <br />
                    {selected.shippingAddress.city},{" "}
                    {selected.shippingAddress.stateOrDistrict}{" "}
                    {selected.shippingAddress.postalCode}
                    <br />
                    {selected.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted">
                    Items
                  </p>
                  <ul className="space-y-3">
                    {selected.items.map((item, idx) => (
                      <li
                        key={`${item.productId}-${idx}`}
                        className="flex gap-3 border-b border-border pb-3 last:border-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          className="h-14 w-11 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted">
                            {[item.size, item.color].filter(Boolean).join(" · ") ||
                              "—"}
                          </p>
                          <p className="text-xs text-muted">
                            Qty {item.quantity} × {formatUSD(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatUSD(item.price * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatUSD(selected.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span>{formatUSD(selected.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatUSD(selected.total)}</span>
                  </div>
                  <p className="pt-1 text-xs capitalize text-muted">
                    Payment: {selected.paymentMethod}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
