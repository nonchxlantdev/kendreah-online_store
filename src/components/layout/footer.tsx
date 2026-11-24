import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-4">
          <BrandLogo href={null} size="md" inverted showTagline />
          <p className="mt-5 max-w-xs text-sm text-white/65">
            Trendy fashion, footwear and everyday home essentials for customers
            in Belize and the United States.
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Shop
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>
              <Link href="/shop" className="hover:text-pink">
                All products
              </Link>
            </li>
            <li>
              <Link href="/category/clothes" className="hover:text-pink">
                Clothing
              </Link>
            </li>
            <li>
              <Link href="/category/footwear" className="hover:text-pink">
                Footwear
              </Link>
            </li>
            <li>
              <Link href="/category/appliances" className="hover:text-pink">
                Home &amp; Living
              </Link>
            </li>
            <li>
              <Link href="/shop?sort=newest" className="hover:text-pink">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Customer care
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>
              <Link href="/delivery-returns" className="hover:text-pink">
                Delivery &amp; returns
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-pink">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-pink">
                About
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-pink">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/nda" className="hover:text-pink">
                Demo NDA
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-soft">
            Get in touch
          </p>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>Email: [To be confirmed]</li>
            <li>Phone: [To be confirmed]</li>
            <li>WhatsApp: [To be confirmed]</li>
            <li>Social: [To be confirmed]</li>
          </ul>
          <p className="mt-5 text-xs text-white/50">
            Based in the United States · Ships to Belize &amp; USA · Currency
            USD
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/55 lg:px-8">
          <p>
            © {new Date().getFullYear()} Ken&apos; Dreah Online Store. Demo
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Cards via Stripe
            </span>
            <span>PayPal</span>
            <span className="text-pink-soft">Trendy · Quality · Affordable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
