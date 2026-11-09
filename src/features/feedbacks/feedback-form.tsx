"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { avatarUrl } from "@/lib/avatar";
import { useTRPC } from "@/lib/trpc/client";
import { FeedbackNotice } from "./feedback-notice";
import {
  COMMENT_MAX,
  COMMENT_MIN,
  type FeedbackFieldsData,
  type FeedbackFieldsInput,
  feedbackFieldsSchema,
} from "./schema";
import { StarInput } from "./star-input";

const FIELDS = ["score", "comment"] as const;

const API_ERRORS: Record<number, string> = {
  400: "Revise a nota e o comentário.",
  401: "Sua sessão expirou. Entre de novo para publicar a avaliação.",
  404: "Este produto não está mais disponível para avaliação.",
  409: "Você já avaliou este produto.",
};
const FALLBACK_ERROR =
  "Não conseguimos publicar a avaliação agora. Tente de novo em alguns minutos.";

type FeedbackFormProps = {
  productId: string;
  author: { id: string; firstName: string; lastName: string };
};

export function FeedbackForm({ productId, author }: FeedbackFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const id = useId();
  const scoreMessageId = `${id}-score`;
  const commentId = `${id}-comment`;
  const commentMessageId = `${id}-comment-message`;
  const counterId = `${id}-comment-count`;
  const [published, setPublished] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FeedbackFieldsInput, unknown, FeedbackFieldsData>({
    resolver: zodResolver(feedbackFieldsSchema),
    mode: "onTouched",
    defaultValues: { comment: "" },
  });

  const comment = useWatch({ control, name: "comment" }) ?? "";

  const publish = useMutation(
    trpc["product-feedbacks"].mutationOptions({
      onSuccess: () => {
        reset();
        setPublished(true);
        // Recarrega os Server Components: a avaliação entra na lista e a média
        // é recalculada; este formulário dá lugar ao aviso "Você já avaliou".
        router.refresh();
      },
      onError: (error) => {
        const status = error.data?.httpStatus;
        // 409/401: o estado no servidor mudou; a página se ajusta sozinha.
        if (status === 409 || status === 401) {
          router.refresh();
          return;
        }
        const fieldErrors = error.data?.fieldErrors;
        if (fieldErrors) {
          for (const field of FIELDS) {
            const message = fieldErrors[field]?.[0];
            if (message) setError(field, { message });
          }
        }
      },
    }),
  );

  if (published) {
    return (
      <FeedbackNotice
        live
        title="Avaliação publicada"
        description="Obrigado por contar sua experiência. Ela já aparece na lista acima."
      />
    );
  }

  const apiError = publish.error
    ? (API_ERRORS[publish.error.data?.httpStatus ?? 0] ?? FALLBACK_ERROR)
    : null;

  const onSubmit = handleSubmit((data) =>
    publish.mutate({ productId, ...data }),
  );

  const authorName = `${author.firstName} ${author.lastName}`.trim();
  const overLimit = comment.length >= COMMENT_MAX;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-6 rounded-2xl border bg-card p-5 shadow-[0_1px_0_rgb(28_24_51/0.04),0_12px_32px_-20px_rgb(90_67_220/0.35)] sm:p-7"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl(author.id)} alt="" />
          <AvatarFallback>
            {`${author.firstName.charAt(0)}${author.lastName.charAt(0)}`}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          Publicando como{" "}
          <span className="font-medium text-foreground">{authorName}</span>
        </p>
      </div>

      {apiError && (
        <Alert
          variant="destructive"
          role="alert"
          className="border-destructive/30 bg-destructive/5 px-3 py-2.5"
        >
          <CircleAlert aria-hidden />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-1">
        <Controller
          control={control}
          name="score"
          render={({ field, fieldState }) => (
            <StarInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              invalid={fieldState.invalid}
              disabled={publish.isPending}
              describedBy={fieldState.error ? scoreMessageId : undefined}
            />
          )}
        />
        {errors.score?.message && (
          <p id={scoreMessageId} className="text-sm text-destructive">
            {errors.score.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={commentId}>Seu comentário</Label>
        <Textarea
          id={commentId}
          rows={5}
          maxLength={COMMENT_MAX}
          placeholder="O que você achou? Conte o que funcionou bem e o que poderia melhorar."
          disabled={publish.isPending}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={`${commentMessageId} ${counterId}`}
          className="min-h-32 resize-y bg-card px-3 py-2.5 text-base leading-relaxed md:text-base"
          {...register("comment")}
        />
        <div className="flex items-start justify-between gap-4 text-sm">
          <p
            id={commentMessageId}
            className={
              errors.comment ? "text-destructive" : "text-muted-foreground"
            }
          >
            {errors.comment?.message ?? `Mínimo de ${COMMENT_MIN} caracteres.`}
          </p>
          <p
            id={counterId}
            className={cn(
              "shrink-0 tabular-nums",
              overLimit ? "text-destructive" : "text-muted-foreground",
            )}
          >
            <span className="sr-only">Caracteres usados: </span>
            {comment.length.toLocaleString("pt-BR")}/
            {COMMENT_MAX.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={publish.isPending}
          className="h-12 w-full rounded-lg px-6 text-base font-semibold sm:w-auto"
        >
          {publish.isPending && (
            <Loader2 className="animate-spin" aria-hidden />
          )}
          {publish.isPending ? "Publicando..." : "Publicar avaliação"}
        </Button>
      </div>
    </form>
  );
}
