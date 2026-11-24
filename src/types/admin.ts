import type {
  Department,
  OrderStatus,
  ShippingCountry,
} from "@/types";

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export type ActivityType =
  | "product_created"
  | "product_updated"
  | "product_archived"
  | "inventory_adjusted"
  | "order_status_changed"
  | "order_placed"
  | "discount_created"
  | "discount_updated"
  | "storefront_published"
  | "settings_updated"
  | "category_updated"
  | "shipping_updated"
  | "note_added"
  | "demo_reset";

export interface Discount {
  id: string;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderValue?: number;
  applicableDepartments: Department[] | "all";
  startsAt: string;
  endsAt?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  previousStock: number;
  nextStock: number;
  delta: number;
  reason: string;
  createdAt: string;
  adminName: string;
}

export interface CategoryRecord {
  id: Department;
  name: string;
  description: string;
  image: string;
  visible: boolean;
  sortOrder: number;
}

export interface ShippingMethodConfig {
  country: ShippingCountry;
  enabled: boolean;
  methodName: string;
  flatRate: number;
  freeShippingThreshold?: number;
  estimatedDelivery: string;
  note: string;
}

export interface StorefrontContent {
  announcement: {
    text: string;
    visible: boolean;
    backgroundColor: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    supporting: string;
    image: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  featuredProductIds: string[];
  promo: {
    title: string;
    description: string;
    image: string;
    buttonText: string;
    href: string;
    visible: boolean;
  };
  brand: {
    tagline: string;
    aboutBlurb: string;
    contactEmail: string;
    contactPhone: string;
    socialInstagram: string;
    socialFacebook: string;
  };
  publishedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  businessPhone: string;
  currency: "USD";
  markets: ShippingCountry[];
  launchNote: string;
  stripeStatus: "demo" | "not_connected";
  paypalStatus: "demo" | "not_connected";
  notifyNewOrders: boolean;
  notifyLowInventory: boolean;
  notifyCancellations: boolean;
  notifyInquiries: boolean;
  deliveryPolicy: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsPolicy: string;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  description: string;
  entityType?: string;
  entityId?: string;
  adminName: string;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  text: string;
  createdAt: string;
  adminName: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: ShippingCountry;
  city: string;
  createdAt: string;
  notes: CustomerNote[];
}

export interface OrderNote {
  id: string;
  text: string;
  createdAt: string;
  adminName: string;
}

export interface OrderExtras {
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  discountCode?: string;
  discountAmount?: number;
  notes: OrderNote[];
  cancelledAt?: string;
  refundedAt?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus | "cancelled", string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
};
