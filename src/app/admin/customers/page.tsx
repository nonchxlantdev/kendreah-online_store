"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  Money,
} from "@/components/admin/admin-ui";
import { customerStats, useCustomerStore } from "@/store/customer-store";
import { useOrderStore } from "@/store/order-store";
import type { ShippingCountry } from "@/types";

export default function AdminCustomersPage() {
  const customers = useCustomerStore((s) => s.customers);
  const orders = useOrderStore((s) => s.orders);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<ShippingCountry | "all">("all");

  const rows = useMemo(() => {
    return customerStats(customers, orders)
      .filter((c) => {
        if (country !== "all" && c.country !== country) return false;
        if (
          q &&
          !c.name.toLowerCase().includes(q.toLowerCase()) &&
          !c.email.toLowerCase().includes(q.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders, q, country]);

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Fictional demo customers only — no real personal data."
      />
      <AdminCard>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customers…"
            className="h-9 min-w-[12rem] flex-1 border border-border px-3 text-sm"
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as ShippingCountry | "all")}
            className="h-9 border border-border px-2 text-xs"
          >
            <option value="all">All countries</option>
            <option value="Belize">Belize</option>
            <option value="United States">United States</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
              <tr className="border-b border-border">
                <th className="py-2">Customer</th>
                <th className="py-2">Email</th>
                <th className="py-2">Country</th>
                <th className="py-2">Orders</th>
                <th className="py-2">Total spent</th>
                <th className="py-2">Last order</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/70">
                  <td className="py-2.5 font-medium">{c.name}</td>
                  <td className="py-2.5 text-admin-muted">{c.email}</td>
                  <td className="py-2.5">{c.country}</td>
                  <td className="py-2.5 tabular-nums">{c.orderCount}</td>
                  <td className="py-2.5"><Money amount={c.totalSpent} /></td>
                  <td className="py-2.5 text-admin-muted">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2.5 text-right">
                    <Link href={`/admin/customers/detail?id=${c.id}`} className="text-xs font-semibold text-pink">
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
