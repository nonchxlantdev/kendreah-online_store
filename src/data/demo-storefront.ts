import { withBase } from "@/lib/assets";
import type {
  CategoryRecord,
  ShippingMethodConfig,
  StorefrontContent,
  StoreSettings,
} from "@/types/admin";

export const DEFAULT_CATEGORIES: CategoryRecord[] = [
  {
    id: "clothes",
    name: "Clothing",
    description:
      "Trendy everyday fashion for women, men and kids — quality pieces at prices that make sense.",
    image: withBase("/products/cat-clothes.jpg"),
    visible: true,
    sortOrder: 0,
  },
  {
    id: "footwear",
    name: "Footwear",
    description:
      "Comfortable styles for work, weekends and everything in between.",
    image: withBase("/products/cat-footwear.jpg"),
    visible: true,
    sortOrder: 1,
  },
  {
    id: "appliances",
    name: "Home & Living",
    description:
      "Practical home essentials to upgrade your everyday kitchen and living space.",
    image: withBase("/products/cat-appliances.jpg"),
    visible: true,
    sortOrder: 2,
  },
];

export const DEFAULT_SHIPPING: ShippingMethodConfig[] = [
  {
    country: "Belize",
    enabled: true,
    methodName: "Belize Standard (demo)",
    flatRate: 24.99,
    freeShippingThreshold: 150,
    estimatedDelivery: "7–14 business days (sample)",
    note: "Illustrative demo rate — final rates pending client confirmation.",
  },
  {
    country: "United States",
    enabled: true,
    methodName: "US Standard (demo)",
    flatRate: 9.99,
    freeShippingThreshold: 100,
    estimatedDelivery: "3–7 business days (sample)",
    note: "Illustrative demo rate — final rates pending client confirmation.",
  },
];

export const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  announcement: {
    text: "Shipping to Belize & USA | Shop in USD",
    visible: true,
    backgroundColor: "#EC008C",
  },
  hero: {
    eyebrow: "The Ken' Dreah Edit",
    heading: "Your Style.\nYour Rules.",
    supporting:
      "Fashion, footwear and everyday essentials you'll love — at prices you'll love even more.",
    image: withBase("/products/hero-campaign.jpg"),
    primaryLabel: "Shop New Arrivals",
    primaryHref: "/shop?sort=newest",
    secondaryLabel: "Explore Collections",
    secondaryHref: "/shop",
  },
  featuredProductIds: [
    "p-floral-midi",
    "p-two-piece",
    "p-mens-polo",
    "p-denim-jeans",
    "p-everyday-sandals",
    "p-white-sneakers",
    "p-air-fryer",
    "p-blender",
  ],
  promo: {
    title: "The Pink Edit",
    description: "Statement pieces and soft essentials for the season ahead.",
    image: withBase("/products/pink-edit.jpg"),
    buttonText: "Shop the edit",
    href: "/shop?sale=1",
    visible: true,
  },
  brand: {
    tagline: "Shop • Save • Enjoy",
    aboutBlurb:
      "A US-based, online-only destination for trendy fashion, footwear and practical household products.",
    contactEmail: "hello@kendreah.demo",
    contactPhone: "[To be confirmed]",
    socialInstagram: "@kendreah.demo",
    socialFacebook: "Ken'Dreah Demo",
  },
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Ken' Dreah Online Store",
  storeEmail: "hello@kendreah.demo",
  businessPhone: "[To be confirmed]",
  currency: "USD",
  markets: ["Belize", "United States"],
  launchNote: "Planned launch 2027 — this admin is a demonstration only.",
  stripeStatus: "demo",
  paypalStatus: "demo",
  notifyNewOrders: true,
  notifyLowInventory: true,
  notifyCancellations: true,
  notifyInquiries: false,
  deliveryPolicy:
    "[Draft] Delivery details for Belize and the United States will be confirmed before launch.",
  returnPolicy:
    "[Draft] Return windows and conditions will be published before launch.",
  privacyPolicy:
    "[Draft] Privacy policy placeholder for demonstration purposes.",
  termsPolicy:
    "[Draft] Terms and conditions placeholder for demonstration purposes.",
};
