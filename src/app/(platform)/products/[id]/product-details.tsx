import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeedbackComposer,
  OwnFeedbackMarker,
} from "@/features/feedbacks/feedback-composer";
import { FeedbackList } from "@/features/feedbacks/feedback-list";
import { formatScore, StarRating } from "@/features/feedbacks/star-rating";
import {
  getProduct,
  getProductFeedbacks,
  type Product,
} from "@/server/products/get-product";

function reviewsLabel(count: number): string {
  return count === 1
    ? "1 avaliação"
    : `${count.toLocaleString("pt-BR")} avaliações`;
}

/** Produto + avaliações + formulário. Lê `params` (runtime): fica sob `<Suspense>`. */
export async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, feedbacks] = await Promise.all([
    getProduct(id),
    getProductFeedbacks(id),
  ]);
  if (!product) notFound();

  // Média calculada com as avaliações já carregadas (sem consulta extra).
  const count = feedbacks.length;
  const average = count
    ? feedbacks.reduce((sum, f) => sum + f.score, 0) / count
    : 0;

  return (
    <>
      <ProductHero product={product} average={average} count={count} />

      <section
        id="avaliacoes"
        aria-labelledby="avaliacoes-titulo"
        className="mt-16 grid max-w-3xl scroll-mt-24 gap-8 sm:mt-20"
      >
        <header className="flex items-baseline justify-between gap-4 border-b pb-4">
          <h2
            id="avaliacoes-titulo"
            className="text-2xl font-semibold tracking-tight [font-stretch:90%]"
          >
            Avaliações
          </h2>
          {count > 0 && (
            <span className="text-sm text-muted-foreground">
              {reviewsLabel(count)}
            </span>
          )}
        </header>
        <FeedbackList
          feedbacks={feedbacks}
          renderBadge={(authorId) => (
            <Suspense fallback={null}>
              <OwnFeedbackMarker authorId={authorId} />
            </Suspense>
          )}
        />
      </section>

      <section
        aria-labelledby="avaliar-titulo"
        className="mt-16 grid max-w-3xl gap-6 sm:mt-20"
      >
        <header className="grid gap-1.5">
          <h2
            id="avaliar-titulo"
            className="text-2xl font-semibold tracking-tight [font-stretch:90%]"
          >
            Avaliar este produto
          </h2>
          <p className="text-muted-foreground">
            Dê uma nota de 1 a 5 e conte como foi sua experiência.
          </p>
        </header>
        <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
          <FeedbackComposer productId={product.id} feedbacks={feedbacks} />
        </Suspense>
      </section>
    </>
  );
}

function ProductHero({
  product,
  average,
  count,
}: {
  product: Product;
  average: number;
  count: number;
}) {
  // O link vem do cadastro; só aceitamos http(s) para não virar `javascript:`.
  const externalLink = /^https?:\/\//i.test(product.externalLink)
    ? product.externalLink
    : null;

  return (
    <article className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <div className="relative aspect-square overflow-hidden rounded-3xl border bg-card">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 30rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="grid gap-7 lg:pt-6">
        <h1 className="text-[2.2rem] leading-[1.04] font-semibold tracking-[-0.01em] text-balance [font-stretch:88%] sm:text-[2.75rem] lg:text-[3.2rem]">
          {product.name}
        </h1>

        <a
          href="#avaliacoes"
          className="group flex w-fit items-center gap-4 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {count > 0 && (
            <span
              aria-hidden="true"
              className="text-5xl leading-none font-semibold tabular-nums [font-stretch:85%]"
            >
              {formatScore(average)}
            </span>
          )}
          <span className="grid gap-1.5">
            <StarRating value={average} starClassName="size-5" />
            <span className="text-sm text-muted-foreground underline-offset-4 group-hover:text-foreground group-hover:underline">
              {count > 0 ? reviewsLabel(count) : "Nenhuma avaliação ainda"}
            </span>
          </span>
        </a>

        {product.description && (
          <p className="max-w-[60ch] text-lg leading-relaxed text-pretty whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>
        )}

        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-fit gap-2 rounded-lg bg-card px-5 text-base font-semibold",
            )}
          >
            Ver produto
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Carregando produto...</span>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="grid gap-7 lg:pt-6">
          <div className="grid gap-3">
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-12 w-1/2" />
          </div>
          <Skeleton className="h-12 w-56" />
          <div className="grid gap-2.5">
            <Skeleton className="h-5 w-full max-w-[60ch]" />
            <Skeleton className="h-5 w-11/12 max-w-[60ch]" />
            <Skeleton className="h-5 w-3/5" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
      <div className="mt-16 grid max-w-3xl gap-8 sm:mt-20">
        <Skeleton className="h-8 w-40" />
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
