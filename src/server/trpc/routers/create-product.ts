import "server-only";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createProductSchema } from "@/features/products/schema";
import { getSupabase } from "@/server/db/supabase";
import { publicProcedure } from "../init";

/**
 * POST /api/v1/create-product — cadastro de produtos, público (sem autenticação).
 * Body JSON: { name, link, image, description? }
 *   name → name, link → external_link, image → image_url
 */
export const createProductProcedure = publicProcedure
  .input(createProductSchema)
  .mutation(async ({ input }) => {
    const id = nanoid();

    const { error } = await getSupabase()
      .from("products")
      .insert({
        id,
        name: input.name,
        description: input.description ?? null,
        image_url: input.image,
        external_link: input.link,
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
