"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/store/order-store";
import { formatUSD } from "@/lib/utils";
import type { DemoCustomer, ShippingCountry } from "@/types";

function deriveCustomers(
  orders: ReturnType<typeof useOrderStore.getState>["orders"]
): DemoCustomer[] {
  const map = new Map<
    string,
    {
      name: string;
      email: string;
      country: ShippingCountry;
      orders: number;
      totalSpent: number;
    }
  >();

  for (const order of orders) {
    const email = order.shippingAddress.email.trim().toLowerCase();
    if (!email) continue;
    const existing = map.get(email);
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += order.total;
      existing.name = order.shippingAddress.fullName || existing.name;
      existing.country = order.shippingAddress.country;
    } else {
      map.set(email, {
        name: order.shippingAddress.fullName,
        email: order.shippingAddress.email,
        country: order.shippingAddress.country,
        orders: 1,
        totalSpent: order.total,
      });
    }
  }

  return Array.from(map.entries())
    .map(([key, value]) => ({
      id: `cust_${key}`,
      ...value,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export default function AdminCustomersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [query, setQuery] = useState("");

  const customers = useMemo(() => deriveCustomers(orders), [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Derived demo data
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
          Customers
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          These profiles are aggregated from demonstration orders by email —
          not a real CRM or authenticated customer database.
        </p>
      </div>

      <div className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
        Label: derived demo data from LocalStorage orders. Changes to order
        status or new checkouts update this list automatically.
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, country…"
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto border border-border bg-soft-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-warm-grey/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No derived customers yet. Place a demo order on the
                  storefront to populate this table.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.country}</td>
                  <td className="px-4 py-3">{customer.orders}</td>
                  <td className="px-4 py-3">{formatUSD(customer.totalSpent)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
