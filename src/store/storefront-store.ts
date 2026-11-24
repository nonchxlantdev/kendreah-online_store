"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_STOREFRONT_CONTENT,
} from "@/data/demo-storefront";
import type { CategoryRecord, StorefrontContent } from "@/types/admin";
import type { Department } from "@/types";

interface StorefrontState {
  draft: StorefrontContent;
  published: StorefrontContent;
  categories: CategoryRecord[];
  updateDraft: (updates: Partial<StorefrontContent>) => void;
  updateAnnouncement: (
    updates: Partial<StorefrontContent["announcement"]>
  ) => void;
  updateHero: (updates: Partial<StorefrontContent["hero"]>) => void;
  updatePromo: (updates: Partial<StorefrontContent["promo"]>) => void;
  updateBrand: (updates: Partial<StorefrontContent["brand"]>) => void;
  setFeatured: (ids: string[]) => void;
  updateCategory: (id: Department, updates: Partial<CategoryRecord>) => void;
  reorderCategories: (ids: Department[]) => void;
  publish: () => void;
  restoreDefaults: () => void;
}

export const useStorefrontStore = create<StorefrontState>()(
  persist(
    (set, get) => ({
      draft: DEFAULT_STOREFRONT_CONTENT,
      published: DEFAULT_STOREFRONT_CONTENT,
      categories: DEFAULT_CATEGORIES,
      updateDraft: (updates) =>
        set((s) => ({ draft: { ...s.draft, ...updates } })),
      updateAnnouncement: (updates) =>
        set((s) => ({
          draft: {
            ...s.draft,
            announcement: { ...s.draft.announcement, ...updates },
          },
        })),
      updateHero: (updates) =>
        set((s) => ({
          draft: { ...s.draft, hero: { ...s.draft.hero, ...updates } },
        })),
      updatePromo: (updates) =>
        set((s) => ({
          draft: { ...s.draft, promo: { ...s.draft.promo, ...updates } },
        })),
      updateBrand: (updates) =>
        set((s) => ({
          draft: { ...s.draft, brand: { ...s.draft.brand, ...updates } },
        })),
      setFeatured: (ids) =>
        set((s) => ({ draft: { ...s.draft, featuredProductIds: ids } })),
      updateCategory: (id, updates) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...updates, id } : c
          ),
        })),
      reorderCategories: (ids) =>
        set((s) => ({
          categories: ids.map((id, sortOrder) => {
            const found = s.categories.find((c) => c.id === id)!;
            return { ...found, sortOrder };
          }),
        })),
      publish: () => {
        const draft = {
          ...get().draft,
          publishedAt: new Date().toISOString(),
        };
        set({ draft, published: draft });
      },
      restoreDefaults: () =>
        set({
          draft: DEFAULT_STOREFRONT_CONTENT,
          published: DEFAULT_STOREFRONT_CONTENT,
          categories: DEFAULT_CATEGORIES,
        }),
    }),
    { name: "kendreah-storefront-cms" }
  )
);
