import { Skeleton } from "@/components/ui/skeleton";

/** Mesmo formato do `ProductCard`, para não haver pulo de layout. */
export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-xl border bg-card"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-6 w-3/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="mt-3 h-4 w-24" />
      </div>
    </div>
  );
}

export const PRODUCT_GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={PRODUCT_GRID_CLASS}>
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders sem identidade
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
