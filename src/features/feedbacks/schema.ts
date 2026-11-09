import { z } from "zod";

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;
export const COMMENT_MIN = 3;
export const COMMENT_MAX = 2000;

const SCORE_ERROR = `Escolha uma nota de ${SCORE_MIN} a ${SCORE_MAX}`;

/** Campos que a pessoa preenche (formulário). */
export const feedbackFieldsSchema = z.object({
  score: z
    .number({ error: SCORE_ERROR })
    .int(SCORE_ERROR)
    .min(SCORE_MIN, SCORE_ERROR)
    .max(SCORE_MAX, SCORE_ERROR),
  comment: z
    .string()
    .trim()
    .min(COMMENT_MIN, `Escreva pelo menos ${COMMENT_MIN} caracteres`)
    .max(COMMENT_MAX, `Máximo de ${COMMENT_MAX} caracteres`),
});

/** Corpo de `POST /api/v1/product-feedbacks` (compartilhado com a procedure). */
export const createFeedbackSchema = feedbackFieldsSchema.extend({
  productId: z.string().trim().min(1).max(64),
});

export type FeedbackFieldsInput = z.input<typeof feedbackFieldsSchema>;
export type FeedbackFieldsData = z.output<typeof feedbackFieldsSchema>;
export type CreateFeedbackData = z.output<typeof createFeedbackSchema>;
