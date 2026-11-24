"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withBase } from "@/lib/assets";
import { createId, createOrderNumber } from "@/lib/utils";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ShippingAddress,
} from "@/types";

const SEED_ORDERS: Order[] = [
  {
    id: "ord_demo_1",
    orderNumber: "KD-20261020-1042",
    createdAt: "2026-10-20T14:22:00.000Z",
    status: "shipped",
    items: [
      {
        productId: "p-floral-midi",
        name: "Floral Midi Dress",
        price: 48,
        quantity: 1,
        size: "M",
        color: "Blush Floral",
        image: withBase("/products/floral-1.jpg"),
      },
      {
        productId: "p-everyday-sandals",
        name: "Women's Everyday Sandals",
        price: 38,
        quantity: 1,
        size: "8",
        color: "Tan",
        image: withBase("/products/sandals-1.jpg"),
      },
    ],
    subtotal: 86,
    shipping: 24.99,
    total: 110.99,
    paymentMethod: "card",
    shippingAddress: {
      fullName: "Demo Customer",
      email: "demo@example.com",
      phone: "+501-555-0100",
      country: "Belize",
      street: "12 Sample Street",
      city: "Belize City",
      stateOrDistrict: "Belize District",
      postalCode: "",
    },
    isDemo: true,
  },
  {
    id: "ord_demo_2",
    orderNumber: "KD-20261022-3318",
    createdAt: "2026-10-22T09:10:00.000Z",
    status: "processing",
    items: [
      {
        productId: "p-air-fryer",
        name: "Digital Air Fryer",
        price: 89,
        quantity: 1,
        color: "Black",
        image: withBase("/products/airfryer-1.jpg"),
      },
    ],
    subtotal: 89,
    shipping: 9.99,
    total: 98.99,
    paymentMethod: "paypal",
    shippingAddress: {
      fullName: "Demo Shopper",
      email: "shopper@example.com",
      phone: "+1-555-0142",
      country: "United States",
      street: "100 Demo Avenue",
      city: "Houston",
      stateOrDistrict: "TX",
      postalCode: "77001",
    },
    isDemo: true,
  },
  {
    id: "ord_demo_3",
    orderNumber: "KD-20261024-7781",
    createdAt: "2026-10-24T18:45:00.000Z",
    status: "pending",
    items: [
      {
        productId: "p-white-sneakers",
        name: "Classic White Sneakers",
        price: 52,
        quantity: 2,
        size: "9",
        color: "White",
        image: withBase("/products/sneakers-1.jpg"),
      },
    ],
    subtotal: 104,
    shipping: 9.99,
    total: 113.99,
    paymentMethod: "card",
    shippingAddress: {
      fullName: "Alex Rivera",
      email: "alex@example.com",
      phone: "+1-555-0199",
      country: "United States",
      street: "88 Market Street",
      city: "Miami",
      stateOrDistrict: "FL",
      postalCode: "33101",
    },
    isDemo: true,
  },
];

interface PlaceOrderInput {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

interface OrderState {
  orders: Order[];
  lastOrderId: string | null;
  placeOrder: (input: PlaceOrderInput) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
  getByNumber: (orderNumber: string) => Order | undefined;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
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
          total: input.total,
          paymentMethod: input.paymentMethod,
          shippingAddress: input.shippingAddress,
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
            o.id === id ? { ...o, status } : o
          ),
        })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
      getByNumber: (orderNumber) =>
        get().orders.find((o) => o.orderNumber === orderNumber),
      resetOrders: () => set({ orders: SEED_ORDERS, lastOrderId: null }),
    }),
    { name: "kendreah-orders" }
  )
);
