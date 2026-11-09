import type { Metadata } from "next";
import { Suspense } from "react";
import { BRAND_NAME } from "@/components/brand";
import { HomeHero } from "@/features/home/hero";
import { ProductGridSkeleton } from "@/features/products/product-card-skeleton";
import { ProductGrid } from "@/features/products/product-grid";

export const metadata: Metadata = {
  title: `Produtos · ${BRAND_NAME}`,
  description:
    "Explore produtos, leia avaliações da comunidade e compartilhe sua opinião.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section
        id="produtos"
        aria-labelledby="produtos-title"
        className="mx-auto w-full max-w-6xl scroll-mt-20 space-y-8 px-5 py-12 sm:py-16"
      >
        <header className="max-w-2xl space-y-2">
          <h2
            id="produtos-title"
            className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Produtos
          </h2>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            Escolha um produto para ler as avaliações de quem já usou e contar
            como foi a sua experiência.
          </p>
        </header>

        {/* A lista é buscada no cliente (scroll infinito); o skeleton ocupa o
            mesmo espaço da grade enquanto o JS carrega. */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </section>
    </>
  );
}
