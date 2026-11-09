import { cn } from "cn";
import { STAR_PATH } from "@/components/brand";
import { SCORE_MAX } from "./schema";

const STARS = Array.from({ length: SCORE_MAX }, (_, i) => i + 1);

/** "4,3" — uma casa decimal, no formato pt-BR. */
export function formatScore(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

type StarRatingProps = {
  /** Nota de 0 a 5; aceita frações (média), preenchendo a estrela parcialmente. */
  value: number;
  className?: string;
  starClassName?: string;
};

/** Exibição (somente leitura) de uma nota em estrelas. */
export function StarRating({
  value,
  className,
  starClassName,
}: StarRatingProps) {
  return (
    <span
      role="img"
      aria-label={`Nota ${formatScore(value)} de ${SCORE_MAX}`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {STARS.map((star) => {
        const fill = Math.min(Math.max(value - (star - 1), 0), 1);
        return (
          <span
            key={star}
            aria-hidden="true"
            className={cn("relative size-4 shrink-0", starClassName)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="absolute inset-0 size-full text-border"
              fill="currentColor"
            >
              <path d={STAR_PATH} />
            </svg>
            {fill > 0 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="absolute inset-0 size-full text-star"
                fill="currentColor"
                style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
              >
                <path d={STAR_PATH} />
              </svg>
            )}
          </span>
        );
      })}
    </span>
  );
}
