"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import { useCatalogStore } from "@/store/catalog-store";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const products = useCatalogStore((s) => s.products);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return products
        .filter((p) => p.status !== "draft")
        .filter((p) => p.isFeatured || p.isNew)
        .slice(0, 6);
    }
    return products
      .filter((p) => p.status !== "draft")
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.department.includes(q)
      )
      .slice(0, 10);
  }, [products, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      <div
        className="flex items-center gap-2 border-b border-border px-3 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Ken' Dreah…"
          aria-label="Search products"
          className="h-11 border-0 text-base shadow-none focus-visible:ring-0"
          style={{ fontSize: "16px" }}
        />
        <button
          type="button"
          aria-label="Close search"
          className="flex h-11 w-11 items-center justify-center"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-24">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {query.trim() ? "Results" : "Suggested"}
        </p>
        {results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-lg font-bold uppercase">No matches</p>
            <p className="mt-2 text-sm text-muted">
              Try another keyword or browse the shop.
            </p>
            <Button asChild variant="pink" className="mt-6" onClick={onClose}>
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex gap-3 active:bg-neutral"
                >
                  <div className="relative h-20 w-16 shrink-0 bg-neutral">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-pink">
                      {formatUSD(product.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && results.length > 0 && (
          <Button asChild variant="outline" className="mt-6 w-full" onClick={onClose}>
            <Link href={`/shop?q=${encodeURIComponent(query.trim())}`}>
              View all results
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
