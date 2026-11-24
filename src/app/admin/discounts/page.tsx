"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AdminCard,
  AdminPageHeader,
  StatusPill,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivityStore } from "@/store/activity-store";
import { useDiscountStore } from "@/store/discount-store";
import type { DiscountType } from "@/types/admin";

export default function AdminDiscountsPage() {
  const discounts = useDiscountStore((s) => s.discounts);
  const add = useDiscountStore((s) => s.add);
  const setActive = useDiscountStore((s) => s.setActive);
  const remove = useDiscountStore((s) => s.remove);
  const log = useActivityStore((s) => s.log);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "percentage" as DiscountType,
    value: 10,
    minOrderValue: 0,
  });

  const list = discounts.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <AdminPageHeader
        title="Discounts"
        description="Coupon codes integrate with demo checkout. Expired/inactive codes are rejected."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <AdminCard>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search discounts…"
            className="mb-4 h-9 w-full border border-border px-3 text-sm"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
                <tr className="border-b border-border">
                  <th className="py-2">Name</th>
                  <th className="py-2">Code</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Value</th>
                  <th className="py-2">Uses</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d.id} className="border-b border-border/70">
                    <td className="py-2.5 font-medium">{d.name}</td>
                    <td className="py-2.5 font-mono text-xs">{d.code}</td>
                    <td className="py-2.5 capitalize">{d.type.replace("_", " ")}</td>
                    <td className="py-2.5">
                      {d.type === "percentage"
                        ? `${d.value}%`
                        : d.type === "fixed"
                          ? `$${d.value}`
                          : "Free ship"}
                    </td>
                    <td className="py-2.5 tabular-nums">
                      {d.usageCount}
                      {d.usageLimit != null ? ` / ${d.usageLimit}` : ""}
                    </td>
                    <td className="py-2.5">
                      <StatusPill tone={d.active ? "success" : "ink"}>
                        {d.active ? "Active" : "Inactive"}
                      </StatusPill>
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-2 text-xs font-semibold">
                        <button
                          type="button"
                          className="text-pink"
                          onClick={() => {
                            setActive(d.id, !d.active);
                            log({
                              type: "discount_updated",
                              description: `${d.active ? "Deactivated" : "Activated"} ${d.code}`,
                              entityType: "discount",
                              entityId: d.id,
                            });
                          }}
                        >
                          {d.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          className="text-danger"
                          onClick={() => {
                            if (!confirm(`Delete ${d.code}?`)) return;
                            remove(d.id);
                            toast.success("Discount deleted");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <AdminCard title="Create discount">
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Code</Label>
              <Input className="mt-1" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="mt-1 flex h-11 w-full border border-border px-3 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
                <option value="free_shipping">Free shipping</option>
              </select>
            </div>
            {form.type !== "free_shipping" && (
              <div>
                <Label>Value</Label>
                <Input type="number" min={0} className="mt-1" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              </div>
            )}
            <div>
              <Label>Minimum order (USD)</Label>
              <Input type="number" min={0} className="mt-1" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} />
            </div>
            <Button
              type="button"
              variant="pink"
              className="w-full"
              onClick={() => {
                if (!form.name.trim() || !form.code.trim()) {
                  toast.error("Name and code are required");
                  return;
                }
                const created = add({
                  name: form.name.trim(),
                  code: form.code.trim().toUpperCase(),
                  type: form.type,
                  value: form.value,
                  minOrderValue: form.minOrderValue || undefined,
                  applicableDepartments: "all",
                  startsAt: new Date().toISOString(),
                  endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
                  active: true,
                });
                log({
                  type: "discount_created",
                  description: `Created discount ${created.code}`,
                  entityType: "discount",
                  entityId: created.id,
                });
                toast.success("Discount created");
                setForm({ name: "", code: "", type: "percentage", value: 10, minOrderValue: 0 });
              }}
            >
              Create discount
            </Button>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
