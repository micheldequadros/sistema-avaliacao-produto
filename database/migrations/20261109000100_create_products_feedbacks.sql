-- Feedback: avaliações de produtos (specs/feedback.md)
-- Depende de 20261107000000_create_accounts.sql e 20261109000000_create_products.sql.

create table if not exists public.products_feedbacks (
  id          text        primary key,                                                    -- nanoid gerado na API
  score       int         not null check (score between 1 and 5),
  comment     text        not null,
  created_at  timestamptz not null default now(),
  created_by  text        not null references public.accounts(id) on delete cascade,
  product_id  text        not null references public.products(id) on delete cascade,
  -- Uma avaliação por pessoa por produto: a segunda tentativa vira 409 na API.
  constraint products_feedbacks_product_author_key unique (product_id, created_by)
);

-- Lista da página de detalhes: avaliações do produto, mais recentes primeiro.
create index if not exists products_feedbacks_product_created_idx
  on public.products_feedbacks (product_id, created_at desc);

-- RLS ligado sem policies: só a API (service role) lê/escreve.
alter table public.products_feedbacks enable row level security;
