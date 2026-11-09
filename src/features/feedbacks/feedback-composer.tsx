import "server-only";
import { getCurrentAccount } from "@/server/auth/current-account";
import type { ProductFeedback } from "@/server/products/get-product";
import { FeedbackForm } from "./feedback-form";
import { OwnFeedbackBadge } from "./feedback-list";
import { AlreadyReviewedNotice } from "./feedback-notice";
import { SignInPrompt } from "./sign-in-prompt";

/**
 * Lê a sessão (dado de request): renderize dentro de `<Suspense>`.
 * Deslogado → bloco de login; já avaliou → aviso; senão → formulário.
 */
export async function FeedbackComposer({
  productId,
  feedbacks,
}: {
  productId: string;
  feedbacks: ProductFeedback[];
}) {
  const account = await getCurrentAccount();
  if (!account) return <SignInPrompt productId={productId} />;

  const alreadyReviewed = feedbacks.some((f) => f.author.id === account.id);
  if (alreadyReviewed) return <AlreadyReviewedNotice />;

  return (
    <FeedbackForm
      productId={productId}
      // Só o necessário para o cabeçalho do formulário (sem email).
      author={{
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
      }}
    />
  );
}

/** Selo "Sua avaliação" — só aparece para a autora/o autor logado. */
export async function OwnFeedbackMarker({ authorId }: { authorId: string }) {
  const account = await getCurrentAccount();
  if (account?.id !== authorId) return null;
  return <OwnFeedbackBadge />;
}
