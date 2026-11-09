import "server-only";
import { getSupabase } from "@/server/db/supabase";

export type PlatformStats = {
  products: number;
  feedbacks: number;
  accounts: number;
};

type CountedTable = "products" | "products_feedbacks" | "accounts";

async function countRows(table: CountedTable): Promise<number> {
  // head + count: o Postgres só conta, nenhuma linha trafega.
  const { count, error } = await getSupabase()
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

/** Números reais da plataforma, exibidos no hero da home. */
export async function getPlatformStats(): Promise<PlatformStats> {
  const [products, feedbacks, accounts] = await Promise.all([
    countRows("products"),
    countRows("products_feedbacks"),
    countRows("accounts"),
  ]);
  return { products, feedbacks, accounts };
}
