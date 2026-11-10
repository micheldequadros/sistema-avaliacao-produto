# Banco de dados

Migrations SQL versionadas em `migrations/`, aplicadas em ordem pelo nome (prefixo `YYYYMMDDHHMMSS`).

| Migration | Tabela |
|---|---|
| `20261107000000_create_accounts.sql` | `accounts` (sign-up/sign-in) e a função `set_updated_at()` |
| `20261109000000_create_products.sql` | `products` (home) |
| `20261109000100_create_products_feedbacks.sql` | `products_feedbacks` (avaliações; depende das duas anteriores) |
| `20261110000000_create_products_ai_summaries.sql` | `products_ai_summaries` (resumo por IA das avaliações de cada produto) |

## Como aplicar

No painel do Supabase, abra **SQL Editor** e execute cada arquivo de `migrations/` ainda não aplicado, em ordem.

## Dados de teste

`seed-products.sql` insere 30 produtos para testar a home. Rode depois da migration de `products`, só em desenvolvimento.
