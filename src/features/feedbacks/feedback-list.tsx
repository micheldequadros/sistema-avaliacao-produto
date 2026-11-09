import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/avatar";
import type { ProductFeedback } from "@/server/products/get-product";
import { StarRating } from "./star-rating";

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

type FeedbackListProps = {
  feedbacks: ProductFeedback[];
  /** Conteúdo extra ao lado do nome (ex.: selo "Sua avaliação"). */
  renderBadge?: (authorId: string) => ReactNode;
};

export function FeedbackList({ feedbacks, renderBadge }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-input px-6 py-12 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
          <MessageSquareText className="size-5" aria-hidden="true" />
        </span>
        <p className="max-w-[36ch] text-muted-foreground">
          Nenhuma avaliação ainda. Seja o primeiro a avaliar.
        </p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-border">
      {feedbacks.map((feedback) => (
        <FeedbackItem
          key={feedback.id}
          feedback={feedback}
          badge={renderBadge?.(feedback.author.id)}
        />
      ))}
    </ol>
  );
}

function FeedbackItem({
  feedback,
  badge,
}: {
  feedback: ProductFeedback;
  badge?: ReactNode;
}) {
  const { firstName, lastName, id: authorId } = feedback.author;
  const name = `${firstName} ${lastName}`.trim() || "Pessoa usuária";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const createdAt = new Date(feedback.createdAt);

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 py-6 first:pt-0 last:pb-0">
      <Avatar size="lg" className="mt-0.5">
        <AvatarImage src={avatarUrl(authorId)} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <article className="grid gap-1.5">
        <header className="grid gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-semibold">{name}</h3>
            {badge}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <StarRating value={feedback.score} />
            <time
              dateTime={feedback.createdAt}
              title={fullDate.format(createdAt)}
            >
              {formatDistanceToNow(createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </time>
          </div>
        </header>
        <p className="mt-1.5 max-w-[68ch] leading-relaxed text-pretty break-words whitespace-pre-line">
          {feedback.comment}
        </p>
      </article>
    </li>
  );
}

/** Selo exibido na avaliação da própria pessoa logada. */
export function OwnFeedbackBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      Sua avaliação
    </span>
  );
}
