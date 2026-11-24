import { withBase } from "@/lib/assets";
import type { Product } from "@/types";

/**
 * Illustrative demonstration catalogue for Ken' Dreah Online Store.
 * Product names, prices, stock and imagery are sample data for client presentation only.
 */
export const DEMO_NOTICE =
  "All products, prices and stock levels shown are illustrative demonstration data.";

const img = (file: string) => withBase(`/products/${file}`);

export const INITIAL_PRODUCTS: Product[] = [
  // ——— Clothes ———
  {
    id: "p-floral-midi",
    slug: "floral-midi-dress",
    name: "Floral Midi Dress",
    department: "clothes",
    shortDescription: "Soft floral print midi with a flattering waist and easy everyday elegance.",
    description:
      "A breezy floral midi dress designed for warm days and easy evenings. Lightweight fabric, a gently fitted waist and a flowing skirt make it a wardrobe staple for brunch, errands or weekend plans. Pair with sandals or sneakers.",
    price: 48.0,
    compareAtPrice: 62.0,
    images: [
      img("floral-1.jpg"),
      img("floral-2.jpg"),
    ],
    stock: 18,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Blush Floral", hex: "#F4C4D0" },
      { name: "Navy Bloom", hex: "#2C3E6B" },
    ],
    isNew: true,
    isFeatured: true,
    status: "active",
    specs: {
      material: "Lightweight woven blend",
      care: "Machine wash cold, hang dry",
      fit: "True to size with a soft waist",
    },
    createdAt: "2026-10-12",
  },
  {
    id: "p-two-piece",
    slug: "womens-casual-two-piece-set",
    name: "Women's Casual Two-Piece Set",
    department: "clothes",
    shortDescription: "Matching top and bottoms for polished off-duty style.",
    description:
      "A coordinated two-piece set that looks put-together without the effort. Soft stretch fabric, relaxed silhouette and mix-and-match potential for travel days or weekend plans.",
    price: 54.0,
    images: [
      img("twopiece-1.jpg"),
      img("twopiece-2.jpg"),
    ],
    stock: 14,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Soft Black", hex: "#1A1418" },
      { name: "Warm Cream", hex: "#F5EDE3" },
      { name: "Rose", hex: "#E8A0B5" },
    ],
    isNew: true,
    isFeatured: true,
    status: "active",
    specs: {
      material: "Soft knit blend",
      care: "Machine wash gentle",
      fit: "Relaxed / easy fit",
    },
    createdAt: "2026-10-18",
  },
  {
    id: "p-mens-polo",
    slug: "classic-mens-polo-shirt",
    name: "Classic Men's Polo Shirt",
    department: "clothes",
    shortDescription: "Clean collared polo for work-casual and weekend wear.",
    description:
      "A timeless polo with a refined collar, breathable cotton-feel fabric and a clean finish. Built for everyday comfort whether you're heading out or staying in.",
    price: 32.0,
    images: [
      img("polo-1.jpg"),
      img("polo-2.jpg"),
    ],
    stock: 28,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Black", hex: "#150E13" },
      { name: "Forest", hex: "#2F4F3E" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      material: "Cotton-feel jersey",
      care: "Machine wash cold",
      fit: "Regular fit",
    },
    createdAt: "2026-09-02",
  },
  {
    id: "p-denim-jeans",
    slug: "high-waisted-denim-jeans",
    name: "High-Waisted Denim Jeans",
    department: "clothes",
    shortDescription: "Flattering high rise with stretch comfort for all-day wear.",
    description:
      "High-waisted denim with just enough stretch to move with you. Classic wash, clean stitching and a silhouette that pairs with everything from tees to blouses.",
    price: 58.0,
    compareAtPrice: 72.0,
    images: [
      img("jeans-1.jpg"),
      img("jeans-2.jpg"),
    ],
    stock: 22,
    sizes: ["24", "26", "28", "30", "32", "34"],
    colors: [
      { name: "Medium Wash", hex: "#5B7FA6" },
      { name: "Dark Indigo", hex: "#1E2F4D" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      material: "Stretch denim",
      care: "Wash inside out, cold",
      fit: "High rise, slim through leg",
    },
    createdAt: "2026-08-21",
  },
  {
    id: "p-elegant-blouse",
    slug: "womens-elegant-blouse",
    name: "Women's Elegant Blouse",
    department: "clothes",
    shortDescription: "Soft drape blouse for work, dinner and everything between.",
    description:
      "An elevated everyday blouse with a soft drape and refined neckline. Dress it up with tailored trousers or keep it casual with denim.",
    price: 42.0,
    images: [
      img("blouse-1.jpg"),
      img("blouse-2.jpg"),
    ],
    stock: 16,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#FFFEF8" },
      { name: "Soft Pink", hex: "#F7D6E0" },
      { name: "Black", hex: "#150E13" },
    ],
    isNew: true,
    isFeatured: false,
    status: "active",
    specs: {
      material: "Soft woven fabric",
      care: "Hand wash or gentle cycle",
      fit: "Relaxed through body",
    },
    createdAt: "2026-10-28",
  },
  {
    id: "p-kids-summer",
    slug: "kids-summer-outfit",
    name: "Kids' Summer Outfit",
    department: "clothes",
    shortDescription: "Light, playful set for sunny days and play dates.",
    description:
      "A cheerful summer outfit for kids — soft fabrics, easy on-and-off and colours that hold up to adventures. Comfortable enough for all-day wear.",
    price: 36.0,
    images: [
      img("kids-1.jpg"),
      img("kids-2.jpg"),
    ],
    stock: 20,
    sizes: ["2T", "3T", "4T", "5", "6", "7"],
    colors: [
      { name: "Sky Blue", hex: "#A8D4F0" },
      { name: "Coral", hex: "#F28B82" },
      { name: "Lemon", hex: "#F5E6A3" },
    ],
    isNew: true,
    isFeatured: false,
    status: "active",
    specs: {
      material: "Soft cotton blend",
      care: "Machine wash cold",
      fit: "Easy kids fit",
    },
    createdAt: "2026-10-05",
  },
  {
    id: "p-cotton-tee",
    slug: "everyday-cotton-t-shirt",
    name: "Everyday Cotton T-Shirt",
    department: "clothes",
    shortDescription: "Soft essential tee with a clean everyday fit.",
    description:
      "Your go-to cotton tee — soft hand-feel, durable stitching and a silhouette that works under jackets or on its own. A wardrobe essential at a friendly price.",
    price: 18.0,
    images: [
      img("tee-1.jpg"),
      img("tee-2.jpg"),
    ],
    stock: 45,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#150E13" },
      { name: "Hot Pink", hex: "#EC008C" },
      { name: "Heather Grey", hex: "#B8B0B4" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      material: "Soft cotton jersey",
      care: "Machine wash cold",
      fit: "Regular / unisex friendly",
    },
    createdAt: "2026-07-14",
  },
  {
    id: "p-linen-trousers",
    slug: "casual-linen-trousers",
    name: "Casual Linen Trousers",
    department: "clothes",
    shortDescription: "Breathable linen-blend trousers for warm-weather ease.",
    description:
      "Lightweight linen-blend trousers with a relaxed leg and easy drawstring or tailored finish. Perfect for travel, beach towns and hot afternoons.",
    price: 46.0,
    images: [
      img("linen-1.jpg"),
      img("linen-2.jpg"),
    ],
    stock: 12,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Natural", hex: "#E8DCC8" },
      { name: "Olive", hex: "#6B7A4E" },
      { name: "Sand", hex: "#C4B59A" },
    ],
    isNew: false,
    isFeatured: false,
    status: "active",
    specs: {
      material: "Linen blend",
      care: "Gentle wash, hang dry",
      fit: "Relaxed leg",
    },
    createdAt: "2026-08-08",
  },

  // ——— Footwear ———
  {
    id: "p-everyday-sandals",
    slug: "womens-everyday-sandals",
    name: "Women's Everyday Sandals",
    department: "footwear",
    shortDescription: "Comfortable straps and a soft footbed for all-day wear.",
    description:
      "Everyday sandals built for errands, weekends and warm weather. Soft straps, cushioned footbed and a secure fit you can walk in for hours.",
    price: 38.0,
    compareAtPrice: 48.0,
    images: [
      img("sandals-1.jpg"),
      img("sandals-2.jpg"),
    ],
    stock: 24,
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [
      { name: "Tan", hex: "#C4A484" },
      { name: "Black", hex: "#150E13" },
      { name: "White", hex: "#FFFFFF" },
    ],
    isNew: true,
    isFeatured: true,
    status: "active",
    specs: {
      sole: "Flexible rubber outsole",
      material: "Synthetic upper with soft lining",
      care: "Wipe clean",
    },
    createdAt: "2026-10-15",
  },
  {
    id: "p-white-sneakers",
    slug: "classic-white-sneakers",
    name: "Classic White Sneakers",
    department: "footwear",
    shortDescription: "Clean white sneakers that go with everything.",
    description:
      "A classic white sneaker with a clean silhouette and everyday cushioning. Easy to style with jeans, dresses or athleisure.",
    price: 52.0,
    images: [
      img("sneakers-1.jpg"),
      img("sneakers-2.jpg"),
    ],
    stock: 30,
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "White / Gold", hex: "#D4AF37" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      sole: "Cushioned rubber sole",
      material: "Synthetic leather upper",
      care: "Spot clean",
    },
    createdAt: "2026-09-10",
  },
  {
    id: "p-mens-loafers",
    slug: "mens-casual-loafers",
    name: "Men's Casual Loafers",
    department: "footwear",
    shortDescription: "Slip-on loafers for smart-casual days.",
    description:
      "Easy slip-on loafers with a polished look and comfortable insole. Ideal for office-casual days, dinners and travel.",
    price: 64.0,
    images: [
      img("loafers-1.jpg"),
      img("loafers-2.jpg"),
    ],
    stock: 15,
    sizes: ["8", "9", "10", "11", "12", "13"],
    colors: [
      { name: "Brown", hex: "#5C4033" },
      { name: "Black", hex: "#150E13" },
      { name: "Cognac", hex: "#9A5B2E" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      sole: "Durable outsole",
      material: "Faux leather upper",
      care: "Wipe with soft cloth",
    },
    createdAt: "2026-08-30",
  },
  {
    id: "p-block-heels",
    slug: "womens-block-heels",
    name: "Women's Block Heels",
    department: "footwear",
    shortDescription: "Stable block heel with an elegant silhouette.",
    description:
      "A wearable heel for evenings and special plans. The block heel adds stability while the clean lines keep the look refined.",
    price: 56.0,
    compareAtPrice: 68.0,
    images: [
      img("heels-1.jpg"),
      img("heels-2.jpg"),
    ],
    stock: 10,
    sizes: ["6", "7", "8", "9", "10"],
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "Nude", hex: "#D4B5A0" },
      { name: "Gold", hex: "#D4AF37" },
    ],
    isNew: true,
    isFeatured: false,
    status: "active",
    specs: {
      heelHeight: "Approx. 2.5 in block heel (illustrative)",
      material: "Synthetic upper",
      sole: "Non-slip outsole",
    },
    createdAt: "2026-10-22",
  },
  {
    id: "p-kids-school",
    slug: "kids-school-shoes",
    name: "Kids' School Shoes",
    department: "footwear",
    shortDescription: "Durable everyday shoes ready for the school week.",
    description:
      "Sturdy kids' school shoes with easy closures and a comfortable fit. Built for playgrounds, classrooms and everything in between.",
    price: 34.0,
    images: [
      img("school-1.jpg"),
      img("school-2.jpg"),
    ],
    stock: 18,
    sizes: ["10C", "11C", "12C", "13C", "1Y", "2Y", "3Y"],
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "Navy", hex: "#1B2A4A" },
    ],
    isNew: false,
    isFeatured: false,
    status: "active",
    specs: {
      material: "Durable synthetic upper",
      sole: "Flexible grip sole",
      care: "Wipe clean",
    },
    createdAt: "2026-09-01",
  },
  {
    id: "p-walking-sneakers",
    slug: "comfortable-walking-sneakers",
    name: "Comfortable Walking Sneakers",
    department: "footwear",
    shortDescription: "Cushioned walking sneakers for long days on your feet.",
    description:
      "Supportive walking sneakers with soft cushioning and breathable uppers. Designed for errands, travel days and everyday comfort.",
    price: 59.0,
    images: [
      img("walk-1.jpg"),
      img("walk-2.jpg"),
    ],
    stock: 26,
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Grey", hex: "#8A8589" },
      { name: "Black", hex: "#150E13" },
      { name: "Blush", hex: "#E8B4C4" },
    ],
    isNew: true,
    isFeatured: true,
    status: "active",
    specs: {
      sole: "Cushioned walking sole",
      material: "Mesh and synthetic upper",
      care: "Spot clean",
    },
    createdAt: "2026-10-20",
  },
  {
    id: "p-slip-on-sandals",
    slug: "flat-slip-on-sandals",
    name: "Flat Slip-On Sandals",
    department: "footwear",
    shortDescription: "Easy slip-ons for poolside, patio and warm weekends.",
    description:
      "Lightweight flat sandals you can slide into and go. Soft straps and a flat sole make them a warm-weather essential.",
    price: 28.0,
    images: [
      img("slip-1.jpg"),
      img("slip-2.jpg"),
    ],
    stock: 32,
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "Pink", hex: "#EC008C" },
      { name: "Ivory", hex: "#FFFEF8" },
    ],
    isNew: false,
    isFeatured: false,
    status: "active",
    specs: {
      sole: "Flat flexible sole",
      material: "Soft synthetic straps",
      care: "Wipe clean",
    },
    createdAt: "2026-07-28",
  },
  {
    id: "p-dress-shoes",
    slug: "mens-dress-shoes",
    name: "Men's Dress Shoes",
    department: "footwear",
    shortDescription: "Polished dress shoes for formal and smart occasions.",
    description:
      "Classic men's dress shoes with a refined finish and comfortable lining. Suitable for events, interviews and polished everyday looks.",
    price: 74.0,
    images: [
      img("dress-1.jpg"),
      img("dress-2.jpg"),
    ],
    stock: 0,
    sizes: ["8", "9", "10", "11", "12"],
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "Brown", hex: "#4A2C1A" },
    ],
    isNew: false,
    isFeatured: false,
    status: "sold_out",
    specs: {
      sole: "Dress outsole",
      material: "Faux leather upper",
      care: "Polish as needed",
    },
    createdAt: "2026-06-15",
  },

  // ——— Household Appliances ———
  {
    id: "p-air-fryer",
    slug: "digital-air-fryer",
    name: "Digital Air Fryer",
    department: "appliances",
    shortDescription: "Crispy results with less oil — digital controls for everyday cooking.",
    description:
      "A compact digital air fryer for weeknight meals and weekend snacks. Adjustable temperature settings and a non-stick basket make everyday cooking simpler. Ideal for small kitchens.",
    price: 89.0,
    compareAtPrice: 119.0,
    images: [
      img("airfryer-1.jpg"),
      img("airfryer-2.jpg"),
    ],
    stock: 11,
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "Stainless", hex: "#C0C0C0" },
    ],
    isNew: true,
    isFeatured: true,
    status: "active",
    specs: {
      capacity: "Approx. 4–5 qt (illustrative)",
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
      dimensions: "Compact countertop footprint",
    },
    createdAt: "2026-10-25",
  },
  {
    id: "p-blender",
    slug: "countertop-blender",
    name: "Countertop Blender",
    department: "appliances",
    shortDescription: "Powerful blending for smoothies, sauces and soups.",
    description:
      "A reliable countertop blender for everyday kitchen tasks. Multiple speed settings and a durable jar help you prep drinks, sauces and blended soups with ease.",
    price: 69.0,
    images: [
      img("blender-1.jpg"),
      img("blender-2.jpg"),
    ],
    stock: 14,
    colors: [
      { name: "Black", hex: "#150E13" },
      { name: "White", hex: "#FFFFFF" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      capacity: "Approx. 48 oz jar (illustrative)",
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
    },
    createdAt: "2026-09-18",
  },
  {
    id: "p-kettle",
    slug: "electric-kettle",
    name: "Electric Kettle",
    department: "appliances",
    shortDescription: "Fast boil kettle for tea, coffee and instant meals.",
    description:
      "A sleek electric kettle with a quick boil and automatic shut-off. Perfect for morning tea, coffee pour-overs and late-night noodles.",
    price: 34.0,
    images: [
      img("kettle-1.jpg"),
      img("kettle-2.jpg"),
    ],
    stock: 20,
    colors: [
      { name: "Stainless", hex: "#C0C0C0" },
      { name: "Black", hex: "#150E13" },
      { name: "White", hex: "#FFFFFF" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      capacity: "Approx. 1.7 L (illustrative)",
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
    },
    createdAt: "2026-08-12",
  },
  {
    id: "p-steam-iron",
    slug: "steam-iron",
    name: "Steam Iron",
    department: "appliances",
    shortDescription: "Smooth creases quickly with steady steam output.",
    description:
      "A dependable steam iron for everyday clothing care. Variable steam and a non-stick soleplate help keep shirts, dresses and linens looking sharp.",
    price: 29.0,
    images: [
      img("iron-1.jpg"),
      img("iron-2.jpg"),
    ],
    stock: 17,
    colors: [
      { name: "White / Pink", hex: "#EC008C" },
      { name: "Blue", hex: "#4A6FA5" },
    ],
    isNew: false,
    isFeatured: false,
    status: "active",
    specs: {
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
      material: "Non-stick soleplate",
    },
    createdAt: "2026-07-20",
  },
  {
    id: "p-desk-fan",
    slug: "portable-desk-fan",
    name: "Portable Desk Fan",
    department: "appliances",
    shortDescription: "Compact fan for desks, nightstands and small rooms.",
    description:
      "A portable desk fan with adjustable tilt and quiet airflow. Keep cool at your workspace, bedside or kitchen counter without taking up much space.",
    price: 24.0,
    images: [
      img("fan-1.jpg"),
      img("fan-2.jpg"),
    ],
    stock: 3,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#150E13" },
      { name: "Pink", hex: "#F7A8C8" },
    ],
    isNew: true,
    isFeatured: false,
    status: "active",
    specs: {
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
      dimensions: "Compact desk footprint",
    },
    createdAt: "2026-10-30",
  },
  {
    id: "p-rice-cooker",
    slug: "rice-cooker",
    name: "Rice Cooker",
    department: "appliances",
    shortDescription: "Simple one-touch rice cooking for everyday meals.",
    description:
      "An easy rice cooker for fluffy rice with minimal effort. Ideal for family meals, meal prep and busy weeknights. Keep-warm function included.",
    price: 45.0,
    images: [
      img("rice-1.jpg"),
      img("rice-2.jpg"),
    ],
    stock: 13,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Stainless", hex: "#C0C0C0" },
    ],
    isNew: false,
    isFeatured: true,
    status: "active",
    specs: {
      capacity: "Approx. 6-cup cooked (illustrative)",
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
    },
    createdAt: "2026-09-05",
  },
  {
    id: "p-hand-mixer",
    slug: "hand-mixer",
    name: "Hand Mixer",
    department: "appliances",
    shortDescription: "Lightweight hand mixer for baking and whipping.",
    description:
      "A lightweight hand mixer with multiple speeds for cakes, frosting and batters. Easy to store and comfortable to hold during longer mixing sessions.",
    price: 27.0,
    images: [
      img("mixer-1.jpg"),
      img("mixer-2.jpg"),
    ],
    stock: 19,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Pink", hex: "#EC008C" },
      { name: "Black", hex: "#150E13" },
    ],
    isNew: false,
    isFeatured: false,
    status: "active",
    specs: {
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
      weight: "Lightweight handheld design",
    },
    createdAt: "2026-08-01",
  },
  {
    id: "p-toaster",
    slug: "compact-toaster",
    name: "Compact Toaster",
    department: "appliances",
    shortDescription: "Two-slice toaster with browning control for everyday breakfasts.",
    description:
      "A compact two-slice toaster with adjustable browning. Fits neatly on the counter and delivers consistent toast for busy mornings.",
    price: 31.0,
    images: [
      img("toaster-1.jpg"),
      img("toaster-2.jpg"),
    ],
    stock: 16,
    colors: [
      { name: "Stainless", hex: "#C0C0C0" },
      { name: "Black", hex: "#150E13" },
      { name: "Cream", hex: "#F5EDE3" },
    ],
    isNew: true,
    isFeatured: false,
    status: "active",
    specs: {
      capacity: "2-slice (illustrative)",
      plugType: "Type A/B — confirm destination requirements before purchase",
      voltage: "110–120V (illustrative placeholder)",
      warranty: "Warranty terms to be confirmed before launch",
    },
    createdAt: "2026-10-08",
  },
];

export function getProductBySlug(slug: string, products: Product[] = INITIAL_PRODUCTS) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string, products: Product[] = INITIAL_PRODUCTS) {
  return products.find((p) => p.id === id);
}

export function getProductsByDepartment(
  department: Product["department"],
  products: Product[] = INITIAL_PRODUCTS
) {
  return products.filter((p) => p.department === department);
}

export function getFeaturedProducts(products: Product[] = INITIAL_PRODUCTS) {
  return products.filter((p) => p.isFeatured && p.status !== "draft").slice(0, 8);
}

export function getNewArrivals(products: Product[] = INITIAL_PRODUCTS) {
  return [...products]
    .filter((p) => p.isNew && p.status !== "draft")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
}

export function getRelatedProducts(
  product: Product,
  products: Product[] = INITIAL_PRODUCTS,
  limit = 4
) {
  return products
    .filter(
      (p) =>
        p.department === product.department &&
        p.id !== product.id &&
        p.status !== "draft"
    )
    .slice(0, limit);
}
