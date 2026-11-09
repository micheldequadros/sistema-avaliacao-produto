"use client";

import { cn } from "cn";
import { type Ref, useState } from "react";
import { STAR_PATH } from "@/components/brand";
import { SCORE_MAX } from "./schema";

const STARS = Array.from({ length: SCORE_MAX }, (_, i) => i + 1);

export const SCORE_LABELS: Record<number, string> = {
  1: "Ruim",
  2: "Fraco",
  3: "Bom",
  4: "Muito bom",
  5: "Excelente",
};

type StarInputProps = {
  name: string;
  value?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
  disabled?: boolean;
  /** id da mensagem de erro/ajuda associada ao grupo. */
  describedBy?: string;
};

/**
 * Seletor de nota: um radio group nativo com cara de estrelas.
 * Tab entra no grupo, setas trocam a nota, Espaço marca; o leitor de tela
 * anuncia "3 de 5 estrelas, Bom". O hover só faz prévia, não seleciona.
 */
export function StarInput({
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  disabled,
  describedBy,
}: StarInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value ?? 0;

  return (
    <fieldset
      aria-describedby={describedBy}
      disabled={disabled}
      className="min-w-0"
    >
      <legend className="mb-2 text-sm font-medium">Sua nota</legend>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {/* biome-ignore lint/a11y/noStaticElementInteractions: só limpa a prévia do hover; o teclado usa os radios. */}
        <div className="-ml-1.5 flex" onMouseLeave={() => setHovered(null)}>
          {STARS.map((star) => {
            const active = star <= shown;
            return (
              <label
                key={star}
                onMouseEnter={() => setHovered(star)}
                className="group/star grid cursor-pointer place-items-center rounded-lg p-1.5 outline-none has-[:disabled]:cursor-not-allowed has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
              >
                <input
                  ref={star === (value ?? 1) ? inputRef : undefined}
                  type="radio"
                  name={name}
                  value={star}
                  checked={value === star}
                  onChange={() => onChange(star)}
                  onBlur={onBlur}
                  aria-label={`${star} de ${SCORE_MAX} estrelas, ${SCORE_LABELS[star]}`}
                  aria-invalid={invalid || undefined}
                  className="sr-only"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  className={cn(
                    "size-8 transition-[color,fill,transform] duration-150 motion-safe:group-hover/star:scale-110 motion-safe:group-active/star:scale-95 sm:size-9",
                    active
                      ? "fill-star stroke-[color-mix(in_oklab,var(--star),black_28%)]"
                      : invalid
                        ? "fill-transparent stroke-destructive/70"
                        : "fill-transparent stroke-muted-foreground/70",
                  )}
                >
                  <path d={STAR_PATH} />
                </svg>
              </label>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "min-w-24 text-sm",
            shown ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {shown ? SCORE_LABELS[shown] : `Escolha de 1 a ${SCORE_MAX}`}
        </span>
      </div>
    </fieldset>
  );
}
