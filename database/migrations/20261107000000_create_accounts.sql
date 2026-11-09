-- Sign-up: tabela de contas (specs/sign-up.md)

create table if not exists public.accounts (
  id          text        primary key,               -- nanoid gerado na API
  first_name  text        not null,
  last_name   text        not null,
  email       text        not null,
  password    text        not null,                  -- hash bcrypt
  salt        text        not null,                  -- salt bcrypt (redundante com o hash; fins didáticos)
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint accounts_email_key unique (email)       -- email duplicado => 409 na API
);

-- Mantém updated_at atualizado em qualquer UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists accounts_set_updated_at on public.accounts;
create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- RLS ligado sem policies: a tabela fica inacessível pelas chaves anon/publishable.
-- Somente a API (service role) lê/escreve.
alter table public.accounts enable row level security;
