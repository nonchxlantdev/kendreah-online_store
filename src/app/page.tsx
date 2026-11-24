import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { HomeLiving } from "@/components/home/home-living";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Newsletter } from "@/components/home/newsletter";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustStrip } from "@/components/home/trust-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryCards />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <HomeLiving />
      <Newsletter />
    </>
  );
}
