import { CircleCheck } from "lucide-react";

type FeedbackNoticeProps = {
  title: string;
  description: string;
  /** Anuncia a mudança para leitores de tela (ex.: logo após publicar). */
  live?: boolean;
};

/** Aviso que ocupa o lugar do formulário quando não há o que preencher. */
export function FeedbackNotice({
  title,
  description,
  live,
}: FeedbackNoticeProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className="flex gap-4 rounded-2xl border border-verified/25 bg-verified/5 p-5 sm:p-6"
    >
      <CircleCheck
        className="mt-0.5 size-5 shrink-0 text-verified"
        aria-hidden="true"
      />
      <div className="grid gap-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AlreadyReviewedNotice() {
  return (
    <FeedbackNotice
      title="Você já avaliou este produto"
      description="Sua avaliação está na lista acima, marcada como Sua avaliação."
    />
  );
}
