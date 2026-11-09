import type { Metadata } from "next";
import { Suspense } from "react";
import { BRAND_NAME } from "@/components/brand";
import { ProductGridSkeleton } from "@/features/products/product-card-skeleton";
import { ProductGrid } from "@/features/products/product-grid";

export const metadata: Metadata = {
  title: `Produtos · ${BRAND_NAME}`,
  description:
    "Veja os produtos cadastrados e o que dizem as pessoas que já usaram cada um.",
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Produtos
        </h1>
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
    </div>
  );
}
