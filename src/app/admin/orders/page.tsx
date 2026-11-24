"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  Money,
  StatusPill,
} from "@/components/admin/admin-ui";
import type { OrderStatus, PaymentStatus, ShippingCountry } from "@/types";
import { useOrderStore } from "@/store/order-store";

const FULFILLMENT: Array<OrderStatus | "all"> = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [country, setCountry] = useState<ShippingCountry | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (payment !== "all" && o.paymentStatus !== payment) return false;
      if (country !== "all" && o.shippingAddress.country !== country) return false;
      if (
        q &&
        !o.orderNumber.toLowerCase().includes(q.toLowerCase()) &&
        !o.shippingAddress.fullName.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, status, payment, country, q]);

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Fulfillment and payment statuses for simulated demo checkouts."
      />
      <AdminCard>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders…"
            className="h-9 min-w-[12rem] flex-1 border border-border px-3 text-sm"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")} className="h-9 border border-border px-2 text-xs">
            {FULFILLMENT.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>
            ))}
          </select>
          <select value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus | "all")} className="h-9 border border-border px-2 text-xs">
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value as ShippingCountry | "all")} className="h-9 border border-border px-2 text-xs">
            <option value="all">All destinations</option>
            <option value="Belize">Belize</option>
            <option value="United States">United States</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
              <tr className="border-b border-border">
                <th className="py-2">Order</th>
                <th className="py-2">Date</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Destination</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Fulfillment</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/70">
                  <td className="py-2.5 font-medium">{o.orderNumber}</td>
                  <td className="py-2.5 text-admin-muted">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5">{o.shippingAddress.fullName}</td>
                  <td className="py-2.5">{o.shippingAddress.country}</td>
                  <td className="py-2.5 tabular-nums">
                    {o.items.reduce((n, i) => n + i.quantity, 0)}
                  </td>
                  <td className="py-2.5"><Money amount={o.total} /></td>
                  <td className="py-2.5">
                    <StatusPill tone={o.paymentStatus === "paid" ? "success" : o.paymentStatus === "refunded" ? "warning" : "danger"}>
                      {o.paymentStatus}
                    </StatusPill>
                  </td>
                  <td className="py-2.5">
                    <StatusPill
                      tone={
                        o.status === "delivered"
                          ? "success"
                          : o.status === "cancelled"
                            ? "danger"
                            : o.status === "pending"
                              ? "warning"
                              : "pink"
                      }
                    >
                      {o.status}
                    </StatusPill>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link href={`/admin/orders/detail?id=${o.id}`} className="text-xs font-semibold text-pink">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
