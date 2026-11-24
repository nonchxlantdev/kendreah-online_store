"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  ProductFilters as ProductFiltersState,
  SortOption,
} from "@/lib/filters";
import {
  DEPARTMENT_LABELS,
  type Department,
} from "@/types";

export interface FilterOptions {
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}

const DEPARTMENTS: Array<Department | "all"> = [
  "all",
  "clothes",
  "footwear",
  "appliances",
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface ProductFiltersProps {
  filters: ProductFiltersState;
  options: FilterOptions;
  onChange: (next: ProductFiltersState) => void;
  onClear: () => void;
  className?: string;
  /** When true, hide category control (department is locked by the page). */
  lockDepartment?: boolean;
  /** Hide size filters (e.g. Home & Living appliances). */
  hideSizes?: boolean;
}

function toggleInList(list: string[] | undefined, value: string): string[] {
  const current = list ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export function ProductFilters({
  filters,
  options,
  onChange,
  onClear,
  className,
  lockDepartment = false,
  hideSizes = false,
}: ProductFiltersProps) {
  const patch = (partial: Partial<ProductFiltersState>) =>
    onChange({ ...filters, ...partial });

  const hasActive =
    Boolean(filters.q?.trim()) ||
    (filters.department && filters.department !== "all" && !lockDepartment) ||
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number" ||
    (filters.sizes && filters.sizes.length > 0) ||
    (filters.colors && filters.colors.length > 0) ||
    (filters.availability && filters.availability !== "all") ||
    Boolean(filters.onSale) ||
    (filters.sort && filters.sort !== "newest");

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-ink">
          Filters
        </h2>
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 px-2 text-xs text-muted hover:text-pink"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-search">Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="filter-search"
            type="search"
            placeholder="Search products…"
            value={filters.q ?? ""}
            onChange={(e) =>
              patch({ q: e.target.value.length ? e.target.value : undefined })
            }
            className="pl-9"
          />
        </div>
      </div>

      {!lockDepartment && (
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-col gap-1.5">
            {DEPARTMENTS.map((dept) => {
              const selected = (filters.department ?? "all") === dept;
              const label =
                dept === "all" ? "All categories" : DEPARTMENT_LABELS[dept];
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() =>
                    patch({ department: dept === "all" ? "all" : dept })
                  }
                  className={cn(
                    "border px-3 py-2 text-left text-sm transition",
                    selected
                      ? "border-ink bg-ink text-soft-white"
                      : "border-border bg-white text-ink hover:border-ink/40"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Price (USD)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-xs text-muted">Min</span>
            <Input
              type="number"
              min={0}
              step={1}
              placeholder={String(options.minPrice)}
              value={filters.minPrice ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                patch({
                  minPrice:
                    raw === "" ? undefined : Math.max(0, Number(raw) || 0),
                });
              }}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs text-muted">Max</span>
            <Input
              type="number"
              min={0}
              step={1}
              placeholder={String(options.maxPrice)}
              value={filters.maxPrice ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                patch({
                  maxPrice:
                    raw === "" ? undefined : Math.max(0, Number(raw) || 0),
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 accent-pink"
            checked={Boolean(filters.onSale)}
            onChange={(e) => patch({ onSale: e.target.checked })}
          />
          On sale
        </label>
      </div>

      {!hideSizes && options.sizes.length > 0 && (
        <div className="space-y-2">
          <Label>Size</Label>
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((size) => {
              const checked = filters.sizes?.includes(size) ?? false;
              return (
                <label
                  key={size}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 border px-2.5 py-1.5 text-xs transition",
                    checked
                      ? "border-ink bg-ink text-soft-white"
                      : "border-border bg-white hover:border-ink/40"
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() =>
                      patch({ sizes: toggleInList(filters.sizes, size) })
                    }
                  />
                  {size}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {options.colors.length > 0 && (
        <div className="space-y-2">
          <Label>Colour</Label>
          <div className="flex flex-col gap-1.5">
            {options.colors.map((color) => {
              const checked = filters.colors?.includes(color) ?? false;
              return (
                <label
                  key={color}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-pink"
                    checked={checked}
                    onChange={() =>
                      patch({ colors: toggleInList(filters.colors, color) })
                    }
                  />
                  {color}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="filter-availability">Availability</Label>
        <select
          id="filter-availability"
          value={filters.availability ?? "all"}
          onChange={(e) =>
            patch({
              availability: e.target
                .value as ProductFiltersState["availability"],
            })
          }
          className="flex h-11 w-full border border-border bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
        >
          <option value="all">All</option>
          <option value="in_stock">In stock</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-sort">Sort by</Label>
        <select
          id="filter-sort"
          value={filters.sort ?? "newest"}
          onChange={(e) => patch({ sort: e.target.value as SortOption })}
          className="flex h-11 w-full border border-border bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasActive && (
        <Button type="button" variant="outline" className="w-full" onClick={onClear}>
          Clear all filters
        </Button>
      )}
    </aside>
  );
}
