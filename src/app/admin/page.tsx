"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  DollarSign,
  Download,
  ExternalLink,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AdminCard,
  AdminPageHeader,
  KpiCard,
  Money,
  StatusPill,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  computeKPIs,
  filterOrdersByRange,
  ordersByStatus,
  percentChange,
  revenueByDay,
  salesByCountry,
  salesByDepartment,
  topProducts,
  type DateRangeKey,
} from "@/lib/admin-analytics";
import { rangeStart } from "@/lib/date";
import { formatUSD } from "@/lib/utils";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useInventoryStore, stockStatus } from "@/store/inventory-store";
import { useOrderStore } from "@/store/order-store";

const RANGE_OPTIONS: { value: DateRangeKey; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

const STATUS_TONE = {
  pending: "warning",
  processing: "pink",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
} as const;

const PIE_COLORS = ["#EC008C", "#D4AF37", "#150E13", "#667085", "#DC2626"];

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DateRangeKey>("30d");
  const orders = useOrderStore((s) => s.orders);
  const products = useCatalogStore((s) => s.products);
  const activity = useActivityStore((s) => s.entries);
  const getThreshold = useInventoryStore((s) => s.getThreshold);

  const filtered = useMemo(
    () => filterOrdersByRange(orders, range),
    [orders, range]
  );
  const previous = useMemo(() => {
    if (range === "all" || range === "today") return [];
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const end = rangeStart(range);
    if (!end) return [];
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    return orders.filter((o) => {
      const t = new Date(o.createdAt);
      return t >= start && t < end;
    });
  }, [orders, range]);

  const kpis = computeKPIs(filtered);
  const prevKpis = computeKPIs(previous);
  const revenueSeries = revenueByDay(filtered, range === "7d" ? 7 : 14);
  const statusData = ordersByStatus(filtered);
  const marketData = salesByCountry(filtered);
  const categoryData = salesByDepartment(filtered, products);
  const tops = topProducts(filtered, 5);
  const recent = [...filtered].slice(0, 8);
  const lowStock = products
    .filter((p) => p.status !== "draft")
    .map((p) => ({
      product: p,
      status: stockStatus(p.stock, getThreshold(p.id)),
    }))
    .filter((r) => r.status !== "in_stock")
    .slice(0, 6);

  const exportCsv = () => {
    const rows = [
      ["orderNumber", "date", "customer", "country", "total", "status"],
      ...filtered.map((o) => [
        o.orderNumber,
        o.createdAt,
        o.shippingAddress.fullName,
        o.shippingAddress.country,
        String(o.total),
        o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kendreah-demo-report-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Here's what's happening with your store today. Figures are calculated from simulated demo orders."
        actions={
          <>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRangeKey)}
              className="h-9 border border-border bg-white px-2 text-xs font-semibold uppercase tracking-wider"
              aria-label="Date range"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4" />
              Export report
            </Button>
            <Button asChild variant="pink" size="sm">
              <Link href="/">
                <ExternalLink className="h-4 w-4" />
                View store
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={formatUSD(kpis.revenue)}
          change={percentChange(kpis.revenue, prevKpis.revenue)}
          comparison="vs prior period"
          icon={DollarSign}
        />
        <KpiCard
          label="Total orders"
          value={String(kpis.orderCount)}
          change={percentChange(kpis.orderCount, prevKpis.orderCount)}
          comparison="vs prior period"
          icon={ShoppingBag}
        />
        <KpiCard
          label="Customers"
          value={String(kpis.customers)}
          change={percentChange(kpis.customers, prevKpis.customers)}
          comparison="vs prior period"
          icon={Users}
        />
        <KpiCard
          label="Average order value"
          value={formatUSD(kpis.aov)}
          change={percentChange(kpis.aov, prevKpis.aov)}
          comparison="vs prior period"
          icon={Package}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <AdminCard title="Revenue performance" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Bar dataKey="total" fill="#EC008C" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Orders by status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-admin-muted">
            {statusData.map((s) => (
              <li key={s.status} className="flex justify-between capitalize">
                <span>{s.status}</span>
                <span className="tabular-nums text-ink">{s.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <AdminCard title="Sales by market">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Bar dataKey="total" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Sales by category">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Bar dataKey="total" fill="#EC008C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <AdminCard
          title="Recent orders"
          className="xl:col-span-2 overflow-x-auto"
          action={
            <Link href="/admin/orders" className="text-xs font-semibold text-pink">
              View all
            </Link>
          }
        >
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
              <tr className="border-b border-border">
                <th className="py-2 font-semibold">Order</th>
                <th className="py-2 font-semibold">Customer</th>
                <th className="py-2 font-semibold">Destination</th>
                <th className="py-2 font-semibold">Total</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-border/70">
                  <td className="py-2.5 font-medium">{o.orderNumber}</td>
                  <td className="py-2.5">{o.shippingAddress.fullName}</td>
                  <td className="py-2.5 text-admin-muted">
                    {o.shippingAddress.country}
                  </td>
                  <td className="py-2.5">
                    <Money amount={o.total} />
                  </td>
                  <td className="py-2.5">
                    <StatusPill tone={STATUS_TONE[o.status]}>
                      {o.status}
                    </StatusPill>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      href={`/admin/orders/detail?id=${o.id}`}
                      className="text-xs font-semibold text-pink"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>

        <div className="space-y-5">
          <AdminCard title="Top selling products">
            <ul className="space-y-3">
              {tops.map((p) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <div className="relative h-12 w-10 shrink-0 bg-neutral">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-admin-muted">
                      {p.units} sold · {formatUSD(p.revenue)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </AdminCard>
          <AdminCard title="Low stock alerts">
            {lowStock.length === 0 ? (
              <p className="text-sm text-admin-muted">No low-stock items.</p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map(({ product, status }) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <AlertTriangle
                        className={
                          status === "out" ? "h-3.5 w-3.5 text-danger" : "h-3.5 w-3.5 text-warning"
                        }
                      />
                      <span className="truncate">{product.name}</span>
                    </span>
                    <span className="tabular-nums text-admin-muted">
                      {product.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </div>

      <AdminCard title="Recent activity" className="mt-5">
        <ul className="divide-y divide-border">
          {activity.slice(0, 8).map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div>
                <p className="text-ink">{a.description}</p>
                <p className="mt-0.5 text-xs text-admin-muted">
                  {a.adminName} · {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
