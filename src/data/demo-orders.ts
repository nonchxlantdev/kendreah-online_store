import { INITIAL_PRODUCTS } from "@/data/products";
import { SEED_CUSTOMERS } from "@/data/demo-customers";
import { daysAgo } from "@/lib/date";
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "delivered",
  "shipped",
  "processing",
];

function shipRate(country: "Belize" | "United States") {
  return country === "Belize" ? 24.99 : 9.99;
}

function buildOrders(): Order[] {
  const products = INITIAL_PRODUCTS.filter((p) => p.status !== "draft");
  const orders: Order[] = [];

  for (let i = 0; i < 48; i++) {
    const customer = SEED_CUSTOMERS[i % SEED_CUSTOMERS.length];
    const days = 1 + ((i * 3) % 88);
    const createdAt = daysAgo(days, 9 + (i % 10));
    const p1 = products[i % products.length];
    const p2 = products[(i * 5) % products.length];
    const qty1 = 1 + (i % 2);
    const useSecond = i % 3 !== 0 && p1.id !== p2.id;
    const items = [
      {
        productId: p1.id,
        name: p1.name,
        price: p1.price,
        quantity: qty1,
        size: p1.sizes?.[0],
        color: p1.colors?.[0]?.name,
        image: p1.images[0],
      },
      ...(useSecond
        ? [
            {
              productId: p2.id,
              name: p2.name,
              price: p2.price,
              quantity: 1,
              size: p2.sizes?.[1] ?? p2.sizes?.[0],
              color: p2.colors?.[0]?.name,
              image: p2.images[0],
            },
          ]
        : []),
    ];
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const discountAmount = i % 11 === 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const discountCode = discountAmount ? "WELCOME10" : undefined;
    const shipping =
      i % 13 === 0 ? 0 : shipRate(customer.country);
    const status = STATUSES[i % STATUSES.length];
    const paymentMethod: PaymentMethod = i % 2 === 0 ? "card" : "paypal";
    const paymentStatus: PaymentStatus =
      status === "cancelled"
        ? i % 2 === 0
          ? "refunded"
          : "paid"
        : "paid";
    const d = new Date(createdAt);
    const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

    orders.push({
      id: `ord_seed_${i + 1}`,
      orderNumber: `KD-${stamp}-${1000 + i}`,
      createdAt,
      status,
      items,
      subtotal,
      shipping,
      discountAmount: discountAmount || undefined,
      discountCode,
      total: Math.round((subtotal - discountAmount + shipping) * 100) / 100,
      paymentMethod,
      paymentStatus,
      shippingAddress: {
        fullName: customer.name,
        email: customer.email,
        phone: customer.phone,
        country: customer.country,
        street: `${100 + i} Demo ${customer.country === "Belize" ? "Street" : "Avenue"}`,
        city: customer.city,
        stateOrDistrict:
          customer.country === "Belize" ? "Belize District" : "FL",
        postalCode: customer.country === "Belize" ? "" : `${33100 + (i % 90)}`,
      },
      trackingNumber:
        status === "shipped" || status === "delivered"
          ? `KDTRACK${2000 + i}`
          : undefined,
      notes: [],
      cancelledAt: status === "cancelled" ? createdAt : undefined,
      refundedAt: paymentStatus === "refunded" ? createdAt : undefined,
      isDemo: true,
    });
  }

  return orders.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export const SEED_ORDERS = buildOrders();
