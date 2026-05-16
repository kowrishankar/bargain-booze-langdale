import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { HeroSlide } from "@/components/home/HeroSlide";
import { WelcomeOfferSlide } from "@/components/home/WelcomeOfferSlide";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DeliverySection } from "@/components/home/DeliverySection";
import { VisitSection } from "@/components/home/VisitSection";
import { isPromotionActive } from "@/lib/promotions";

export default async function HomePage() {
  const [featured, allPromotions] = await Promise.all([
    prisma.product.findMany({
      where: { archived: false },
      include: { promotion: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.promotion.findMany({
      where: {
        active: true,
        products: { some: { archived: false } },
      },
      include: {
        products: {
          where: { archived: false },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const promotions = allPromotions.filter((p) => isPromotionActive(p));

  return (
    <>
      <HomeHeroCarousel>
        <HeroSlide />
        <WelcomeOfferSlide />
      </HomeHeroCarousel>

      <FeaturesSection />

      <PromotionsSection promotions={promotions} />

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
          <div className="mb-6 flex items-end justify-between border-l-4 border-brand pl-4">
            <h2 className="brand-display text-2xl sm:text-3xl">Popular picks</h2>
            <Link href="/shop" className="text-sm font-bold text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <DeliverySection />

      <VisitSection />
    </>
  );
}
