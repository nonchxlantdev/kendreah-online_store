"use client";

import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusPill } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivityStore } from "@/store/activity-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useCustomerStore } from "@/store/customer-store";
import { useDiscountStore } from "@/store/discount-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useOrderStore } from "@/store/order-store";
import { useSettingsStore } from "@/store/settings-store";
import { useShippingStore } from "@/store/shipping-store";
import { useStorefrontStore } from "@/store/storefront-store";

export default function AdminSettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const resetSettings = useSettingsStore((s) => s.reset);
  const log = useActivityStore((s) => s.log);
  const resetOrders = useOrderStore((s) => s.resetOrders);
  const resetProducts = useCatalogStore((s) => s.resetProducts);
  const resetCustomers = useCustomerStore((s) => s.reset);
  const resetDiscounts = useDiscountStore((s) => s.reset);
  const resetShipping = useShippingStore((s) => s.reset);
  const restoreStorefront = useStorefrontStore((s) => s.restoreDefaults);
  const resetInventory = useInventoryStore((s) => s.reset);
  const resetActivity = useActivityStore((s) => s.reset);

  const exportDemo = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      note: "Browser-local demo export only.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kendreah-demo-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Store configuration for the demonstration. Payments remain in Demo Mode."
      />

      <div className="space-y-5">
        <AdminCard title="General">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["storeName", "Store name"],
                ["storeEmail", "Store email"],
                ["businessPhone", "Business phone"],
                ["launchNote", "Launch information"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  className="mt-1"
                  value={settings[key]}
                  onChange={(e) => update({ [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-admin-muted">
            Currency: <strong className="text-ink">USD</strong> · Markets: Belize & United States
          </p>
          <Button
            type="button"
            variant="pink"
            className="mt-4"
            onClick={() => {
              log({ type: "settings_updated", description: "Updated general settings", entityType: "settings" });
              toast.success("Settings saved");
            }}
          >
            Save general
          </Button>
        </AdminCard>

        <AdminCard title="Payments">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Stripe", settings.stripeStatus],
              ["PayPal", settings.paypalStatus],
            ].map(([name, status]) => (
              <div key={name} className="border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{name}</p>
                  <StatusPill tone="warning">
                    {status === "demo" ? "Demo Mode" : "Not Connected"}
                  </StatusPill>
                </div>
                <p className="mt-2 text-xs text-admin-muted">
                  No API keys collected. Providers are not operational in this demo.
                </p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Notifications">
          <div className="space-y-2 text-sm">
            {(
              [
                ["notifyNewOrders", "New orders"],
                ["notifyLowInventory", "Low inventory"],
                ["notifyCancellations", "Order cancellations"],
                ["notifyInquiries", "Customer inquiries"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-pink"
                  checked={settings[key]}
                  onChange={(e) => update({ [key]: e.target.checked })}
                />
                {label} (simulated preference)
              </label>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Policies (draft)">
          <div className="grid gap-3">
            {(
              [
                ["deliveryPolicy", "Delivery policy"],
                ["returnPolicy", "Return policy"],
                ["privacyPolicy", "Privacy policy"],
                ["termsPolicy", "Terms and conditions"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <textarea
                  className="mt-1 min-h-24 w-full border border-border px-3 py-2 text-sm"
                  value={settings[key]}
                  onChange={(e) => update({ [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Demo management">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={exportDemo}>
              Export demo data
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                restoreStorefront();
                toast.success("Storefront content restored");
              }}
            >
              Restore default storefront
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-danger"
              onClick={() => {
                if (
                  !confirm(
                    "Reset all demo data in this browser? Orders, products, discounts, and settings will revert to seeds."
                  )
                )
                  return;
                resetOrders();
                resetProducts();
                resetCustomers();
                resetDiscounts();
                resetShipping();
                restoreStorefront();
                resetSettings();
                resetInventory();
                resetActivity();
                log({ type: "demo_reset", description: "Reset demo data to defaults" });
                toast.success("Demo data reset");
              }}
            >
              Reset demo data
            </Button>
          </div>
          <p className="mt-3 text-xs text-admin-muted">
            Persistence is browser LocalStorage only — not a production database.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
