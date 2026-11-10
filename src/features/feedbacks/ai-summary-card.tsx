import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleAlert, CircleCheck, Sparkles } from "lucide-react";
import type { ProductAiSummary } from "@/server/products/ai-summary";

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

/** Resumo das avaliações gerado por IA, destacado entre o produto e a lista. */
export function AiSummaryCard({ summary }: { summary: ProductAiSummary }) {
  const generatedAt = new Date(summary.generatedAt);
  const hasLists = summary.highlights.length > 0 || summary.concerns.length > 0;

  return (
    <section
      aria-labelledby="resumo-ia-titulo"
      // Borda em degradê: o fundo do wrapper aparece pelo padding de 1px.
      className="relative rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--lavender)_50%,color-mix(in_oklab,var(--primary)_35%,transparent))] p-px shadow-[0_18px_40px_-24px_var(--primary)]"
    >
      <div className="relative overflow-hidden rounded-[calc(var(--radius-2xl)-1px)] bg-card px-5 py-6 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--lavender)_35%,transparent),transparent)]"
        />

        <header className="relative flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--primary),color-mix(in_oklab,var(--primary)_60%,var(--lavender)))] text-primary-foreground shadow-sm"
          >
            <Sparkles className="size-4.5" />
          </span>
          <h2
            id="resumo-ia-titulo"
            className="text-lg font-semibold tracking-tight [font-stretch:92%]"
          >
            O que dizem as avaliações
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" aria-hidden="true" />
            Resumo por IA
          </span>
        </header>

        <p className="relative mt-4 text-[1.05rem] leading-relaxed text-pretty">
          {summary.summary}
        </p>

        {hasLists && (
          <div className="relative mt-6 grid gap-5 sm:grid-cols-2 sm:gap-8">
            {summary.highlights.length > 0 && (
              <PointList
                title="Pontos fortes"
                items={summary.highlights}
                icon={
                  <CircleCheck
                    className="mt-0.5 size-4 shrink-0 text-verified"
                    aria-hidden="true"
                  />
                }
              />
            )}
            {summary.concerns.length > 0 && (
              <PointList
                title="Pontos de atenção"
                items={summary.concerns}
                icon={
                  <CircleAlert
                    className="mt-0.5 size-4 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                }
              />
            )}
          </div>
        )}

        <footer className="relative mt-6 border-t pt-4 text-xs text-muted-foreground">
          Gerado por IA a partir de{" "}
          {summary.feedbacksCount.toLocaleString("pt-BR")} avaliações ·
          atualizado{" "}
          <time
            dateTime={summary.generatedAt}
            title={fullDate.format(generatedAt)}
          >
            {formatDistanceToNow(generatedAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          </time>
          . Pode conter imprecisões; leia as avaliações abaixo.
        </footer>
      </div>
    </section>
  );
}

function PointList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2.5">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-snug">
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
