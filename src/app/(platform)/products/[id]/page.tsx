import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BRAND_NAME } from "@/components/brand";
import { getProduct } from "@/server/products/get-product";
import { ProductDetails, ProductDetailsSkeleton } from "./product-details";

type ProductPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  // `getProduct` é deduplicado: a página reaproveita esta mesma consulta.
  const product = await getProduct(id);
  if (!product) return { title: `Produto não encontrado · ${BRAND_NAME}` };

  return {
    title: `${product.name} · ${BRAND_NAME}`,
    description: product.description ?? undefined,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <>
      <Link
        href="/"
        className="-ml-1 mb-8 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Produtos
      </Link>

      {/* Sem generateStaticParams, `params` é dado de runtime (Cache Components). */}
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </>
  );
}
