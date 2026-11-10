import "server-only";
import { after } from "next/server";
import { cache } from "react";
import {
  PRODUCT_SUMMARY_MODEL,
  summarizeFeedbacks,
} from "@/server/ai/product-summary-agent";
import { getSupabase } from "@/server/db/supabase";

/** Com menos avaliações o "resumo" só repetiria o comentário. */
export const MIN_FEEDBACKS_FOR_SUMMARY = 3;
/** Teto de avaliações enviadas ao modelo (as mais recentes): limita custo. */
const MAX_FEEDBACKS_IN_PROMPT = 100;

export type ProductAiSummary = {
  summary: string;
  highlights: string[];
  concerns: string[];
  feedbacksCount: number;
  generatedAt: string;
};

/** Resumo salvo do produto, ou `null`. Deduplicado por request. */
export const getProductAiSummary = cache(
  async (productId: string): Promise<ProductAiSummary | null> => {
    const { data, error } = await getSupabase()
      .from("products_ai_summaries")
      .select("summary, highlights, concerns, feedbacks_count, generated_at")
      .eq("product_id", productId)
      .maybeSingle();

    if (error) {
      // O resumo é complementar: sem ele a página continua funcionando.
      console.error("[ai-summary] leitura:", error);
      return null;
    }
    if (!data) return null;

    return {
      summary: data.summary,
      highlights: data.highlights,
      concerns: data.concerns,
      feedbacksCount: data.feedbacks_count,
      generatedAt: data.generated_at,
    };
  },
);

// Evita gerar duas vezes o mesmo produto ao mesmo tempo (no mesmo processo).
const inFlight = new Set<string>();
// Após uma falha, espera antes de tentar de novo (cada visita agenda uma tentativa).
const RETRY_AFTER_FAILURE_MS = 5 * 60 * 1000;
const lastFailureAt = new Map<string, number>();

/** Gera o resumo com base nas avaliações atuais. Nunca lança. */
async function refreshProductAiSummary(
  productId: string,
  { force = false } = {},
): Promise<void> {
  if (inFlight.has(productId)) return;
  const failedAt = lastFailureAt.get(productId);
  if (!force && failedAt && Date.now() - failedAt < RETRY_AFTER_FAILURE_MS) {
    return;
  }
  inFlight.add(productId);

  try {
    const supabase = getSupabase();
    const [{ data: product }, { data: feedbacks, count }] = await Promise.all([
      supabase
        .from("products")
        .select("name")
        .eq("id", productId)
        .maybeSingle(),
      supabase
        .from("products_feedbacks")
        .select("score, comment", { count: "exact" })
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(MAX_FEEDBACKS_IN_PROMPT),
    ]);
    if (!product || !feedbacks) return;

    const total = count ?? feedbacks.length;
    if (total < MIN_FEEDBACKS_FOR_SUMMARY) return;

    const result = await summarizeFeedbacks({
      productName: product.name,
      feedbacks,
    });

    const { error } = await supabase.from("products_ai_summaries").upsert({
      product_id: productId,
      summary: result.summary,
      highlights: result.highlights,
      concerns: result.concerns,
      feedbacks_count: total,
      model: PRODUCT_SUMMARY_MODEL,
      generated_at: new Date().toISOString(),
    });
    if (error) throw error;
    lastFailureAt.delete(productId);
  } catch (error) {
    // Falha da IA (sem créditos, timeout...) não afeta quem está usando o app;
    // o último resumo salvo continua aparecendo.
    lastFailureAt.set(productId, Date.now());
    console.error(`[ai-summary] produto ${productId}:`, error);
  } finally {
    inFlight.delete(productId);
  }
}

/**
 * Agenda a geração para depois da resposta (não bloqueia a página nem a API).
 * `force`: ignora a espera após falha (uso: avaliação nova acabou de chegar).
 */
export function scheduleProductAiSummary(
  productId: string,
  options?: { force?: boolean },
): void {
  after(() => refreshProductAiSummary(productId, options));
}

/** O resumo precisa ser (re)gerado para refletir `feedbacksCount` avaliações? */
export function isSummaryStale(
  summary: ProductAiSummary | null,
  feedbacksCount: number,
): boolean {
  if (feedbacksCount < MIN_FEEDBACKS_FOR_SUMMARY) return false;
  return !summary || summary.feedbacksCount !== feedbacksCount;
}
