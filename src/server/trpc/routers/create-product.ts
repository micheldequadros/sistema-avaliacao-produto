import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createProductSchema } from "@/features/products/schema";
import { getSupabase } from "@/server/db/supabase";
import { publicProcedure } from "../init";

/** Compara em tempo constante (hash antes, para não vazar o tamanho da chave). */
function safeEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/**
 * Exige o header `x-admin-key` igual a `ADMIN_API_KEY`. Roda antes da
 * validação do input: sem chave a resposta é 401, nunca 400.
 * Sem `ADMIN_API_KEY` configurada, o cadastro fica desligado (sempre 401).
 */
const adminKeyProcedure = publicProcedure.use(({ ctx, next }) => {
  const expected = process.env.ADMIN_API_KEY;
  const received = ctx.headers.get("x-admin-key");

  if (!expected || !received || !safeEqual(received, expected)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Chave de administração ausente ou inválida.",
    });
  }
  return next();
});

/** POST /api/v1/create-product — cadastro manual de produtos. */
export const createProductProcedure = adminKeyProcedure
  .input(createProductSchema)
  .mutation(async ({ input }) => {
    const id = nanoid();

    const { error } = await getSupabase()
      .from("products")
      .insert({
        id,
        name: input.name,
        description: input.description ?? null,
        image_url: input.imageUrl,
        external_link: input.externalLink,
      });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível cadastrar o produto.",
        cause: error,
      });
    }

    return { id };
  });
