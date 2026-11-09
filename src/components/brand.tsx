import { cn } from "cn";

/** Nome exibido no app (cabeçalho e títulos de página). */
export const BRAND_NAME = "Avaliação de Produto";

export function Brand({
  className,
  nameClassName,
}: {
  className?: string;
  /** Classes do nome (ex.: `sr-only sm:not-sr-only` para só o ícone no mobile). */
  nameClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      </span>
      <span className={nameClassName}>{BRAND_NAME}</span>
    </span>
  );
}

export const STAR_PATH =
  "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.53L12 17.5l-5.87 3.07 1.12-6.53L2.5 9.41l6.56-.95L12 2.5z";
