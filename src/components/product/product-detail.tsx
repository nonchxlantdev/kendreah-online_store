"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEMO_SHIPPING_RATES } from "@/lib/shipping";
import { cn, formatUSD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCatalogStore } from "@/store/catalog-store";
import { useWishlistStore } from "@/store/wishlist-store";
import {
  DEPARTMENT_LABELS,
  type Product,
} from "@/types";

const CLOTHING_SIZE_GUIDE = [
  { size: "XS", bust: "32–33", waist: "24–25", hip: "34–35" },
  { size: "S", bust: "34–35", waist: "26–27", hip: "36–37" },
  { size: "M", bust: "36–37", waist: "28–29", hip: "38–39" },
  { size: "L", bust: "38–40", waist: "30–32", hip: "40–42" },
  { size: "XL", bust: "41–43", waist: "33–35", hip: "43–45" },
  { size: "XXL", bust: "44–46", waist: "36–38", hip: "46–48" },
];

const FOOTWEAR_SIZE_GUIDE = [
  { size: "6", us: "6", eu: "36–37", cm: "23" },
  { size: "7", us: "7", eu: "37–38", cm: "24" },
  { size: "8", us: "8", eu: "38–39", cm: "25" },
  { size: "9", us: "9", eu: "40–41", cm: "26" },
  { size: "10", us: "10", eu: "42–43", cm: "27" },
  { size: "11", us: "11", eu: "44", cm: "28" },
  { size: "12", us: "12", eu: "45", cm: "29" },
];

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const wishlistToggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) =>
    s.productIds.includes(product.id)
  );
  const allProducts = useCatalogStore((s) => s.products);

  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const soldOut = product.status === "sold_out" || product.stock <= 0;
  const maxQty = Math.max(0, product.stock);
  const images = product.images;
  const hasSizes = Boolean(product.sizes && product.sizes.length > 0);
  const hasColors = Boolean(product.colors && product.colors.length > 0);
  const showSizeGuide =
    product.department === "clothes" || product.department === "footwear";

  const related = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          p.department === product.department &&
          p.status !== "draft"
      )
      .slice(0, 4);
  }, [allProducts, product.id, product.department]);

  const specsEntries = Object.entries(product.specs).filter(
    ([, value]) => Boolean(value)
  );

  const goPrev = () =>
    setImageIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setImageIndex((i) => (i + 1) % images.length);

  const validateSelection = (): boolean => {
    if (hasSizes && !size) {
      toast.error("Please select a size");
      return false;
    }
    if (hasColors && !color) {
      toast.error("Please select a colour");
      return false;
    }
    return true;
  };

  const addToCart = (redirectCheckout = false) => {
    if (soldOut) {
      toast.error("This item is sold out");
      return;
    }
    if (!validateSelection()) return;

    const colorObj = product.colors?.find((c) => c.name === color);
    addItem({
      productId: product.id,
      quantity: qty,
      size,
      color,
      colorHex: colorObj?.hex,
    });
    toast.success(redirectCheckout ? "Added — heading to checkout" : "Added to bag");
    if (redirectCheckout) {
      router.push("/checkout");
    }
  };

  const onSale =
    Boolean(product.compareAtPrice) &&
    (product.compareAtPrice as number) > product.price;

  return (
    <div className="mx-auto max-w-[1400px] px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:pb-10 sm:py-6 lg:px-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-3 text-[11px] text-muted sm:mb-5 sm:text-xs">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-pink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-pink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/category/${product.department}`}
              className="hover:text-pink"
            >
              {DEPARTMENT_LABELS[product.department]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="max-w-[12rem] truncate text-ink sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-[4/5] overflow-hidden bg-neutral touch-pan-y"
            onTouchStart={(e) => {
              touchStartX.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null || images.length < 2) return;
              const dx =
                (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) < 40) return;
              if (dx < 0) goNext();
              else goPrev();
            }}
          >
            <Image
              src={images[imageIndex]}
              alt={`${product.name} — image ${imageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              draggable={false}
            />
            {soldOut && (
              <div className="absolute left-3 top-3">
                <Badge tone="ink">Sold out</Badge>
              </div>
            )}
            {product.isNew && !soldOut && !onSale && (
              <div className="absolute left-3 top-3">
                <Badge tone="ink">New</Badge>
              </div>
            )}
            {onSale && !soldOut && (
              <div className="absolute left-3 top-3">
                <Badge tone="sale">Sale</Badge>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/95 text-ink transition hover:bg-white sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/95 text-ink transition hover:bg-white sm:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 sm:hidden">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => setImageIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === imageIndex
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/55"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 hidden gap-2 overflow-x-auto pb-1 sm:flex">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden border-2 transition",
                    i === imageIndex ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-pink">
            {DEPARTMENT_LABELS[product.department]}
          </p>
          <h1 className="mt-2 font-display text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-3 sm:mt-4">
            <span
              className={cn(
                "text-xl font-bold tabular-nums sm:text-2xl",
                onSale ? "text-pink" : "text-ink"
              )}
            >
              {formatUSD(product.price)}
            </span>
            {onSale && (
              <span className="text-base text-muted line-through tabular-nums">
                {formatUSD(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm">
            {soldOut ? (
              <span className="font-medium text-danger">Sold out</span>
            ) : product.stock <= 5 ? (
              <span className="font-medium text-pink">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="font-medium text-success">In stock</span>
            )}
          </p>

          <p className="mt-4 text-muted">{product.shortDescription}</p>

          {hasColors && (
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">
                  Colour{color ? `: ${color}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors!.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "flex h-10 items-center gap-2 border px-3 text-xs transition",
                      color === c.name
                        ? "border-ink bg-ink text-soft-white"
                        : "border-border bg-white hover:border-ink/40"
                    )}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  Size{size ? `: ${size}` : ""}
                </p>
                {showSizeGuide && (
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs font-medium text-pink underline-offset-2 hover:underline"
                  >
                    Size guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cn(
                      "h-10 min-w-11 border px-3 text-sm transition",
                      size === s
                        ? "border-ink bg-ink text-soft-white"
                        : "border-border bg-white hover:border-ink/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!soldOut && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={qty >= maxQty}
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 hidden flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="default"
              size="lg"
              className="flex-1 sm:min-w-[10rem]"
              disabled={soldOut}
              onClick={() => addToCart(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              {soldOut ? "Sold out" : "Add to bag"}
            </Button>
            <Button
              type="button"
              variant="pink"
              size="lg"
              className="flex-1 sm:min-w-[10rem]"
              disabled={soldOut}
              onClick={() => addToCart(true)}
            >
              Buy now
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={() => {
                wishlistToggle(product.id);
                toast.success(
                  inWishlist ? "Removed from wishlist" : "Saved to wishlist"
                );
              }}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  inWishlist && "fill-pink text-pink"
                )}
              />
              Wishlist
            </Button>
          </div>

          {/* Mobile purchase actions (non-sticky duplicate for flow) */}
          <div className="mt-6 flex gap-2 sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-3"
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={() => {
                wishlistToggle(product.id);
                toast.success(
                  inWishlist ? "Removed from wishlist" : "Saved to wishlist"
                );
              }}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  inWishlist && "fill-pink text-pink"
                )}
              />
            </Button>
            <Button
              type="button"
              variant="pink"
              size="lg"
              className="flex-1"
              disabled={soldOut}
              onClick={() => addToCart(true)}
            >
              Buy now
            </Button>
          </div>

          <p className="mt-5 text-sm text-ink">
            Ships to Belize &amp; the United States.
          </p>

          <Accordion type="single" collapsible className="mt-8" defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line">{product.description}</p>
              </AccordionContent>
            </AccordionItem>
            {specsEntries.length > 0 && (
              <AccordionItem value="specs">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <dl className="divide-y divide-border border border-border">
                    {specsEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[7rem_1fr] gap-3 px-3 py-2.5 text-sm sm:grid-cols-[10rem_1fr]"
                      >
                        <dt className="font-medium capitalize text-ink">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </dt>
                        <dd className="text-muted">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping information</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">
                  We currently ship demonstration orders to Belize and the
                  United States. All prices are shown in USD.
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-ink">Belize:</strong>{" "}
                    {formatUSD(DEMO_SHIPPING_RATES.Belize.amount)} —{" "}
                    {DEMO_SHIPPING_RATES.Belize.note}
                  </li>
                  <li>
                    <strong className="text-ink">United States:</strong>{" "}
                    {formatUSD(DEMO_SHIPPING_RATES["United States"].amount)} —{" "}
                    {DEMO_SHIPPING_RATES["United States"].note}
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery &amp; returns</AccordionTrigger>
              <AccordionContent>
                <p>
                  Delivery timelines and return policies will be confirmed
                  before launch. This storefront is an illustrative demo —
                  checkout completes as a sample order only. For questions
                  about a future purchase, contact Ken&apos; Dreah directly.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10 border-t border-border pt-8 sm:mt-16 sm:pt-12 lg:mt-20">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink sm:text-xl md:text-2xl">
            You may also like
          </h2>
          <p className="mt-1 text-sm text-muted sm:mt-2">
            More from {DEPARTMENT_LABELS[product.department]}.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-2 gap-y-6 sm:mt-8 sm:gap-x-3 sm:gap-y-8 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile Add to Bag */}
      <div
        className="fixed inset-x-0 z-30 border-t border-border bg-white/95 px-3 py-2.5 backdrop-blur sm:hidden"
        style={{
          bottom: "calc(3.5rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "text-base font-bold tabular-nums",
                onSale ? "text-pink" : "text-ink"
              )}
            >
              {formatUSD(product.price)}
            </p>
            {onSale && (
              <p className="text-[11px] text-muted line-through tabular-nums">
                {formatUSD(product.compareAtPrice!)}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="ml-auto flex-1"
            disabled={soldOut}
            onClick={() => addToCart(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            {soldOut ? "Sold out" : "Add to bag"}
          </Button>
        </div>
      </div>

      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Size guide</DialogTitle>
            <DialogDescription>
              Illustrative chart for fit reference only — measurements may vary
              by style.
            </DialogDescription>
          </DialogHeader>
          {product.department === "footwear" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-ink">
                    <th className="py-2 pr-3 font-medium">Size</th>
                    <th className="py-2 pr-3 font-medium">US</th>
                    <th className="py-2 pr-3 font-medium">EU</th>
                    <th className="py-2 font-medium">Foot (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {FOOTWEAR_SIZE_GUIDE.filter((row) =>
                    product.sizes?.includes(row.size)
                  ).length > 0
                    ? FOOTWEAR_SIZE_GUIDE.filter((row) =>
                        product.sizes?.includes(row.size)
                      ).map((row) => (
                        <tr key={row.size} className="border-b border-border">
                          <td className="py-2 pr-3">{row.size}</td>
                          <td className="py-2 pr-3">{row.us}</td>
                          <td className="py-2 pr-3">{row.eu}</td>
                          <td className="py-2">{row.cm}</td>
                        </tr>
                      ))
                    : FOOTWEAR_SIZE_GUIDE.map((row) => (
                        <tr key={row.size} className="border-b border-border">
                          <td className="py-2 pr-3">{row.size}</td>
                          <td className="py-2 pr-3">{row.us}</td>
                          <td className="py-2 pr-3">{row.eu}</td>
                          <td className="py-2">{row.cm}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-ink">
                    <th className="py-2 pr-3 font-medium">Size</th>
                    <th className="py-2 pr-3 font-medium">Bust (in)</th>
                    <th className="py-2 pr-3 font-medium">Waist (in)</th>
                    <th className="py-2 font-medium">Hip (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {CLOTHING_SIZE_GUIDE.filter((row) =>
                    product.sizes?.includes(row.size)
                  ).length > 0
                    ? CLOTHING_SIZE_GUIDE.filter((row) =>
                        product.sizes?.includes(row.size)
                      ).map((row) => (
                        <tr key={row.size} className="border-b border-border">
                          <td className="py-2 pr-3">{row.size}</td>
                          <td className="py-2 pr-3">{row.bust}</td>
                          <td className="py-2 pr-3">{row.waist}</td>
                          <td className="py-2">{row.hip}</td>
                        </tr>
                      ))
                    : CLOTHING_SIZE_GUIDE.map((row) => (
                        <tr key={row.size} className="border-b border-border">
                          <td className="py-2 pr-3">{row.size}</td>
                          <td className="py-2 pr-3">{row.bust}</td>
                          <td className="py-2 pr-3">{row.waist}</td>
                          <td className="py-2">{row.hip}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
