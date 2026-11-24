import type { Department, Product } from "@/types";

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  q?: string;
  department?: Department | "all";
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  availability?: "all" | "in_stock" | "out_of_stock";
  onSale?: boolean;
  sort?: SortOption;
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = products.filter((p) => p.status !== "draft");

  if (filters.department && filters.department !== "all") {
    result = result.filter((p) => p.department === filters.department);
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.department.includes(q)
    );
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.sizes?.some((s) => filters.sizes!.includes(s))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    result = result.filter((p) =>
      p.colors?.some((c) => filters.colors!.includes(c.name))
    );
  }

  if (filters.availability === "in_stock") {
    result = result.filter((p) => p.stock > 0 && p.status !== "sold_out");
  } else if (filters.availability === "out_of_stock") {
    result = result.filter((p) => p.stock <= 0 || p.status === "sold_out");
  }

  if (filters.onSale) {
    result = result.filter(
      (p) => Boolean(p.compareAtPrice) && (p.compareAtPrice as number) > p.price
    );
  }

  const sort = filters.sort ?? "newest";
  result = [...result].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return result;
}

export function collectFilterOptions(products: Product[]) {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    p.sizes?.forEach((s) => sizes.add(s));
    p.colors?.forEach((c) => colors.add(c.name));
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }
  return {
    sizes: [...sizes].sort(),
    colors: [...colors].sort(),
    minPrice: Number.isFinite(min) ? Math.floor(min) : 0,
    maxPrice: Math.ceil(max),
  };
}
