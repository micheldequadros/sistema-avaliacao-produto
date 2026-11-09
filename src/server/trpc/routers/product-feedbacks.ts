import "server-only";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createFeedbackSchema } from "@/features/feedbacks/schema";
import { getSupabase } from "@/server/db/supabase";
import { protectedProcedure } from "../init";

const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";
const AUTHOR_FKEY = "products_feedbacks_created_by_fkey";

/** Cria a avaliação da pessoa logada. Uma por pessoa por produto. */
export const productFeedbacksProcedure = protectedProcedure
  .input(createFeedbackSchema)
  .mutation(async ({ ctx, input }) => {
    const id = nanoid();

    const { error } = await getSupabase().from("products_feedbacks").insert({
      id,
      score: input.score,
      comment: input.comment,
      product_id: input.productId,
      created_by: ctx.session.accountId,
    });

    if (error) {
      if (error.code === FOREIGN_KEY_VIOLATION) {
        // A FK do autor só falha se a conta da sessão não existe mais.
        if (`${error.message} ${error.details}`.includes(AUTHOR_FKEY)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Você precisa estar logado.",
          });
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produto não encontrado.",
        });
      }
      // A constraint UNIQUE(product_id, created_by) é a fonte da verdade.
      if (error.code === UNIQUE_VIOLATION) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Você já avaliou este produto.",
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível publicar a avaliação.",
        cause: error,
      });
    }

    return { id };
  });
