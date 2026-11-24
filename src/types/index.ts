export type Department = "clothes" | "footwear" | "appliances";

export type ProductStatus = "active" | "draft" | "sold_out";

export type ProductBadge = "new" | "sale" | null;

export interface ProductSpecs {
  material?: string;
  care?: string;
  fit?: string;
  heelHeight?: string;
  sole?: string;
  plugType?: string;
  voltage?: string;
  warranty?: string;
  capacity?: string;
  dimensions?: string;
  weight?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  department: Department;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isNew: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  specs: ProductSpecs;
  createdAt: string;
}

export interface CartItem {
  key: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  colorHex?: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export type PaymentMethod = "card" | "paypal";

export type ShippingCountry = "Belize" | "United States";

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: ShippingCountry;
  street: string;
  city: string;
  stateOrDistrict: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  isDemo: true;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  country: ShippingCountry;
  orders: number;
  totalSpent: number;
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  clothes: "Clothing",
  footwear: "Footwear",
  appliances: "Home & Living",
};

export const DEPARTMENT_DESCRIPTIONS: Record<Department, string> = {
  clothes:
    "Trendy everyday fashion for women, men and kids — quality pieces at prices that make sense.",
  footwear:
    "Comfortable styles for work, weekends and everything in between.",
  appliances:
    "Practical home essentials to upgrade your everyday kitchen and living space.",
};
