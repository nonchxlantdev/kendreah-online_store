"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatUSD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlistToggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.productIds.includes(product.id));
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [hovered, setHovered] = useState(false);

  const soldOut = product.status === "sold_out" || product.stock <= 0;
  const needsSelection = Boolean(product.sizes?.length || product.colors?.length);
  const onSale =
    Boolean(product.compareAtPrice) &&
    (product.compareAtPrice as number) > product.price;
  const secondary = product.images[1];

  const handleQuickAdd = () => {
    if (soldOut) return;
    if (needsSelection) {
      setOpen(true);
      return;
    }
    addItem({ productId: product.id, quantity: 1 });
    toast.success("Added to bag");
  };

  const confirmAdd = () => {
    if (product.sizes?.length && !size) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors?.length && !color) {
      toast.error("Please select a colour");
      return;
    }
    const colorObj = product.colors?.find((c) => c.name === color);
    addItem({
      productId: product.id,
      quantity: 1,
      size,
      color,
      colorHex: colorObj?.hex,
    });
    toast.success("Added to bag");
    setOpen(false);
  };

  return (
    <>
      <article
        className="group flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral">
          <Link href={`/product/${product.slug}`} className="absolute inset-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                "object-cover transition duration-500",
                hovered && secondary ? "opacity-0" : "opacity-100"
              )}
              priority={index < 4}
            />
            {secondary && (
              <Image
                src={secondary}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={cn(
                  "object-cover transition duration-500",
                  hovered ? "opacity-100 scale-105" : "opacity-0"
                )}
                aria-hidden
              />
            )}
          </Link>

          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {product.isNew && !onSale && <Badge tone="ink">New</Badge>}
            {onSale && <Badge tone="sale">Sale</Badge>}
            {soldOut && <Badge tone="ink">Sold out</Badge>}
          </div>

          <button
            type="button"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => {
              wishlistToggle(product.id);
              toast.success(
                inWishlist ? "Removed from wishlist" : "Saved to wishlist"
              );
            }}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center bg-white/95 text-ink transition hover:text-pink"
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-pink text-pink")}
            />
          </button>

          {!soldOut && (
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-ink p-2 transition duration-300 group-hover:translate-y-0 max-md:translate-y-0">
              <Button
                size="sm"
                variant="pink"
                className="w-full"
                onClick={handleQuickAdd}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Quick add
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1.5">
          <Link
            href={`/product/${product.slug}`}
            className="block text-[13px] font-medium leading-snug text-ink hover:text-pink"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-2 text-sm">
            <span
              className={cn(
                "font-bold tabular-nums",
                onSale ? "text-pink" : "text-ink"
              )}
            >
              {formatUSD(product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-muted line-through tabular-nums">
                {formatUSD(product.compareAtPrice!)}
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 pt-0.5">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{product.name}</DialogTitle>
            <DialogDescription>
              Select options before adding to your bag.
            </DialogDescription>
          </DialogHeader>
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider">
                Colour
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "h-9 border px-3 text-xs",
                      color === c.name
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white"
                    )}
                  >
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-9 min-w-10 border px-3 text-xs",
                      size === s
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button variant="default" onClick={confirmAdd}>
            Add to bag
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
