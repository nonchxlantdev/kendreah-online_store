"use client";

import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivityStore } from "@/store/activity-store";
import { useShippingStore } from "@/store/shipping-store";

export default function AdminShippingPage() {
  const methods = useShippingStore((s) => s.methods);
  const update = useShippingStore((s) => s.update);
  const log = useActivityStore((s) => s.log);

  return (
    <div>
      <AdminPageHeader
        title="Shipping"
        description="Sample rates for Belize and the United States — clearly demo values pending client confirmation."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {methods.map((m) => (
          <AdminCard key={m.country} title={m.country}>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-pink"
                  checked={m.enabled}
                  onChange={(e) => update(m.country, { enabled: e.target.checked })}
                />
                Destination available
              </label>
              <div>
                <Label>Method name</Label>
                <Input
                  className="mt-1"
                  value={m.methodName}
                  onChange={(e) => update(m.country, { methodName: e.target.value })}
                />
              </div>
              <div>
                <Label>Flat rate (USD)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  className="mt-1"
                  value={m.flatRate}
                  onChange={(e) => update(m.country, { flatRate: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Free-shipping threshold (USD)</Label>
                <Input
                  type="number"
                  min={0}
                  className="mt-1"
                  value={m.freeShippingThreshold ?? ""}
                  onChange={(e) =>
                    update(m.country, {
                      freeShippingThreshold:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Estimated delivery window</Label>
                <Input
                  className="mt-1"
                  value={m.estimatedDelivery}
                  onChange={(e) =>
                    update(m.country, { estimatedDelivery: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Internal note</Label>
                <textarea
                  className="mt-1 min-h-20 w-full border border-border px-3 py-2 text-sm"
                  value={m.note}
                  onChange={(e) => update(m.country, { note: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="pink"
                onClick={() => {
                  log({
                    type: "shipping_updated",
                    description: `Updated shipping for ${m.country}`,
                    entityType: "shipping",
                  });
                  toast.success("Shipping settings saved for checkout demo");
                }}
              >
                Save {m.country}
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
