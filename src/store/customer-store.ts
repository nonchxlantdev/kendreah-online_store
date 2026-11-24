"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_CUSTOMERS } from "@/data/demo-customers";
import { createId } from "@/lib/utils";
import type { AdminCustomer, CustomerNote } from "@/types/admin";
import type { Order } from "@/types";

interface CustomerState {
  customers: AdminCustomer[];
  addNote: (customerId: string, text: string, adminName?: string) => void;
  upsertFromOrder: (order: Order) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: SEED_CUSTOMERS,
      addNote: (customerId, text, adminName = "Demo Admin") => {
        const note: CustomerNote = {
          id: createId("cnote"),
          text,
          createdAt: new Date().toISOString(),
          adminName,
        };
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === customerId ? { ...c, notes: [note, ...c.notes] } : c
          ),
        }));
      },
      upsertFromOrder: (order) => {
        const email = order.shippingAddress.email.toLowerCase();
        const existing = get().customers.find(
          (c) => c.email.toLowerCase() === email
        );
        if (existing) return;
        const customer: AdminCustomer = {
          id: createId("cust"),
          name: order.shippingAddress.fullName,
          email: order.shippingAddress.email,
          phone: order.shippingAddress.phone,
          country: order.shippingAddress.country,
          city: order.shippingAddress.city,
          createdAt: order.createdAt,
          notes: [],
        };
        set((s) => ({ customers: [customer, ...s.customers] }));
      },
      reset: () => set({ customers: SEED_CUSTOMERS }),
    }),
    { name: "kendreah-customers" }
  )
);

export function customerStats(customers: AdminCustomer[], orders: Order[]) {
  return customers.map((c) => {
    const theirs = orders.filter(
      (o) =>
        o.shippingAddress.email.toLowerCase() === c.email.toLowerCase() &&
        o.status !== "cancelled"
    );
    const totalSpent = theirs.reduce((s, o) => s + o.total, 0);
    const last = theirs[0]?.createdAt;
    return {
      ...c,
      orderCount: theirs.length,
      totalSpent,
      lastOrderAt: last,
      aov: theirs.length ? totalSpent / theirs.length : 0,
    };
  });
}
