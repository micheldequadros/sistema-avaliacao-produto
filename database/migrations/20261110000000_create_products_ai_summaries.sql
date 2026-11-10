-- Resumo por IA das avaliações de cada produto (agente Mastra + gpt-4o-mini).
-- Depende de 20261109000000_create_products.sql.

create table if not exists public.products_ai_summaries (
  product_id       text        primary key references public.products(id) on delete cascade,
  summary          text        not null,                 -- visão geral, 2 a 4 frases
  highlights       text[]      not null default '{}',    -- pontos fortes citados
  concerns         text[]      not null default '{}',    -- pontos de atenção citados
  feedbacks_count  int         not null,                 -- quantas avaliações o resumo cobre
  model            text        not null,                 -- modelo que gerou (ex.: openai/gpt-4o-mini)
  generated_at     timestamptz not null default now()
);

-- RLS ligado sem policies: só a API (service role) lê/escreve.
alter table public.products_ai_summaries enable row level security;
