"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_ORDERS } from "@/data/demo-orders";
import { createId, createOrderNumber } from "@/lib/utils";
import type {
  Order,
  OrderItem,
  OrderNote,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
} from "@/types";

interface PlaceOrderInput {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discountAmount?: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

interface OrderState {
  orders: Order[];
  lastOrderId: string | null;
  placeOrder: (input: PlaceOrderInput) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  setTracking: (id: string, trackingNumber: string) => void;
  setPaymentStatus: (id: string, paymentStatus: PaymentStatus) => void;
  addNote: (id: string, text: string, adminName?: string) => void;
  simulateRefund: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  getByNumber: (orderNumber: string) => Order | undefined;
  resetOrders: () => void;
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    paymentStatus: order.paymentStatus ?? "paid",
    notes: order.notes ?? [],
  };
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS.map(normalizeOrder),
      lastOrderId: null,
      placeOrder: (input) => {
        const order: Order = {
          id: createId("ord"),
          orderNumber: createOrderNumber(),
          createdAt: new Date().toISOString(),
          status: "pending",
          items: input.items,
          subtotal: input.subtotal,
          shipping: input.shipping,
          discountAmount: input.discountAmount,
          discountCode: input.discountCode,
          total: input.total,
          paymentMethod: input.paymentMethod,
          paymentStatus: "paid",
          shippingAddress: input.shippingAddress,
          notes: [],
          isDemo: true,
        };
        set((state) => ({
          orders: [order, ...state.orders],
          lastOrderId: order.id,
        }));
        return order;
      },
      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  cancelledAt:
                    status === "cancelled"
                      ? o.cancelledAt ?? new Date().toISOString()
                      : o.cancelledAt,
                }
              : o
          ),
        })),
      setTracking: (id, trackingNumber) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, trackingNumber } : o
          ),
        })),
      setPaymentStatus: (id, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, paymentStatus } : o
          ),
        })),
      addNote: (id, text, adminName = "Demo Admin") => {
        const note: OrderNote = {
          id: createId("onote"),
          text,
          createdAt: new Date().toISOString(),
          adminName,
        };
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, notes: [note, ...(o.notes ?? [])] } : o
          ),
        }));
      },
      simulateRefund: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  paymentStatus: "refunded",
                  refundedAt: new Date().toISOString(),
                }
              : o
          ),
        })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
      getByNumber: (orderNumber) =>
        get().orders.find((o) => o.orderNumber === orderNumber),
      resetOrders: () =>
        set({ orders: SEED_ORDERS.map(normalizeOrder), lastOrderId: null }),
    }),
    {
      name: "kendreah-orders",
      merge: (persisted, current) => {
        const p = persisted as Partial<OrderState> | undefined;
        return {
          ...current,
          ...p,
          orders: (p?.orders ?? current.orders).map(normalizeOrder),
        };
      },
    }
  )
);
