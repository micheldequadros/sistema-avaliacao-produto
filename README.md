# Sistema de Avaliação de Produtos

Next.js (front-end + API tRPC) com Supabase. Arquitetura em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e funcionalidades em [specs/](specs/).

## Setup

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e preencha:
   - `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: dados do seu projeto Supabase.
   - `SESSION_SECRET`: 32+ caracteres aleatórios. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
   - `OPENAI_API_KEY`: usada pelo agente Mastra que resume as avaliações (`openai/gpt-4o-mini`). Sem ela (ou sem créditos), o resumo apenas não aparece.
3. Aplique as migrations de [database/migrations](database/migrations) (veja [database/README.md](database/README.md)). Opcional: rode [database/seed-products.sql](database/seed-products.sql) para ter 30 produtos de teste.
4. Rode: `npm run dev` e acesse http://localhost:3000

## Páginas

- `/`: produtos, públicos, com scroll infinito
- `/products/[id]`: detalhes, resumo por IA das avaliações (a partir de 3), avaliações e formulário de nova avaliação (só para quem está logado)
- `/auth/sign-up` e `/auth/sign-in`: criação de conta e login (aceita `?next=/caminho`)

## Resumo por IA

Agente Mastra em `src/server/ai/product-summary-agent.ts` (modelo `openai/gpt-4o-mini`). O resumo fica salvo em `products_ai_summaries` e é regenerado em segundo plano (`after()`) quando chega uma avaliação nova, ou quando a página do produto nota que ele está desatualizado. A página nunca espera a IA: mostra o último resumo salvo, ou nada.

## API (`/api/v1`, tRPC)

| Método | Rota | Acesso | Respostas |
|---|---|---|---|
| POST | `/sign-up` | público | 200, 400, 409 |
| POST | `/sign-in` | público (cria o cookie `session`) | 200, 400, 401 |
| POST | `/sign-out` | público (apaga o cookie) | 200 |
| GET | `/products?input={"limit":12,"cursor":"..."}` | público | 200 (`items` + `nextCursor`), 400 |
| POST | `/create-product` | público | 200, 400 |
| POST | `/product-feedbacks` | logado | 200, 400, 401, 404, 409 |

Cadastrar um produto (público, sem autenticação). Campos: `name` → `name`, `link` → `external_link`, `image` → `image_url` e `description` opcional:

```bash
curl -X POST localhost:3000/api/v1/create-product \
  -H "content-type: application/json" \
  -d '{"name":"Fone Aurora","link":"https://example.com/fone","image":"https://picsum.photos/seed/fone/800/600"}'
```

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build` / `npm start`: build e servidor de produção
- `npm run lint`: Biome (lint + formatação)

## Estrutura

```
database/migrations/        SQL versionado do Supabase
src/app/                    rotas (páginas e /api/v1)
src/components/ui/          componentes shadcn
src/features/<feature>/     código compartilhado da funcionalidade (ex.: schemas Zod)
src/lib/trpc/               client tRPC + React Query
src/server/                 código exclusivo do servidor (tRPC, Supabase)
```
