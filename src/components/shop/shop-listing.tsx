"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { Button } from "@/components/ui/button";
import {
  collectFilterOptions,
  filterProducts,
  type ProductFilters as ProductFiltersState,
  type SortOption,
} from "@/lib/filters";
import { useCatalogStore } from "@/store/catalog-store";
import {
  DEPARTMENT_DESCRIPTIONS,
  DEPARTMENT_LABELS,
  type Department,
} from "@/types";

const VALID_SORT: SortOption[] = ["newest", "price-asc", "price-desc"];

function parseSort(value: string | null): SortOption | undefined {
  if (value && VALID_SORT.includes(value as SortOption)) {
    return value as SortOption;
  }
  return undefined;
}

export function ShopListing({
  department,
}: {
  department?: Department;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const products = useCatalogStore((s) => s.products);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const [localFilters, setLocalFilters] = useState<
    Pick<
      ProductFiltersState,
      | "minPrice"
      | "maxPrice"
      | "sizes"
      | "colors"
      | "availability"
      | "department"
      | "onSale"
    >
  >({
    department: department ?? "all",
    availability: "all",
    onSale: searchParams.get("sale") === "1",
  });

  const urlQ = searchParams.get("q") ?? undefined;
  const urlSort = parseSort(searchParams.get("sort")) ?? "newest";
  const urlSale = searchParams.get("sale") === "1";

  const filters: ProductFiltersState = useMemo(
    () => ({
      ...localFilters,
      department: department ?? localFilters.department ?? "all",
      q: urlQ,
      sort: urlSort,
      onSale: urlSale || localFilters.onSale,
    }),
    [localFilters, department, urlQ, urlSort, urlSale]
  );

  const syncUrl = useCallback(
    (next: ProductFiltersState) => {
      const params = new URLSearchParams();
      if (next.q?.trim()) params.set("q", next.q.trim());
      if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
      if (next.onSale) params.set("sale", "1");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const handleChange = (next: ProductFiltersState) => {
    const locked = department ? { ...next, department } : next;
    setLocalFilters({
      department: locked.department,
      minPrice: locked.minPrice,
      maxPrice: locked.maxPrice,
      sizes: locked.sizes,
      colors: locked.colors,
      availability: locked.availability,
      onSale: locked.onSale,
    });
    syncUrl(locked);
  };

  const handleClear = () => {
    const cleared: ProductFiltersState = {
      q: undefined,
      sort: "newest",
      department: department ?? "all",
      minPrice: undefined,
      maxPrice: undefined,
      sizes: undefined,
      colors: undefined,
      availability: "all",
      onSale: false,
    };
    setLocalFilters({
      department: cleared.department,
      availability: "all",
      onSale: false,
      minPrice: undefined,
      maxPrice: undefined,
      sizes: undefined,
      colors: undefined,
    });
    syncUrl(cleared);
  };

  const baseProducts = useMemo(() => {
    if (!department) return products;
    return products.filter((p) => p.department === department);
  }, [products, department]);

  const options = useMemo(
    () =>
      collectFilterOptions(baseProducts.filter((p) => p.status !== "draft")),
    [baseProducts]
  );

  const filtered = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.q?.trim()) {
    activeChips.push({
      key: "q",
      label: `“${filters.q.trim()}”`,
      clear: () => handleChange({ ...filters, q: undefined }),
    });
  }
  if (filters.onSale) {
    activeChips.push({
      key: "sale",
      label: "Sale",
      clear: () => handleChange({ ...filters, onSale: false }),
    });
  }
  filters.sizes?.forEach((s) =>
    activeChips.push({
      key: `size-${s}`,
      label: `Size ${s}`,
      clear: () =>
        handleChange({
          ...filters,
          sizes: filters.sizes?.filter((x) => x !== s),
        }),
    })
  );
  filters.colors?.forEach((c) =>
    activeChips.push({
      key: `color-${c}`,
      label: c,
      clear: () =>
        handleChange({
          ...filters,
          colors: filters.colors?.filter((x) => x !== c),
        }),
    })
  );

  const heading = department ? DEPARTMENT_LABELS[department] : "Shop";
  const description = department
    ? DEPARTMENT_DESCRIPTIONS[department]
    : "Fashion, footwear and home essentials — priced in USD.";

  const showSizes = filters.department !== "appliances";
  const activeFilterCount =
    (filters.sizes?.length ?? 0) +
    (filters.colors?.length ?? 0) +
    (filters.onSale ? 1 : 0) +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <nav aria-label="Breadcrumb" className="mb-3 text-[11px] text-muted sm:mb-4 sm:text-xs">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-pink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          {department ? (
            <>
              <li>
                <Link href="/shop" className="hover:text-pink">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{DEPARTMENT_LABELS[department]}</li>
            </>
          ) : (
            <li className="text-ink">Shop</li>
          )}
        </ol>
      </nav>

      <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3 sm:mb-5 sm:gap-3 sm:pb-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl md:text-3xl">
            {heading}
          </h1>
          <p className="mt-1 line-clamp-2 text-[12px] text-muted sm:text-sm">
            {description}
          </p>
        </div>
        <p className="hidden text-xs font-semibold uppercase tracking-wider text-muted sm:block">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="mb-3 flex items-center gap-2 lg:hidden">
        <p className="mr-auto text-[11px] font-semibold uppercase tracking-wider text-muted">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-pink px-1.5 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <select
          value={filters.sort ?? "newest"}
          onChange={(e) =>
            handleChange({
              ...filters,
              sort: e.target.value as SortOption,
            })
          }
          aria-label="Sort products"
          className="h-10 max-w-[9.5rem] border border-border bg-white px-2 text-[11px] font-semibold uppercase tracking-wider text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 border border-border bg-white px-2.5 py-1 text-xs hover:border-pink hover:text-pink"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold uppercase tracking-wider text-pink"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-[calc(4.5rem+2.75rem)] max-h-[calc(100dvh-7.5rem)] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
            <ProductFilters
              filters={filters}
              options={options}
              onChange={handleChange}
              onClear={handleClear}
              lockDepartment={Boolean(department)}
              hideSizes={!showSizes}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 hidden items-center justify-end lg:flex">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Sort
              <select
                value={filters.sort ?? "newest"}
                onChange={(e) =>
                  handleChange({
                    ...filters,
                    sort: e.target.value as SortOption,
                  })
                }
                className="h-9 border border-border bg-white px-2 text-xs font-semibold uppercase tracking-wider text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-neutral px-6 py-16 text-center">
              <h2 className="font-display text-xl font-bold uppercase">
                No matches
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Nothing matches your filters. Try clearing a filter or browsing
                the full catalogue.
              </p>
              <Button
                type="button"
                variant="pink"
                className="mt-6"
                onClick={handleClear}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-x-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:max-w-sm sm:rounded-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">
                Filters
              </h2>
              <button
                type="button"
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <ProductFilters
                filters={filters}
                options={options}
                onChange={handleChange}
                onClear={handleClear}
                lockDepartment={Boolean(department)}
                hideSizes={!showSizes}
                hideHeader
                hideSort
              />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear all
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => setMobileOpen(false)}
              >
                Apply ({filtered.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
