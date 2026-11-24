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

export default function AdminStorefrontPage() {
  const draft = useStorefrontStore((s) => s.draft);
  const updateAnnouncement = useStorefrontStore((s) => s.updateAnnouncement);
  const updateHero = useStorefrontStore((s) => s.updateHero);
  const updatePromo = useStorefrontStore((s) => s.updatePromo);
  const updateBrand = useStorefrontStore((s) => s.updateBrand);
  const setFeatured = useStorefrontStore((s) => s.setFeatured);
  const publish = useStorefrontStore((s) => s.publish);
  const restoreDefaults = useStorefrontStore((s) => s.restoreDefaults);
  const products = useCatalogStore((s) => s.products);
  const log = useActivityStore((s) => s.log);

  const activeProducts = products.filter((p) => p.status === "active");

  return (
    <div>
      <AdminPageHeader
        title="Storefront"
        description="Update public homepage content without code. Publish to apply immediately in this browser."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!confirm("Restore default storefront content?")) return;
                restoreDefaults();
                toast.success("Defaults restored (draft + published)");
              }}
            >
              Restore defaults
            </Button>
            <Button
              type="button"
              variant="pink"
              size="sm"
              onClick={() => {
                publish();
                log({
                  type: "storefront_published",
                  description: "Published storefront content",
                  entityType: "storefront",
                });
                toast.success("Published to storefront");
              }}
            >
              Publish changes
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <AdminCard title="Announcement bar">
            <div className="space-y-3">
              <div>
                <Label>Text</Label>
                <Input
                  className="mt-1"
                  value={draft.announcement.text}
                  onChange={(e) => updateAnnouncement({ text: e.target.value })}
                />
              </div>
              <div>
                <Label>Background colour</Label>
                <Input
                  type="color"
                  className="mt-1 h-11 w-20 p-1"
                  value={draft.announcement.backgroundColor}
                  onChange={(e) =>
                    updateAnnouncement({ backgroundColor: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-pink"
                  checked={draft.announcement.visible}
                  onChange={(e) =>
                    updateAnnouncement({ visible: e.target.checked })
                  }
                />
                Visible
              </label>
            </div>
          </AdminCard>

          <AdminCard title="Homepage hero">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["eyebrow", "Eyebrow"],
                  ["heading", "Heading"],
                  ["supporting", "Supporting text"],
                  ["image", "Image URL"],
                  ["primaryLabel", "Primary button label"],
                  ["primaryHref", "Primary button link"],
                  ["secondaryLabel", "Secondary button label"],
                  ["secondaryHref", "Secondary button link"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={key === "supporting" || key === "heading" ? "sm:col-span-2" : ""}>
                  <Label>{label}</Label>
                  <Input
                    className="mt-1"
                    value={draft.hero[key]}
                    onChange={(e) => updateHero({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Featured products">
            <p className="mb-3 text-xs text-admin-muted">
              Select products to feature. Leave empty to use catalogue featured flags.
            </p>
            <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
              {activeProducts.map((p) => {
                const on = draft.featuredProductIds.includes(p.id);
                return (
                  <label key={p.id} className="flex items-center gap-2 border border-border px-2 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-pink"
                      checked={on}
                      onChange={() => {
                        const next = on
                          ? draft.featuredProductIds.filter((id) => id !== p.id)
                          : [...draft.featuredProductIds, p.id];
                        setFeatured(next);
                      }}
                    />
                    <span className="truncate">{p.name}</span>
                  </label>
                );
              })}
            </div>
          </AdminCard>

          <AdminCard title="Promotional campaign">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["title", "Title"],
                  ["description", "Description"],
                  ["image", "Image URL"],
                  ["buttonText", "Button text"],
                  ["href", "Destination"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
                  <Label>{label}</Label>
                  <Input
                    className="mt-1"
                    value={draft.promo[key]}
                    onChange={(e) => updatePromo({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-pink"
                checked={draft.promo.visible}
                onChange={(e) => updatePromo({ visible: e.target.checked })}
              />
              Visible
            </label>
          </AdminCard>

          <AdminCard title="Store information">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["tagline", "Tagline"],
                  ["aboutBlurb", "About blurb"],
                  ["contactEmail", "Contact email"],
                  ["contactPhone", "Contact phone"],
                  ["socialInstagram", "Instagram"],
                  ["socialFacebook", "Facebook"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={key === "aboutBlurb" ? "sm:col-span-2" : ""}>
                  <Label>{label}</Label>
                  <Input
                    className="mt-1"
                    value={draft.brand[key]}
                    onChange={(e) => updateBrand({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <AdminCard title="Live preview">
          <div
            className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white"
            style={{ background: draft.announcement.backgroundColor }}
          >
            {draft.announcement.visible ? draft.announcement.text : "(hidden)"}
          </div>
          <div className="relative mt-3 aspect-[4/5] bg-ink">
            <Image src={draft.hero.image} alt="" fill className="object-cover opacity-70" sizes="320px" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="text-[10px] uppercase tracking-wider text-pink-soft">
                {draft.hero.eyebrow}
              </p>
              <p className="mt-1 font-display text-lg font-bold uppercase whitespace-pre-line">
                {draft.hero.heading}
              </p>
              <p className="mt-2 text-xs text-white/80">{draft.hero.supporting}</p>
            </div>
          </div>
          {draft.promo.visible && (
            <div className="relative mt-3 aspect-video bg-neutral">
              <Image src={draft.promo.image} alt="" fill className="object-cover" sizes="320px" />
              <div className="absolute inset-0 bg-ink/40 p-3 text-white">
                <p className="font-display text-sm font-bold">{draft.promo.title}</p>
                <p className="mt-1 text-xs">{draft.promo.description}</p>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-admin-muted">
            Preview reflects draft. Click Publish to update the public homepage.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
