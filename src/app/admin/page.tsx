"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, Boxes, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCatalogStore } from "@/store/catalog-store";
import { useOrderStore } from "@/store/order-store";
import { formatUSD } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const REVENUE_STATUSES: OrderStatus[] = [
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

function RevenueChart({ totals }: { totals: { label: string; total: number }[] }) {
  const max = Math.max(...totals.map((t) => t.total), 1);

  if (totals.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        No demonstration orders yet.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${Math.max(totals.length * 56, 320)} 180`}
        className="h-44 w-full min-w-[280px]"
        role="img"
        aria-label="Demonstration revenue by order"
      >
        {totals.map((item, i) => {
          const barHeight = (item.total / max) * 120;
          const x = 28 + i * 56;
          const y = 140 - barHeight;
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={36}
                height={barHeight}
                fill={i % 2 === 0 ? "#ec008c" : "#d4af37"}
              />
              <text
                x={x + 18}
                y={156}
                textAnchor="middle"
                className="fill-muted"
                fontSize="9"
              >
                {item.label}
              </text>
              <text
                x={x + 18}
                y={y - 6}
                textAnchor="middle"
                className="fill-ink"
                fontSize="8"
              >
                {formatUSD(item.total).replace(".00", "")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AdminOverviewPage() {
  const products = useCatalogStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);

  const metrics = useMemo(() => {
    const revenue = orders
      .filter((o) => REVENUE_STATUSES.includes(o.status))
      .reduce((sum, o) => sum + o.total, 0);
    const activeProducts = products.filter((p) => p.status === "active").length;
    const lowStock = products.filter((p) => p.stock <= 5);
    return {
      revenue,
      orderCount: orders.length,
      activeProducts,
      lowStockCount: lowStock.length,
      lowStock,
    };
  }, [orders, products]);

  const chartData = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((o) => ({
          label: o.orderNumber.slice(-4),
          total: o.total,
        })),
    [orders]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Demonstration data
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
          Overview
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Metrics below are illustrative demo figures computed from LocalStorage
          catalog and order data shared with the storefront.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total revenue",
            value: formatUSD(metrics.revenue),
            note: "Pending → delivered",
            icon: ShoppingBag,
          },
          {
            label: "Total orders",
            value: String(metrics.orderCount),
            note: "All demo orders",
            icon: ShoppingBag,
          },
          {
            label: "Active products",
            value: String(metrics.activeProducts),
            note: "Status = active",
            icon: Package,
          },
          {
            label: "Low stock",
            value: String(metrics.lowStockCount),
            note: "Stock ≤ 5",
            icon: Boxes,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="border border-border bg-soft-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  {card.label}
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold text-ink">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted">{card.note}</p>
              </div>
              <card.icon className="h-5 w-5 text-pink" />
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-wider text-gold-deep">
              Demonstration data
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="border border-border bg-soft-white p-5 xl:col-span-3">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold">
                Revenue by order
              </h3>
              <p className="text-xs text-muted">
                Simple demo chart — order totals over time
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold-deep">
              Demo
            </span>
          </div>
          <RevenueChart totals={chartData} />
        </section>

        <section className="border border-border bg-soft-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">
              Inventory alerts
            </h3>
            <Link
              href="/admin/inventory"
              className="text-xs font-medium text-pink hover:underline"
            >
              Manage
            </Link>
          </div>
          {metrics.lowStock.length === 0 ? (
            <p className="text-sm text-muted">No low-stock items right now.</p>
          ) : (
            <ul className="space-y-3">
              {metrics.lowStock.slice(0, 6).map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted">
                      {p.stock <= 0 ? "Sold out" : `${p.stock} left`}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-danger">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Low
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="border border-border bg-soft-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-serif text-lg font-semibold">Recent orders</h3>
            <p className="text-xs text-muted">Demonstration order activity</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-pink hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-warm-grey/70 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-muted"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">
                      <Link
                        href="/admin/orders"
                        className="hover:text-pink"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {order.shippingAddress.fullName}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_TONE[order.status]}>
                        {order.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">{formatUSD(order.total)}</td>
                    <td className="px-5 py-3 text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
