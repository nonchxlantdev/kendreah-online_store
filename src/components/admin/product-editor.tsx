"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { withBase } from "@/lib/assets";
import { createId } from "@/lib/utils";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import type { Department, Product, ProductStatus } from "@/types";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const log = useActivityStore((s) => s.log);

  const [name, setName] = useState(product?.name ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [department, setDepartment] = useState<Department>(
    product?.department ?? "clothes"
  );
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [tags, setTags] = useState((product?.tags ?? []).join(", "));
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : [withBase("/products/floral-1.jpg")]
  );
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ?? undefined
  );
  const [cost, setCost] = useState(product?.cost ?? undefined);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold ?? 5
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#EC008C");
  const [colors, setColors] = useState(product?.colors ?? []);
  const [weight, setWeight] = useState(product?.specs?.weight ?? "");
  const [dimensions, setDimensions] = useState(product?.specs?.dimensions ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);

  const margin = useMemo(() => {
    if (cost == null || price <= 0) return null;
    return ((price - cost) / price) * 100;
  }, [price, cost]);

  const sizeOptions =
    department === "footwear"
      ? SHOE_SIZES
      : department === "clothes"
        ? CLOTHING_SIZES
        : [];

  const save = (nextStatus: ProductStatus) => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }
    const payload = {
      name: name.trim(),
      slug: product?.slug || slugify(name) || createId("slug"),
      department,
      shortDescription: shortDescription.trim() || name.trim(),
      description: description.trim() || shortDescription.trim() || name.trim(),
      price: Number(price) || 0,
      compareAtPrice: compareAtPrice || undefined,
      cost: cost ?? undefined,
      sku: sku || undefined,
      images: images.length ? images : [withBase("/products/floral-1.jpg")],
      stock: Math.max(0, Math.floor(stock)),
      lowStockThreshold: Math.max(0, Math.floor(lowStockThreshold)),
      sizes: department === "appliances" ? undefined : sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isNew,
      isFeatured,
      status: nextStatus === "active" && stock <= 0 ? "sold_out" : nextStatus,
      specs: {
        ...(product?.specs ?? {}),
        weight: weight || undefined,
        dimensions: dimensions || undefined,
      },
    };

    if (product) {
      updateProduct(product.id, payload);
      log({
        type: "product_updated",
        description: `Updated product ${payload.name}`,
        entityType: "product",
        entityId: product.id,
      });
      toast.success("Product saved");
      router.push("/admin/products");
    } else {
      const created = addProduct(payload);
      log({
        type: "product_created",
        description: `Created product ${payload.name}`,
        entityType: "product",
        entityId: created.id,
      });
      toast.success(
        nextStatus === "draft" ? "Saved as draft" : "Product published"
      );
      router.push(`/admin/products/edit?id=${created.id}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={product ? "Edit product" : "New product"}
        description="Changes sync to the public storefront when status is active."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => save("draft")}>
              Save as draft
            </Button>
            <Button type="button" variant="pink" size="sm" onClick={() => save("active")}>
              Save product
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <AdminCard title="General information">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Product name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="short">Short description</Label>
                <Input id="short" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-28 w-full border border-border px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <select
                    value={department}
                    onChange={(e) => {
                      const d = e.target.value as Department;
                      setDepartment(d);
                      if (d === "appliances") setSizes([]);
                    }}
                    className="mt-1 flex h-11 w-full border border-border bg-white px-3 text-sm"
                  >
                    <option value="clothes">Clothing</option>
                    <option value="footwear">Footwear</option>
                    <option value="appliances">Home & Living</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="mt-1 flex h-11 w-full border border-border bg-white px-3 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold_out">Sold out</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" />
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-pink" />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="accent-pink" />
                  New arrival
                </label>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Media">
            <div className="flex flex-wrap gap-2">
              {images.map((src, i) => (
                <div key={src + i} className="relative h-24 w-20 bg-neutral">
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 bg-white/90 px-1 text-[10px]"
                    onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL or /products/….jpg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!imageUrl.trim()) return;
                  const src = imageUrl.startsWith("http") || imageUrl.startsWith("/")
                    ? imageUrl.startsWith("/products") || imageUrl.startsWith("http")
                      ? imageUrl.startsWith("http")
                        ? imageUrl
                        : withBase(imageUrl)
                      : withBase(imageUrl)
                    : withBase(`/products/${imageUrl}`);
                  setImages((imgs) => [...imgs, src]);
                  setImageUrl("");
                }}
              >
                Add
              </Button>
            </div>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block text-admin-muted">Upload preview (local only)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setImages((imgs) => [...imgs, url]);
                  toast.message("Local preview added — not uploaded to a server in this demo.");
                }}
              />
            </label>
          </AdminCard>

          <AdminCard title="Pricing">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Selling price (USD)</Label>
                <Input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Compare-at price</Label>
                <Input type="number" min={0} step={0.01} value={compareAtPrice ?? ""} onChange={(e) => setCompareAtPrice(e.target.value === "" ? undefined : Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Cost per item</Label>
                <Input type="number" min={0} step={0.01} value={cost ?? ""} onChange={(e) => setCost(e.target.value === "" ? undefined : Number(e.target.value))} className="mt-1" />
              </div>
            </div>
            {margin != null && (
              <p className="mt-3 text-sm text-admin-muted">
                Estimated margin: <strong className="text-ink">{margin.toFixed(1)}%</strong>
              </p>
            )}
          </AdminCard>

          <AdminCard title="Inventory">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Available quantity</Label>
                <Input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Low-stock threshold</Label>
                <Input type="number" min={0} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} className="mt-1" />
              </div>
            </div>
          </AdminCard>

          {department !== "appliances" && (
            <AdminCard title="Variants">
              <p className="mb-2 text-xs text-admin-muted">
                {department === "footwear" ? "Shoe sizes" : "Clothing sizes"}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((s) => {
                  const on = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setSizes((cur) =>
                          on ? cur.filter((x) => x !== s) : [...cur, s]
                        )
                      }
                      className={`border px-2.5 py-1.5 text-xs ${on ? "border-ink bg-ink text-white" : "border-border"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <Label>Colours</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className="inline-flex items-center gap-2 border border-border px-2 py-1 text-xs"
                      onClick={() => setColors((list) => list.filter((x) => x.name !== c.name))}
                    >
                      <span className="h-3 w-3" style={{ background: c.hex }} />
                      {c.name} ×
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Colour name" className="max-w-[10rem]" />
                  <Input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="h-11 w-14 p-1" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!colorName.trim()) return;
                      setColors((list) => [...list, { name: colorName.trim(), hex: colorHex }]);
                      setColorName("");
                    }}
                  >
                    Add colour
                  </Button>
                </div>
              </div>
            </AdminCard>
          )}

          <AdminCard title="Shipping information">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Weight</Label>
                <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1" placeholder="e.g. 0.8 lb" />
              </div>
              <div>
                <Label>Dimensions</Label>
                <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="mt-1" placeholder="e.g. 12 × 8 × 2 in" />
              </div>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-4">
          <AdminCard title="Summary">
            <p className="text-sm text-admin-muted">
              Active products appear in the storefront. Draft and sold-out items are not purchasable.
            </p>
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
