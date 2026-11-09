# Plano: Feedback (avaliações de produtos)

Spec: [specs/feedback.md](../specs/feedback.md). Contratos compartilhados: [00-orquestracao.md](00-orquestracao.md).

## Objetivo
A página `/products/[id]` mostra o produto, todas as avaliações dele e, no fim, o formulário de nova avaliação (nota de 1 a 5 + comentário). Qualquer pessoa vê a página; só quem está logado avalia. Deslogado, o lugar do formulário mostra um bloco pedindo login.

## Depende de
- **sign-in:** `getCurrentAccount()`, `protectedProcedure` e `?next=` no sign-in. Durante a Fase 1 os stubs retornam `null`, então o agente desenvolve o estado logado pelo contrato e o teste real acontece na integração.
- **home:** a tabela `products` (FK) e o link do card para `/products/{id}`.

## Decisões (⚠️ precisam da sua aprovação)
1. ⚠️ **Rota:** procedure `product-feedbacks` (mutation), ou seja `POST /api/v1/product-feedbacks`. A spec só pede "um endpoint novo para adicionar comentários".
2. **A listagem não tem endpoint:** a página é Server Component e lê produto e avaliações direto no servidor. É mais rápido (sem ida e volta extra) e a spec não pede GET. Depois de enviar, `router.refresh()` recarrega a lista.
3. ⚠️ **Várias avaliações por pessoa por produto** são permitidas (a spec não restringe). Se preferir uma por pessoa, entra `unique (product_id, created_by)` e o endpoint responde **409**.
4. **Comentário obrigatório**, de 3 a 2000 caracteres. A nota é um inteiro de 1 a 5, com `check` no banco.
5. **O autor aparece com nome + sobrenome e avatar DiceBear** (`avatarUrl(created_by)`), via join com `accounts`. O email nunca é exposto.
6. **A nota média e o total aparecem no topo do produto**, calculados a partir das avaliações já carregadas (sem consulta extra).

## Banco
`database/migrations/20261109000100_create_products_feedbacks.sql` (roda depois da migration de `products`):
```sql
create table public.products_feedbacks (
  id          text        primary key,                                        -- nanoid
  score       int         not null check (score between 1 and 5),
  comment     text        not null,
  created_at  timestamptz not null default now(),
  created_by  text        not null references public.accounts(id) on delete cascade,
  product_id  text        not null references public.products(id) on delete cascade
);
create index products_feedbacks_product_created_idx
  on public.products_feedbacks (product_id, created_at desc);
-- RLS ligado sem policies, igual às outras tabelas
```

## API
- `src/features/feedbacks/schema.ts`: `createFeedbackSchema = { productId: string, score: int 1..5, comment: string trim 3..2000 }`.
- **`product-feedbacks`** (`protectedProcedure`, mutation):
  - sem sessão: **401**
  - dados inválidos: **400**
  - insere com `id = nanoid()` e `created_by = ctx.session.accountId`
  - FK violada (código `23503`, produto inexistente): **404**
  - sucesso: **200** `{ id }`
- `src/server/products/get-product.ts` (server-only): `getProduct(id)` e `getProductFeedbacks(productId)`. As avaliações vêm em ordem decrescente de data, com join `accounts(first_name, last_name)`.

## Front-end
- **`src/app/(platform)/products/[id]/page.tsx`**: `params` é uma Promise (Next 16). Os dados ficam dentro de `<Suspense>` com skeleton (`cacheComponents`). Produto inexistente chama `notFound()`. `generateMetadata` usa o nome do produto.
  1. **Produto:** imagem, nome, descrição, link externo "Ver produto ↗", média (estrelas `#FFC53D`) + "N avaliações", e um link "← Produtos" de volta para a home.
  2. **Avaliações:** lista com avatar, nome, estrelas, data relativa (`date-fns` com locale `ptBR`, ex.: "há 2 dias") e o comentário. Estado vazio: "Nenhuma avaliação ainda. Seja o primeiro a avaliar."
  3. **Nova avaliação** (num `<Suspense>` próprio, porque lê a sessão):
     - **Deslogado:** um bloco com borda em violeta, "Entre para avaliar este produto", botão "Entrar" (`/auth/sign-in?next=/products/{id}`) e link "Criar conta".
     - **Logado:** formulário client (`feedback-form.tsx`). React Hook Form + zod, **seletor de 5 estrelas acessível** (radio group nativo estilizado, com teclado por setas, foco visível e rótulos do tipo "3 de 5 estrelas", e prévia no hover), `textarea` com contador de caracteres, e botão "Publicar avaliação" com estado "Publicando...". Erro da API: `Alert` vermelho. Sucesso: limpa o formulário, `router.refresh()` e um aviso discreto de sucesso.
- Componentes em `src/features/feedbacks/`: `star-rating.tsx` (exibição), `star-input.tsx` (seletor), `feedback-list.tsx`, `feedback-form.tsx`, `sign-in-prompt.tsx`.

## Arquivos
Cria: a migration acima, `src/features/feedbacks/*`, `src/server/products/get-product.ts`, `src/server/trpc/routers/product-feedbacks.ts` (substitui o stub), `src/app/(platform)/products/[id]/page.tsx` (+ `loading`/`not-found` se fizer sentido).
Não toca: `db/types.ts`, `init.ts` e `_app.ts` (Fase 0), nem `site-header.tsx` (sign-in).

## Fora do escopo
Editar e excluir avaliações, respostas a avaliações, paginação de avaliações, moderação, resumos com IA.

## Verificação
- `npx tsc --noEmit` e `npx biome check` nos arquivos da feature.
- Na integração:
  - deslogado: a página mostra produto, avaliações e o bloco de login, que volta para o produto depois do login
  - logado: enviar uma avaliação faz ela aparecer no topo da lista e atualiza a média
  - `POST` sem cookie retorna 401; nota 0 ou 6 retorna 400; `productId` inexistente retorna 404; `/products/xyz` inexistente mostra a página 404
