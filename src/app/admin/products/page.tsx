"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCatalogStore } from "@/store/catalog-store";
import { formatUSD } from "@/lib/utils";
import {
  DEPARTMENT_LABELS,
  type Department,
  type Product,
  type ProductStatus,
} from "@/types";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&h=1200&q=80";

const DEPARTMENTS: Department[] = ["clothes", "footwear", "appliances"];
const STATUSES: ProductStatus[] = ["active", "draft", "sold_out"];

type ProductFormState = {
  name: string;
  slug: string;
  department: Department;
  price: string;
  compareAt: string;
  stock: string;
  status: ProductStatus;
  shortDescription: string;
  imageUrl: string;
  isFeatured: boolean;
  isNew: boolean;
};

const emptyForm = (): ProductFormState => ({
  name: "",
  slug: "",
  department: "clothes",
  price: "",
  compareAt: "",
  stock: "10",
  status: "active",
  shortDescription: "",
  imageUrl: PLACEHOLDER_IMAGE,
  isFeatured: false,
  isNew: false,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    department: product.department,
    price: String(product.price),
    compareAt:
      product.compareAtPrice != null ? String(product.compareAtPrice) : "",
    stock: String(product.stock),
    status: product.status,
    shortDescription: product.shortDescription,
    imageUrl: product.images[0] ?? PLACEHOLDER_IMAGE,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
  };
}

function selectClassName() {
  return "flex h-11 w-full border border-border bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
}

export default function AdminProductsPage() {
  const products = useCatalogStore((s) => s.products);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const setStatus = useCatalogStore((s) => s.setStatus);

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        DEPARTMENT_LABELS[p.department].toLowerCase().includes(q) ||
        p.status.includes(q)
    );
  }, [products, query]);

  const deleteTarget = products.find((p) => p.id === deleteId);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm(productToForm(product));
    setSlugTouched(true);
    setFormOpen(true);
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugTouched && !editingId) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Math.max(0, Math.floor(Number(form.stock) || 0));
    const compareAt = form.compareAt.trim()
      ? Number(form.compareAt)
      : undefined;
    if (!form.name.trim() || !form.slug.trim() || Number.isNaN(price)) return;

    const image = form.imageUrl.trim() || PLACEHOLDER_IMAGE;
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug) || slugify(form.name),
      department: form.department,
      price,
      compareAtPrice:
        compareAt != null && !Number.isNaN(compareAt) ? compareAt : undefined,
      stock,
      status: form.status,
      shortDescription: form.shortDescription.trim() || form.name.trim(),
      description:
        form.shortDescription.trim() ||
        `${form.name.trim()} — demonstration product for Ken' Dreah.`,
      images: [image],
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      specs: {},
    };

    if (editingId) {
      const existing = products.find((p) => p.id === editingId);
      updateProduct(editingId, {
        ...payload,
        images: existing?.images?.length
          ? [image, ...existing.images.slice(1)]
          : [image],
        specs: existing?.specs ?? {},
        sizes: existing?.sizes,
        colors: existing?.colors,
      });
    } else {
      addProduct(payload);
    }

    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteProduct(deleteId);
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Demonstration catalog
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
            Products
          </h2>
          <p className="mt-2 text-sm text-muted">
            Edits sync live with the storefront via shared LocalStorage.
          </p>
        </div>
        <Button type="button" variant="pink" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, slug, department…"
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto border border-border bg-soft-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-warm-grey/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No products match your search.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-12 w-10 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{product.name}</p>
                        <p className="truncate text-xs text-muted">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {DEPARTMENT_LABELS[product.department]}
                  </td>
                  <td className="px-4 py-3">
                    <div>{formatUSD(product.price)}</div>
                    {product.compareAtPrice != null && (
                      <div className="text-xs text-muted line-through">
                        {formatUSD(product.compareAtPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock <= 5 ? "font-semibold text-danger" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        product.status === "active"
                          ? "pink"
                          : product.status === "sold_out"
                            ? "sale"
                            : "ink"
                      }
                    >
                      {product.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {[
                      product.isFeatured ? "Featured" : null,
                      product.isNew ? "New" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      {product.status !== "sold_out" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setStatus(product.id, "sold_out")}
                        >
                          Sold out
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-danger hover:bg-danger/10"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit product" : "Add product"}
            </DialogTitle>
            <DialogDescription>
              Demonstration catalog entry — changes appear on the storefront.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField("slug", e.target.value);
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                className={selectClassName()}
                value={form.department}
                onChange={(e) =>
                  updateField("department", e.target.value as Department)
                }
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {DEPARTMENT_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAt">Compare at</Label>
              <Input
                id="compareAt"
                type="number"
                min="0"
                step="0.01"
                value={form.compareAt}
                onChange={(e) => updateField("compareAt", e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className={selectClassName()}
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as ProductStatus)
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shortDescription">Short description</Label>
              <textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) =>
                  updateField("shortDescription", e.target.value)
                }
                rows={3}
                className="flex w-full border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder={PLACEHOLDER_IMAGE}
              />
              <p className="text-xs text-muted">
                Leave as the Unsplash placeholder or paste a first-image URL.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="h-4 w-4 accent-pink"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => updateField("isNew", e.target.checked)}
                className="h-4 w-4 accent-pink"
              />
              New
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="pink">
                {editingId ? "Save changes" : "Create product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This removes{" "}
              <strong>{deleteTarget?.name ?? "this product"}</strong> from the
              demonstration catalog. The storefront will update immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="pink" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
