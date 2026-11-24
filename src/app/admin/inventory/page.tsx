"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalogStore } from "@/store/catalog-store";
import { DEPARTMENT_LABELS } from "@/types";

export default function AdminInventoryPage() {
  const products = useCatalogStore((s) => s.products);
  const updateStock = useCatalogStore((s) => s.updateStock);
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [lowOnly, setLowOnly] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...products]
      .filter((p) => {
        if (lowOnly && p.stock > 5) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          DEPARTMENT_LABELS[p.department].toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.stock - b.stock);
  }, [products, query, lowOnly]);

  function setDraft(id: string, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }

  function applyStock(id: string) {
    const raw = drafts[id];
    if (raw == null || raw === "") return;
    const next = Math.max(0, Math.floor(Number(raw)));
    if (Number.isNaN(next)) return;
    updateStock(id, next);
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  const lowCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Demonstration inventory
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
          Inventory
        </h2>
        <p className="mt-2 text-sm text-muted">
          Quick stock updates write to the shared catalog store. Low stock is
          highlighted at ≤ 5 units.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory…"
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lowOnly}
              onChange={(e) => setLowOnly(e.target.checked)}
              className="h-4 w-4 accent-pink"
            />
            Low stock only ({lowCount})
          </label>
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-soft-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-warm-grey/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Current stock</th>
              <th className="px-4 py-3 font-medium">Quick update</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No inventory rows match.
                </td>
              </tr>
            ) : (
              rows.map((product) => {
                const isLow = product.stock <= 5;
                return (
                  <tr
                    key={product.id}
                    className={`border-t border-border ${
                      isLow ? "bg-pink-blush/60" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0]}
                          alt=""
                          className="h-12 w-10 object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {isLow && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-danger">
                              <AlertTriangle className="h-3 w-3" />
                              Low stock
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {DEPARTMENT_LABELS[product.department]}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          product.status === "sold_out"
                            ? "sale"
                            : product.status === "active"
                              ? "pink"
                              : "ink"
                        }
                      >
                        {product.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          isLow ? "text-lg font-semibold text-danger" : "font-medium"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-xs items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={drafts[product.id] ?? String(product.stock)}
                          onChange={(e) => setDraft(product.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") applyStock(product.id);
                          }}
                          className="h-9"
                          aria-label={`Stock for ${product.name}`}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => applyStock(product.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
