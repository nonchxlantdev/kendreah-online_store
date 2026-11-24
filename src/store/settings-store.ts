"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_STORE_SETTINGS } from "@/data/demo-storefront";
import type { StoreSettings } from "@/types/admin";

interface SettingsState {
  settings: StoreSettings;
  update: (updates: Partial<StoreSettings>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_STORE_SETTINGS,
      update: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),
      reset: () => set({ settings: DEFAULT_STORE_SETTINGS }),
    }),
    { name: "kendreah-settings" }
  )
);
