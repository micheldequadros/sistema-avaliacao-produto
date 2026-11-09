-- Home: tabela de produtos (specs/home.md, plans/home.md)
-- Sem a coluna `score` da spec: a nota vem das avaliações (products_feedbacks.score).
-- Com `image_url` (fora da spec): o cadastro recebe a URL https da imagem do card.

create table if not exists public.products (
  id             text        primary key,           -- nanoid gerado na API
  name           text        not null,
  description    text,                              -- opcional
  image_url      text        not null,              -- URL https da imagem
  external_link  text        not null,              -- página do produto fora do app
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Paginação por cursor da home: order by created_at desc, id desc.
create index if not exists products_created_at_id_idx
  on public.products (created_at desc, id desc);

-- Reusa public.set_updated_at() (criada na migration de accounts).
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- RLS ligado sem policies: somente a API (service role) lê/escreve.
alter table public.products enable row level security;
