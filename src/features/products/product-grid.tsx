"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { CircleAlert, PackageOpen, RotateCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { ProductCard } from "./product-card";
import {
  PRODUCT_GRID_CLASS,
  ProductCardSkeleton,
  ProductGridSkeleton,
} from "./product-card-skeleton";
import { PRODUCTS_PAGE_SIZE } from "./schema";

/** Começa a buscar a próxima página antes de o sentinela entrar na tela. */
const PREFETCH_MARGIN = "600px 0px";

export function ProductGrid() {
  const trpc = useTRPC();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    status,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery(
    trpc.products.infiniteQueryOptions(
      { limit: PRODUCTS_PAGE_SIZE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 60_000,
      },
    ),
  );

  // Rolagem infinita. Depois de uma falha, só o botão "Tentar de novo" busca
  // de novo (sem isso, o observer tentaria em loop com o sentinela visível).
  const canAutoLoad =
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !canAutoLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void fetchNextPage();
      },
      { rootMargin: PREFETCH_MARGIN },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canAutoLoad, fetchNextPage]);

  if (status === "pending") {
    return (
      <div aria-busy="true">
        <output className="sr-only">Carregando produtos</output>
        <ProductGridSkeleton />
      </div>
    );
  }

  // Falha numa página seguinte também deixa `status === "error"`, mas mantém
  // `data`: nesse caso a lista continua visível e o erro aparece no fim dela.
  if (!data) {
    return (
      <Alert variant="destructive" className="max-w-xl px-4 py-3">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Não foi possível carregar os produtos</AlertTitle>
        <AlertDescription>
          <p>A lista não respondeu. Verifique sua conexão e tente de novo.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void refetch()}
          >
            <RotateCw aria-hidden="true" />
            Tentar de novo
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const products = data.pages.flatMap((page) => page.items);

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-label="Lista de produtos" aria-busy={isFetchingNextPage}>
      <ul className={PRODUCT_GRID_CLASS}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
        {isFetchingNextPage
          ? Array.from({ length: 3 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders sem identidade
              <li key={`skeleton-${index}`} aria-hidden="true">
                <ProductCardSkeleton />
              </li>
            ))
          : null}
      </ul>

      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      <div className="mt-10 flex min-h-10 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
        <output className="sr-only">
          {isFetchingNextPage
            ? "Carregando mais produtos"
            : `${products.length} produtos exibidos`}
        </output>

        {isFetchNextPageError ? (
          <>
            <p className="text-destructive">
              Não foi possível carregar mais produtos.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchNextPage()}
            >
              <RotateCw aria-hidden="true" />
              Tentar de novo
            </Button>
          </>
        ) : hasNextPage ? (
          // Alternativa à rolagem (teclado, leitores de tela, observer indisponível).
          <Button
            variant="ghost"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? "Carregando…" : "Carregar mais produtos"}
          </Button>
        ) : (
          <EndOfList count={products.length} />
        )}
      </div>
    </section>
  );
}

function EndOfList({ count }: { count: number }) {
  return (
    <p className="flex w-full max-w-sm items-center gap-4 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
      {count === 1 ? "Esse é o único produto" : `Esses são todos os ${count}`}
    </p>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-input bg-card/60 px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary"
      >
        <PackageOpen className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        Nenhum produto cadastrado ainda
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Volte em breve: os produtos aparecem aqui assim que estiverem
        disponíveis para avaliação.
      </p>
    </div>
  );
}
