# Plano: Home (listagem de produtos)

Spec: [specs/home.md](../specs/home.md). Contratos compartilhados: [00-orquestracao.md](00-orquestracao.md).

## Objetivo
A home (`/`) lista publicamente todos os produtos, com scroll infinito. Cada card mostra imagem, nome e descrição curta. Clicar no nome leva para `/products/[id]`, página construída pelo plano de feedback. Também há um endpoint para cadastrar produtos manualmente.

## Decisões (aprovadas)
1. **Coluna `score: boolean`:** um "score" booleano num produto não tem significado claro, e a nota real vem das avaliações (`products_feedbacks.score`, de 1 a 5). **Decidido: a coluna não é criada.** A média do produto é calculada a partir dos feedbacks.
2. **Coluna `image_url text`** (não está na spec): o `POST` recebe "imagem" e o card mostra imagem, então precisamos onde guardá-la. Recebemos uma **URL https** da imagem em vez de upload de arquivo. Upload para o Supabase Storage pode vir numa spec própria.
3. **Rotas:** o tRPC não deixa uma mesma chave ser GET e POST, então:
   - `GET /api/v1/products`: procedure `products` (query). Atende a spec.
   - `POST /api/v1/create-product`: procedure `create-product` (mutation). A spec diz `POST /products`; esta é a adaptação.
4. **Proteção do cadastro manual** (substituída depois: a pedido, o endpoint ficou público, com campos `name`, `link` e `image`): sem tela de admin, o endpoint ficaria aberto para qualquer pessoa. Proposta: exigir o header `x-admin-key` igual a `ADMIN_API_KEY`. Sem o header ou com valor errado: **401**.
5. **Paginação por cursor** (`created_at desc, id desc`), não por offset: é estável enquanto produtos novos entram e rápida com índice. O cursor é opaco (base64 de `created_at|id`).
6. **Imagem com `<img>`** (`loading="lazy"`, `aspect-ratio` fixo, fallback visual se falhar), porque as URLs podem vir de qualquer host e `next/image` exigiria liberar `remotePatterns` para tudo.

## Banco
`database/migrations/20261109000000_create_products.sql`:
```sql
create table public.products (
  id            text        primary key,          -- nanoid gerado na API
  name          text        not null,
  description   text,
  image_url     text        not null,
  external_link text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index products_created_at_id_idx on public.products (created_at desc, id desc);
-- trigger set_updated_at (reusa public.set_updated_at da migration de accounts)
-- RLS ligado sem policies (somente a service role acessa), igual a accounts
```

## API
- `src/features/products/schema.ts`:
  - `listProductsInput`: `{ cursor?: string | null, limit: 1..50 (default 12) }`
  - `createProductSchema`: `name` (1–120), `description` (opcional, até 500), `imageUrl` (URL https), `externalLink` (URL http/https)
- **`products`** (query, pública): busca `limit + 1` linhas a partir do cursor e retorna `{ items: Product[], nextCursor: string | null }`. Sem produtos: **200** com `items: []`. Cursor inválido: **400**. Campos em camelCase na resposta.
- **`create-product`** (mutation): checa `x-admin-key` em `ctx.headers` (**401**), valida (**400**), gera o id com `nanoid()`, insere e retorna **200** `{ id }`.
- Exemplo para o README:
  ```bash
  curl -X POST localhost:3000/api/v1/create-product \
    -H "content-type: application/json" -H "x-admin-key: $ADMIN_API_KEY" \
    -d '{"name":"...","imageUrl":"https://...","externalLink":"https://..."}'
  ```

## Front-end
- **`src/app/(platform)/page.tsx`** (substitui o stub da Fase 0): cabeçalho da página ("Produtos" + uma linha de apoio voltada a times de produto) e a grade de produtos dentro de `<Suspense>` com skeleton.
- **`src/features/products/product-grid.tsx`** (client): `useInfiniteQuery(trpc.products.infiniteQueryOptions(...))` + `IntersectionObserver` num sentinela no fim da lista (`rootMargin` ~600px, para carregar antes de chegar ao fim). Estados:
  - carregando: grade de `skeleton` com o mesmo formato dos cards (sem pulo de layout)
  - vazio: mensagem amigável e um exemplo de como cadastrar
  - erro: alerta com "Tentar de novo"
  - carregando mais: skeletons no fim
  - fim da lista: indicador discreto
- **`src/features/products/product-card.tsx`**: imagem (4:3), nome como `<Link href="/products/{id}">` (com a área clicável estendida ao card), descrição com `line-clamp-2` e link externo "Ver produto ↗" (`target="_blank" rel="noopener noreferrer"`).
- Grade responsiva: 1 coluna no mobile, 2 em `sm`, 3 em `lg`. Direção visual v3 (papel, violeta), cards brancos com borda suave e hover sutil.

## Arquivos
Cria: a migration acima, `src/features/products/schema.ts`, `product-grid.tsx`, `product-card.tsx`, `src/server/trpc/routers/products.ts` e `create-product.ts` (substituem os stubs). Substitui: `src/app/(platform)/page.tsx`.
Não toca: `db/types.ts` e `next.config.ts` (a Fase 0 já faz o necessário), nem `src/server/products/get-product.ts` (é do feedback).

## Fora do escopo
Página de detalhes (plano de feedback), busca/filtros, edição e remoção de produtos, upload de arquivo, média de notas no card (pode entrar depois, quando houver feedbacks).

## Verificação
- `npx tsc --noEmit` e `npx biome check` nos arquivos da feature.
- Na integração: `GET /api/v1/products` vazio retorna 200 com `[]`; cadastrar 30 produtos e rolar a home (páginas de 12 sem duplicar nem pular itens); `create-product` sem chave retorna 401 e com payload inválido retorna 400; clicar no nome leva para `/products/{id}`.
