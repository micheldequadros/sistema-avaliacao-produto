import "server-only";
import { TRPCError } from "@trpc/server";
import {
  listProductsInput,
  type Product,
  type ProductsPage,
} from "@/features/products/schema";
import { getSupabase } from "@/server/db/supabase";
import type { Database } from "@/server/db/types";
import { publicProcedure } from "../init";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type Cursor = { createdAt: string; id: string };

const COLUMNS = "id, name, description, image_url, external_link, created_at";
// Formato do timestamptz que o PostgREST devolve (ex.: 2026-11-09T12:00:00.123456+00:00).
const TIMESTAMP_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Cursor opaco: base64url de `created_at|id` da última linha da página. */
function encodeCursor({ createdAt, id }: Cursor): string {
  return Buffer.from(`${createdAt}|${id}`, "utf8").toString("base64url");
}

function decodeCursor(cursor: string): Cursor | null {
  const [createdAt, id, ...rest] = Buffer.from(cursor, "base64url")
    .toString("utf8")
    .split("|");
  if (rest.length > 0 || !createdAt || !id) return null;
  // As regexes também garantem que os valores são seguros dentro do filtro `or` abaixo.
  if (!TIMESTAMP_RE.test(createdAt) || !ID_RE.test(id)) return null;
  return { createdAt, id };
}

function toProduct(row: Omit<ProductRow, "updated_at">): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    externalLink: row.external_link,
    createdAt: row.created_at,
  };
}

/**
 * GET /api/v1/products — listagem pública, mais novos primeiro.
 * Paginação por cursor (keyset em `created_at desc, id desc`): estável enquanto
 * novos produtos entram e servida pelo índice `products_created_at_id_idx`.
 */
export const productsProcedure = publicProcedure
  .input(listProductsInput)
  .query(async ({ input }): Promise<ProductsPage> => {
    const cursor = input.cursor ? decodeCursor(input.cursor) : null;
    if (input.cursor && !cursor) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Cursor inválido." });
    }

    let query = getSupabase()
      .from("products")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      // Uma linha a mais só para saber se existe próxima página.
      .limit(input.limit + 1);

    if (cursor) {
      const at = `"${cursor.createdAt}"`;
      const id = `"${cursor.id}"`;
      query = query.or(
        `created_at.lt.${at},and(created_at.eq.${at},id.lt.${id})`,
      );
    }

    const { data, error } = await query;
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível listar os produtos.",
        cause: error,
      });
    }

    const hasMore = data.length > input.limit;
    const rows = hasMore ? data.slice(0, input.limit) : data;
    const last = rows.at(-1);

    return {
      items: rows.map(toProduct),
      nextCursor:
        hasMore && last
          ? encodeCursor({ createdAt: last.created_at, id: last.id })
          : null,
    };
  });
