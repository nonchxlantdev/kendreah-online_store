"use client";

import Image from "next/image";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useStorefrontStore } from "@/store/storefront-store";

export default function AdminCategoriesPage() {
  const categories = useStorefrontStore((s) => s.categories);
  const updateCategory = useStorefrontStore((s) => s.updateCategory);
  const reorderCategories = useStorefrontStore((s) => s.reorderCategories);
  const products = useCatalogStore((s) => s.products);
  const log = useActivityStore((s) => s.log);

  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= sorted.length) return;
    const ids = sorted.map((c) => c.id);
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    reorderCategories(ids);
    log({ type: "category_updated", description: "Reordered categories", entityType: "category" });
    toast.success("Category order updated");
  };

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Clothing, Footwear and Home & Living — synced with storefront navigation."
      />
      <div className="grid gap-4">
        {[...categories]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((cat) => {
            const count = products.filter((p) => p.department === cat.id).length;
            return (
              <AdminCard key={cat.id}>
                <div className="grid gap-4 md:grid-cols-[120px_1fr_auto]">
                  <div className="relative h-28 w-full bg-neutral md:h-full md:min-h-[7rem]">
                    <Image src={cat.image} alt="" fill className="object-cover" sizes="120px" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        className="mt-1"
                        value={cat.name}
                        onChange={(e) =>
                          updateCategory(cat.id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <textarea
                        className="mt-1 min-h-20 w-full border border-border px-3 py-2 text-sm"
                        value={cat.description}
                        onChange={(e) =>
                          updateCategory(cat.id, { description: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Image path / URL</Label>
                      <Input
                        className="mt-1"
                        value={cat.image}
                        onChange={(e) =>
                          updateCategory(cat.id, { image: e.target.value })
                        }
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="accent-pink"
                        checked={cat.visible}
                        onChange={(e) =>
                          updateCategory(cat.id, { visible: e.target.checked })
                        }
                      />
                      Visible on storefront
                    </label>
                    <p className="text-xs text-admin-muted">
                      {count} associated products — deletion blocked while products remain assigned.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => move(cat.id, -1)}>
                      Move up
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => move(cat.id, 1)}>
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="pink"
                      size="sm"
                      onClick={() => {
                        log({
                          type: "category_updated",
                          description: `Updated category ${cat.name}`,
                          entityType: "category",
                          entityId: cat.id,
                        });
                        toast.success("Category saved");
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-danger"
                      onClick={() => {
                        if (count > 0) {
                          toast.error("Reassign products before deleting this category.");
                          return;
                        }
                        toast.message("Core demo categories cannot be removed.");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </AdminCard>
            );
          })}
      </div>
    </div>
  );
}
