import "server-only";
import { cache } from "react";
import { getSupabase } from "@/server/db/supabase";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
};

export type ProductFeedback = {
  id: string;
  score: number;
  comment: string;
  createdAt: string;
  /** Só nome e sobrenome: o email do autor nunca sai do servidor. */
  author: { id: string; firstName: string; lastName: string };
};

/** ids são nanoid (21 chars); qualquer coisa muito maior nem vai ao banco. */
const MAX_ID_LENGTH = 64;

/** Produto pelo id, ou `null`. Deduplicado por request (metadata + página). */
export const getProduct = cache(async (id: string): Promise<Product | null> => {
  if (!id || id.length > MAX_ID_LENGTH) return null;

  const { data, error } = await getSupabase()
    .from("products")
    .select("id, name, description, image_url, external_link")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Falha ao carregar o produto.", { cause: error });
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.image_url,
    externalLink: data.external_link,
  };
});

/** Avaliações do produto, mais recentes primeiro, com nome do autor. */
export const getProductFeedbacks = cache(
  async (productId: string): Promise<ProductFeedback[]> => {
    const { data, error } = await getSupabase()
      .from("products_feedbacks")
      .select(
        "id, score, comment, created_at, created_by, author:accounts(first_name, last_name)",
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Falha ao carregar as avaliações.", { cause: error });
    }

    return data.map((row) => ({
      id: row.id,
      score: row.score,
      comment: row.comment,
      createdAt: row.created_at,
      author: {
        id: row.created_by,
        firstName: row.author?.first_name ?? "",
        lastName: row.author?.last_name ?? "",
      },
    }));
  },
);
