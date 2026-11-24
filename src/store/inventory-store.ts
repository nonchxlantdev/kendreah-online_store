"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_PRODUCTS } from "@/data/products";
import { createId } from "@/lib/utils";
import type { InventoryAdjustment } from "@/types/admin";

interface InventoryState {
  thresholds: Record<string, number>;
  adjustments: InventoryAdjustment[];
  setThreshold: (productId: string, threshold: number) => void;
  logAdjustment: (input: Omit<InventoryAdjustment, "id" | "createdAt" | "adminName"> & { adminName?: string }) => void;
  getThreshold: (productId: string) => number;
  reset: () => void;
}

const DEFAULT_THRESHOLDS: Record<string, number> = Object.fromEntries(
  INITIAL_PRODUCTS.map((p) => [p.id, p.stock <= 5 ? 8 : 5])
);

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      thresholds: DEFAULT_THRESHOLDS,
      adjustments: [],
      setThreshold: (productId, threshold) =>
        set((s) => ({
          thresholds: {
            ...s.thresholds,
            [productId]: Math.max(0, Math.floor(threshold)),
          },
        })),
      logAdjustment: (input) => {
        const row: InventoryAdjustment = {
          id: createId("adj"),
          productId: input.productId,
          previousStock: input.previousStock,
          nextStock: input.nextStock,
          delta: input.delta,
          reason: input.reason,
          createdAt: new Date().toISOString(),
          adminName: input.adminName ?? "Demo Admin",
        };
        set((s) => ({
          adjustments: [row, ...s.adjustments].slice(0, 300),
        }));
      },
      getThreshold: (productId) => get().thresholds[productId] ?? 5,
      reset: () =>
        set({ thresholds: DEFAULT_THRESHOLDS, adjustments: [] }),
    }),
    { name: "kendreah-inventory-meta" }
  )
);

export function stockStatus(
  stock: number,
  threshold: number
): "in_stock" | "low" | "out" {
  if (stock <= 0) return "out";
  if (stock <= threshold) return "low";
  return "in_stock";
}
