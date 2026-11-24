"use client";

import { useMemo, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import type { ActivityType } from "@/types/admin";
import { useActivityStore } from "@/store/activity-store";

const TYPES: Array<ActivityType | "all"> = [
  "all",
  "product_created",
  "product_updated",
  "product_archived",
  "inventory_adjusted",
  "order_status_changed",
  "order_placed",
  "discount_created",
  "discount_updated",
  "storefront_published",
  "settings_updated",
  "category_updated",
  "shipping_updated",
  "note_added",
  "demo_reset",
];

export default function AdminActivityPage() {
  const entries = useActivityStore((s) => s.entries);
  const [type, setType] = useState<ActivityType | "all">("all");

  const filtered = useMemo(
    () => entries.filter((e) => type === "all" || e.type === type),
    [entries, type]
  );

  return (
    <div>
      <AdminPageHeader
        title="Activity log"
        description="Persistent administrative actions recorded in this browser."
      />
      <AdminCard>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType | "all")}
          className="mb-4 h-9 border border-border px-2 text-xs"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All activity types" : t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <ul className="divide-y divide-border">
          {filtered.map((e) => (
            <li key={e.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-ink">{e.description}</p>
                <p className="text-xs text-admin-muted">
                  {e.type.replace(/_/g, " ")}
                  {e.entityId ? ` · ${e.entityType}:${e.entityId}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-xs text-admin-muted">
                {e.adminName} · {new Date(e.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
