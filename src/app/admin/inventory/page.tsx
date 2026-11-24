"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminCard,
  AdminPageHeader,
  StatusPill,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { stockStatus, useInventoryStore } from "@/store/inventory-store";
import { formatUSD } from "@/lib/utils";

export default function AdminInventoryPage() {
  const products = useCatalogStore((s) => s.products);
  const updateStock = useCatalogStore((s) => s.updateStock);
  const getThreshold = useInventoryStore((s) => s.getThreshold);
  const setThreshold = useInventoryStore((s) => s.setThreshold);
  const logAdjustment = useInventoryStore((s) => s.logAdjustment);
  const adjustments = useInventoryStore((s) => s.adjustments);
  const log = useActivityStore((s) => s.log);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const rows = useMemo(
    () =>
      products
        .filter((p) => p.status !== "draft")
        .map((p) => {
          const threshold = getThreshold(p.id);
          return { product: p, threshold, status: stockStatus(p.stock, threshold) };
        }),
    [products, getThreshold]
  );

  const totals = {
    units: rows.reduce((s, r) => s + r.product.stock, 0),
    inStock: rows.filter((r) => r.status === "in_stock").length,
    low: rows.filter((r) => r.status === "low").length,
    out: rows.filter((r) => r.status === "out").length,
    value: rows.reduce(
      (s, r) => s + r.product.stock * (r.product.cost ?? r.product.price * 0.45),
      0
    ),
  };

  const apply = (productId: string, mode: "set" | "inc" | "dec") => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const raw = Number(drafts[productId] ?? "");
    if (Number.isNaN(raw)) {
      toast.error("Enter a valid quantity");
      return;
    }
    let next = product.stock;
    if (mode === "set") next = Math.max(0, Math.floor(raw));
    if (mode === "inc") next = product.stock + Math.max(0, Math.floor(raw));
    if (mode === "dec") next = Math.max(0, product.stock - Math.max(0, Math.floor(raw)));
    const reason = reasons[productId]?.trim() || "Manual adjustment";
    updateStock(productId, next);
    logAdjustment({
      productId,
      previousStock: product.stock,
      nextStock: next,
      delta: next - product.stock,
      reason,
    });
    log({
      type: "inventory_adjusted",
      description: `Inventory ${product.name}: ${product.stock} → ${next}`,
      entityType: "product",
      entityId: productId,
    });
    toast.success("Stock updated");
    setDrafts((d) => ({ ...d, [productId]: "" }));
  };

  return (
    <div>
      <AdminPageHeader
        title="Inventory"
        description="Stock levels sync with storefront availability. Negative stock is prevented."
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total units", String(totals.units)],
          ["In stock", String(totals.inStock)],
          ["Low stock", String(totals.low)],
          ["Out of stock", String(totals.out)],
          ["Est. inventory value", formatUSD(totals.value)],
        ].map(([label, value]) => (
          <AdminCard key={label} className="!p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
              {label}
            </p>
            <p className="mt-2 font-display text-xl font-semibold tabular-nums">{value}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
            <tr className="border-b border-border">
              <th className="py-2">Product</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Available</th>
              <th className="py-2">Threshold</th>
              <th className="py-2">Status</th>
              <th className="py-2">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, threshold, status }) => (
              <tr key={product.id} className="border-b border-border/70 align-top">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 bg-neutral">
                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 text-admin-muted">{product.sku ?? "—"}</td>
                <td className="py-3 tabular-nums">{product.stock}</td>
                <td className="py-3">
                  <Input
                    type="number"
                    min={0}
                    className="h-9 w-20"
                    value={threshold}
                    onChange={(e) => setThreshold(product.id, Number(e.target.value))}
                  />
                </td>
                <td className="py-3">
                  <StatusPill tone={status === "out" ? "danger" : status === "low" ? "warning" : "success"}>
                    {status === "out" ? "Out" : status === "low" ? "Low" : "In stock"}
                  </StatusPill>
                </td>
                <td className="py-3">
                  <div className="flex flex-col gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Qty"
                      className="h-9 w-24"
                      value={drafts[product.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [product.id]: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Reason"
                      className="h-9 w-40"
                      value={reasons[product.id] ?? ""}
                      onChange={(e) =>
                        setReasons((d) => ({ ...d, [product.id]: e.target.value }))
                      }
                    />
                    <div className="flex gap-1">
                      <Button type="button" size="sm" variant="outline" onClick={() => apply(product.id, "inc")}>+</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => apply(product.id, "dec")}>−</Button>
                      <Button type="button" size="sm" variant="default" onClick={() => apply(product.id, "set")}>Set</Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      <AdminCard title="Adjustment history" className="mt-5">
        {adjustments.length === 0 ? (
          <p className="text-sm text-admin-muted">No adjustments yet in this browser.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {adjustments.slice(0, 20).map((a) => (
              <li key={a.id} className="flex justify-between gap-3 py-2">
                <span>
                  {a.reason} ({a.previousStock} → {a.nextStock})
                </span>
                <span className="text-xs text-admin-muted">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
      <p className="mt-3 text-xs text-admin-muted">
        Estimated value uses product cost when available, otherwise 45% of selling price (demo heuristic).
      </p>
    </div>
  );
}
