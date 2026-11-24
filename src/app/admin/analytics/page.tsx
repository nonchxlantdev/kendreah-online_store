"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AdminCard,
  AdminPageHeader,
  Money,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  computeKPIs,
  filterOrdersByRange,
  paymentMethodBreakdown,
  revenueByDay,
  salesByCountry,
  salesByDepartment,
  topProducts,
  type DateRangeKey,
} from "@/lib/admin-analytics";
import { formatUSD } from "@/lib/utils";
import { useCatalogStore } from "@/store/catalog-store";
import { useOrderStore } from "@/store/order-store";

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<DateRangeKey>("30d");
  const orders = useOrderStore((s) => s.orders);
  const products = useCatalogStore((s) => s.products);
  const filtered = useMemo(
    () => filterOrdersByRange(orders, range),
    [orders, range]
  );
  const kpis = computeKPIs(filtered);
  const series = revenueByDay(filtered, range === "7d" ? 7 : 30);
  const markets = salesByCountry(filtered);
  const categories = salesByDepartment(filtered, products);
  const tops = topProducts(filtered, 8);
  const payments = paymentMethodBreakdown(filtered);

  const emails = filtered
    .filter((o) => o.status !== "cancelled")
    .map((o) => o.shippingAddress.email.toLowerCase());
  const unique = new Set(emails);
  const returning = [...unique].filter(
    (e) => emails.filter((x) => x === e).length > 1
  ).length;
  const firstTime = unique.size - returning;

  const exportCsv = () => {
    const rows = [
      ["metric", "value"],
      ["revenue", String(kpis.revenue)],
      ["orders", String(kpis.orderCount)],
      ["aov", String(kpis.aov)],
      ...tops.map((t) => [`product:${t.name}`, String(t.revenue)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kendreah-analytics-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="All metrics are derived from the shared demo order and product dataset."
        actions={
          <>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRangeKey)}
              className="h-9 border border-border bg-white px-2 text-xs"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Revenue", formatUSD(kpis.revenue)],
          ["Orders", String(kpis.orderCount)],
          ["AOV", formatUSD(kpis.aov)],
        ].map(([label, value]) => (
          <AdminCard key={label} className="!p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
              {label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
              {value}
            </p>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="Revenue over time" className="mt-5">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatUSD(Number(v))} />
              <Line type="monotone" dataKey="total" stroke="#EC008C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AdminCard>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <AdminCard title="Sales by destination">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Bar dataKey="total" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Sales by category">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Bar dataKey="total" fill="#EC008C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <AdminCard title="Top products" className="lg:col-span-2">
          <ul className="divide-y divide-border text-sm">
            {tops.map((p) => (
              <li key={p.productId} className="flex justify-between py-2">
                <span>{p.name}</span>
                <span className="text-admin-muted">
                  {p.units} · <Money amount={p.revenue} />
                </span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard title="Customers & payments">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><span>First-time</span><span>{firstTime}</span></div>
            <div className="flex justify-between"><span>Returning</span><span>{returning}</span></div>
            {payments.map((p) => (
              <div key={p.method} className="flex justify-between capitalize">
                <span>{p.method}</span>
                <span>{p.count}</span>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-admin-muted">
            No fabricated traffic or conversion rates — only order-backed metrics.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
