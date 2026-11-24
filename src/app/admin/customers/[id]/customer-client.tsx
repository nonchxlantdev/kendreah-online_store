"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  Money,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsClient } from "@/hooks/use-is-client";
import { useActivityStore } from "@/store/activity-store";
import { customerStats, useCustomerStore } from "@/store/customer-store";
import { useOrderStore } from "@/store/order-store";

export function CustomerDetailClient({ id }: { id: string }) {
  const mounted = useIsClient();
  const customers = useCustomerStore((s) => s.customers);
  const addNote = useCustomerStore((s) => s.addNote);
  const orders = useOrderStore((s) => s.orders);
  const log = useActivityStore((s) => s.log);
  const [note, setNote] = useState("");

  const stats = useMemo(
    () => customerStats(customers, orders).find((c) => c.id === id),
    [customers, orders, id]
  );
  const theirs = useMemo(
    () =>
      orders.filter(
        (o) =>
          stats &&
          o.shippingAddress.email.toLowerCase() === stats.email.toLowerCase()
      ),
    [orders, stats]
  );

  if (!mounted) return <p className="text-sm text-admin-muted">Loading…</p>;
  if (!stats) {
    return (
      <EmptyState
        title="Customer not found"
        description="This demo customer record is unavailable."
        action={
          <Button asChild variant="pink">
            <Link href="/admin/customers">Back</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={stats.name}
        description={`${stats.email} · Fictional demo customer`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/customers">Back</Link>
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard title="Contact">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-xs text-admin-muted">Phone</dt>
              <dd>{stats.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-admin-muted">Country</dt>
              <dd>{stats.country}</dd>
            </div>
            <div>
              <dt className="text-xs text-admin-muted">City</dt>
              <dd>{stats.city}</dd>
            </div>
          </dl>
        </AdminCard>
        <AdminCard title="Lifetime value">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Orders</span>
              <span className="tabular-nums">{stats.orderCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total spent</span>
              <Money amount={stats.totalSpent} />
            </div>
            <div className="flex justify-between">
              <span>Average order</span>
              <Money amount={stats.aov} />
            </div>
          </dl>
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
                addNote(stats.id, note.trim());
                log({
                  type: "note_added",
                  description: `Customer note: ${stats.name}`,
                  entityType: "customer",
                  entityId: stats.id,
                });
                setNote("");
                toast.success("Note saved");
              }}
            >
              Add
            </Button>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.notes.map((n) => (
              <li key={n.id} className="border border-border px-2 py-1.5">
                {n.text}
                <p className="text-[11px] text-admin-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
      <AdminCard title="Order history" className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
            <tr className="border-b border-border">
              <th className="py-2">Order</th>
              <th className="py-2">Date</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {theirs.map((o) => (
              <tr key={o.id} className="border-b border-border/70">
                <td className="py-2">
                  <Link
                    href={`/admin/orders/detail?id=${o.id}`}
                    className="font-medium text-pink"
                  >
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="py-2">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2">
                  <Money amount={o.total} />
                </td>
                <td className="py-2 capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
