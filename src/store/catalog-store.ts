"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_PRODUCTS } from "@/data/products";
import { createId } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";

interface CatalogState {
  products: Product[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  getProduct: (id: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "createdAt"> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setStatus: (id: string, status: ProductStatus) => void;
  updateStock: (id: string, stock: number) => void;
  resetProducts: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      getProduct: (id) => get().products.find((p) => p.id === id),
      getBySlug: (slug) => get().products.find((p) => p.slug === slug),
      addProduct: (input) => {
        const product: Product = {
          ...input,
          id: input.id ?? createId("p"),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, id: p.id } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      setStatus: (id, status) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  stock: status === "sold_out" ? 0 : p.stock,
                }
              : p
          ),
        })),
      updateStock: (id, stock) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  stock,
                  status:
                    stock <= 0 && p.status === "active" ? "sold_out" : p.status,
                }
              : p
          ),
        })),
      resetProducts: () => set({ products: INITIAL_PRODUCTS }),
    }),
    {
      name: "kendreah-catalog",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
