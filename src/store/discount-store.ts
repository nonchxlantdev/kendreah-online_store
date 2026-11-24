"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_DISCOUNTS } from "@/data/demo-discounts";
import { createId } from "@/lib/utils";
import type { Discount } from "@/types/admin";
import type { Department } from "@/types";

interface DiscountState {
  discounts: Discount[];
  add: (input: Omit<Discount, "id" | "createdAt" | "usageCount">) => Discount;
  update: (id: string, updates: Partial<Discount>) => void;
  remove: (id: string) => void;
  setActive: (id: string, active: boolean) => void;
  incrementUsage: (id: string) => void;
  validateCode: (
    code: string,
    subtotal: number,
    departments: Department[]
  ) => { ok: true; discount: Discount; amount: number } | { ok: false; error: string };
  reset: () => void;
}

function computeAmount(discount: Discount, subtotal: number) {
  if (discount.type === "percentage") {
    return Math.round(subtotal * (discount.value / 100) * 100) / 100;
  }
  if (discount.type === "fixed") {
    return Math.min(subtotal, discount.value);
  }
  return 0;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      discounts: SEED_DISCOUNTS,
      add: (input) => {
        const discount: Discount = {
          ...input,
          id: createId("disc"),
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ discounts: [discount, ...s.discounts] }));
        return discount;
      },
      update: (id, updates) =>
        set((s) => ({
          discounts: s.discounts.map((d) =>
            d.id === id ? { ...d, ...updates, id: d.id } : d
          ),
        })),
      remove: (id) =>
        set((s) => ({ discounts: s.discounts.filter((d) => d.id !== id) })),
      setActive: (id, active) =>
        set((s) => ({
          discounts: s.discounts.map((d) =>
            d.id === id ? { ...d, active } : d
          ),
        })),
      incrementUsage: (id) =>
        set((s) => ({
          discounts: s.discounts.map((d) =>
            d.id === id ? { ...d, usageCount: d.usageCount + 1 } : d
          ),
        })),
      validateCode: (code, subtotal, departments) => {
        const discount = get().discounts.find(
          (d) => d.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (!discount) return { ok: false, error: "Invalid discount code." };
        if (!discount.active)
          return { ok: false, error: "This discount is inactive." };
        const now = Date.now();
        if (new Date(discount.startsAt).getTime() > now)
          return { ok: false, error: "This discount is not active yet." };
        if (discount.endsAt && new Date(discount.endsAt).getTime() < now)
          return { ok: false, error: "This discount has expired." };
        if (
          discount.usageLimit != null &&
          discount.usageCount >= discount.usageLimit
        )
          return { ok: false, error: "This discount has reached its usage limit." };
        if (
          discount.minOrderValue != null &&
          subtotal < discount.minOrderValue
        )
          return {
            ok: false,
            error: `Minimum order of $${discount.minOrderValue} required.`,
          };
        if (discount.applicableDepartments !== "all") {
          const ok = departments.some((d) =>
            discount.applicableDepartments.includes(d)
          );
          if (!ok)
            return {
              ok: false,
              error: "Code not valid for items in your bag.",
            };
        }
        const amount =
          discount.type === "free_shipping"
            ? 0
            : computeAmount(discount, subtotal);
        return { ok: true, discount, amount };
      },
      reset: () => set({ discounts: SEED_DISCOUNTS }),
    }),
    { name: "kendreah-discounts" }
  )
);
