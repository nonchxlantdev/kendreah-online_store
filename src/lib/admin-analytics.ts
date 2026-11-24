import { inRange, type DateRangeKey } from "@/lib/date";
import type { Order, Product } from "@/types";
import { DEPARTMENT_LABELS, type Department } from "@/types";

export function filterOrdersByRange(orders: Order[], range: DateRangeKey) {
  return orders.filter((o) => inRange(o.createdAt, range));
}

export function revenueOrders(orders: Order[]) {
  return orders.filter((o) => o.status !== "cancelled");
}

export function computeKPIs(orders: Order[]) {
  const active = revenueOrders(orders);
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const orderCount = active.length;
  const emails = new Set(active.map((o) => o.shippingAddress.email.toLowerCase()));
  const customers = emails.size;
  const aov = orderCount ? revenue / orderCount : 0;
  return { revenue, orderCount, customers, aov };
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function revenueByDay(orders: Order[], days = 14) {
  const active = revenueOrders(orders);
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, 0);
  }
  for (const o of active) {
    const key = o.createdAt.slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + o.total);
  }
  return Array.from(map.entries()).map(([date, total]) => ({
    date,
    label: date.slice(5),
    total: Math.round(total * 100) / 100,
  }));
}

export function ordersByStatus(orders: Order[]) {
  const counts: Record<string, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const o of orders) counts[o.status] = (counts[o.status] ?? 0) + 1;
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export function salesByCountry(orders: Order[]) {
  const map: Record<string, number> = { Belize: 0, "United States": 0 };
  for (const o of revenueOrders(orders)) {
    map[o.shippingAddress.country] =
      (map[o.shippingAddress.country] ?? 0) + o.total;
  }
  return Object.entries(map).map(([country, total]) => ({
    country,
    total: Math.round(total * 100) / 100,
  }));
}

export function salesByDepartment(orders: Order[], products: Product[]) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const map: Record<Department, number> = {
    clothes: 0,
    footwear: 0,
    appliances: 0,
  };
  for (const o of revenueOrders(orders)) {
    for (const item of o.items) {
      const dept = byId.get(item.productId)?.department;
      if (dept) map[dept] += item.price * item.quantity;
    }
  }
  return (Object.keys(map) as Department[]).map((dept) => ({
    department: dept,
    label: DEPARTMENT_LABELS[dept],
    total: Math.round(map[dept] * 100) / 100,
  }));
}

export function topProducts(orders: Order[], limit = 5) {
  const map = new Map<
    string,
    { productId: string; name: string; image: string; units: number; revenue: number }
  >();
  for (const o of revenueOrders(orders)) {
    for (const item of o.items) {
      const cur = map.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        image: item.image,
        units: 0,
        revenue: 0,
      };
      cur.units += item.quantity;
      cur.revenue += item.price * item.quantity;
      map.set(item.productId, cur);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, limit);
}

export function paymentMethodBreakdown(orders: Order[]) {
  const map: Record<string, number> = { card: 0, paypal: 0 };
  for (const o of revenueOrders(orders)) {
    map[o.paymentMethod] = (map[o.paymentMethod] ?? 0) + 1;
  }
  return Object.entries(map).map(([method, count]) => ({ method, count }));
}

export type { DateRangeKey };
