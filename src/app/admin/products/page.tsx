"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AdminCard,
  AdminPageHeader,
  Money,
  StatusPill,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEPARTMENT_LABELS, type Department, type ProductStatus } from "@/types";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { createId } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = useCatalogStore((s) => s.products);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const setStatus = useCatalogStore((s) => s.setStatus);
  const log = useActivityStore((s) => s.log);

  const [q, setQ] = useState("");
  const [dept, setDept] = useState<Department | "all">("all");
  const [status, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [stock, setStock] = useState<"all" | "in" | "low" | "out">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.sku?.toLowerCase().includes(q.toLowerCase()))
          return false;
        if (dept !== "all" && p.department !== dept) return false;
        if (status !== "all" && p.status !== status) return false;
        if (stock === "out" && p.stock > 0) return false;
        if (stock === "low" && (p.stock <= 0 || p.stock > (p.lowStockThreshold ?? 5)))
          return false;
        if (stock === "in" && p.stock <= (p.lowStockThreshold ?? 5)) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, q, dept, status, stock]);

  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const toggleAll = () => {
    if (selected.length === pageItems.length) setSelected([]);
    else setSelected(pageItems.map((p) => p.id));
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage catalogue items shown on the public storefront."
        actions={
          <Button asChild variant="pink" size="sm">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <AdminCard>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search products…"
              className="h-9 pl-9"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value as Department | "all")}
            className="h-9 border border-border bg-white px-2 text-xs"
          >
            <option value="all">All categories</option>
            <option value="clothes">Clothing</option>
            <option value="footwear">Footwear</option>
            <option value="appliances">Home & Living</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "all")}
            className="h-9 border border-border bg-white px-2 text-xs"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="sold_out">Sold out</option>
          </select>
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value as typeof stock)}
            className="h-9 border border-border bg-white px-2 text-xs"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 border border-border bg-admin-bg px-3 py-2 text-sm">
            <span className="text-admin-muted">{selected.length} selected</span>
            <button
              type="button"
              className="font-semibold text-pink"
              onClick={() => {
                selected.forEach((id) => setStatus(id, "draft"));
                log({ type: "product_archived", description: `Archived ${selected.length} products` });
                toast.success("Selected products archived (draft)");
                setSelected([]);
              }}
            >
              Archive
            </button>
            <button
              type="button"
              className="font-semibold text-danger"
              onClick={() => {
                if (!confirm("Delete selected products? This cannot be undone in this browser."))
                  return;
                selected.forEach((id) => deleteProduct(id));
                toast.success("Products deleted");
                setSelected([]);
              }}
            >
              Delete
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-admin-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-2">
                  <input type="checkbox" checked={selected.length === pageItems.length && pageItems.length > 0} onChange={toggleAll} aria-label="Select page" />
                </th>
                <th className="py-2">Product</th>
                <th className="py-2">SKU</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Inventory</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className="border-b border-border/70">
                  <td className="py-2.5 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() =>
                        setSelected((s) =>
                          s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]
                        )
                      }
                      aria-label={`Select ${p.name}`}
                    />
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 bg-neutral">
                        <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                      <Link href={`/admin/products/edit?id=${p.id}`} className="font-medium hover:text-pink">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-2.5 text-admin-muted">{p.sku ?? "—"}</td>
                  <td className="py-2.5">{DEPARTMENT_LABELS[p.department]}</td>
                  <td className="py-2.5"><Money amount={p.price} /></td>
                  <td className="py-2.5 tabular-nums">{p.stock}</td>
                  <td className="py-2.5">
                    <StatusPill
                      tone={
                        p.status === "active"
                          ? "success"
                          : p.status === "draft"
                            ? "ink"
                            : "danger"
                      }
                    >
                      {p.status}
                    </StatusPill>
                  </td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <Link href={`/admin/products/edit?id=${p.id}`} className="text-pink">Edit</Link>
                      <button
                        type="button"
                        className="text-ink"
                        onClick={() => {
                          const copy = addProduct({
                            ...p,
                            id: createId("p"),
                            name: `${p.name} (Copy)`,
                            slug: `${p.slug}-copy-${Date.now().toString(36)}`,
                            status: "draft",
                          });
                          log({ type: "product_created", description: `Duplicated ${p.name}`, entityId: copy.id, entityType: "product" });
                          toast.success("Product duplicated as draft");
                        }}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="text-danger"
                        onClick={() => {
                          if (!confirm(`Delete ${p.name}?`)) return;
                          deleteProduct(p.id);
                          toast.success("Deleted");
                        }}
                      >
                        <Trash2 className="inline h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-admin-muted">
            {filtered.length} products · page {page + 1} / {pages}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
