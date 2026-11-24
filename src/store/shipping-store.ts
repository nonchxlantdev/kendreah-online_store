"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SHIPPING } from "@/data/demo-storefront";
import type { ShippingMethodConfig } from "@/types/admin";
import type { ShippingCountry } from "@/types";

interface ShippingState {
  methods: ShippingMethodConfig[];
  update: (country: ShippingCountry, updates: Partial<ShippingMethodConfig>) => void;
  getForCountry: (country: ShippingCountry) => ShippingMethodConfig;
  quote: (
    country: ShippingCountry,
    subtotal: number,
    freeShippingCode?: boolean
  ) => { amount: number; label: string; note: string };
  reset: () => void;
}

export const useShippingStore = create<ShippingState>()(
  persist(
    (set, get) => ({
      methods: DEFAULT_SHIPPING,
      update: (country, updates) =>
        set((s) => ({
          methods: s.methods.map((m) =>
            m.country === country ? { ...m, ...updates, country } : m
          ),
        })),
      getForCountry: (country) =>
        get().methods.find((m) => m.country === country) ?? DEFAULT_SHIPPING[0],
      quote: (country, subtotal, freeShippingCode) => {
        const method = get().getForCountry(country);
        if (!method.enabled) {
          return {
            amount: 0,
            label: "Unavailable",
            note: "Shipping to this destination is disabled in demo settings.",
          };
        }
        const free =
          freeShippingCode ||
          (method.freeShippingThreshold != null &&
            subtotal >= method.freeShippingThreshold);
        return {
          amount: free ? 0 : method.flatRate,
          label: free ? `${method.methodName} · Free` : method.methodName,
          note: method.note,
        };
      },
      reset: () => set({ methods: DEFAULT_SHIPPING }),
    }),
    { name: "kendreah-shipping" }
  )
);
