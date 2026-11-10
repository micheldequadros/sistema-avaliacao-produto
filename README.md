# Avaliação de Produto

Plataforma para descobrir produtos, ler avaliações de quem já usou e publicar a sua (nota de 1 a 5 + comentário), com um resumo das avaliações gerado por IA.

Next.js (front-end + API tRPC) com Supabase. Arquitetura em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), requisitos em [specs/](specs/) e planos de implementação em [plans/](plans/).

## Requisitos

- Node.js 22.13 ou superior (exigência da Mastra)
- Um projeto Supabase
- Uma chave da OpenAI com créditos (só para o resumo por IA)

## Setup

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e preencha:
   - `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: dados do seu projeto Supabase (usados só no servidor).
   - `SESSION_SECRET`: 32+ caracteres aleatórios. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
   - `OPENAI_API_KEY`: usada pelo agente de resumo por IA. Sem ela, ou sem créditos, o resumo só não aparece; o resto do app funciona.
3. Aplique as migrations de [database/migrations](database/migrations), em ordem, no SQL Editor do Supabase (veja [database/README.md](database/README.md)). Opcional: rode [database/seed-products.sql](database/seed-products.sql) para ter 30 produtos de teste.
4. Rode `npm run dev` e acesse http://localhost:3000

## Páginas

| Rota | O que mostra | Acesso |
|---|---|---|
| `/` | Apresentação e lista de produtos com scroll infinito | público |
| `/products/[id]` | Produto, nota média, resumo por IA, avaliações e formulário de nova avaliação | público; avaliar exige login |
| `/auth/sign-up` | Criação de conta | público |
| `/auth/sign-up/success` | Confirmação da conta criada, com botão para o login | público |
| `/auth/sign-in` | Login. Aceita `?next=/caminho` para voltar à página de origem | público |

## API (`/api/v1`, tRPC)

| Método | Rota | Acesso | Respostas |
|---|---|---|---|
| POST | `/sign-up` | público | 200, 400, 409 (email já cadastrado) |
| POST | `/sign-in` | público; cria o cookie `session` | 200, 400, 401 |
| POST | `/sign-out` | público; apaga o cookie | 200 |
| GET | `/products?input={"limit":12,"cursor":"..."}` | público | 200 (`items` + `nextCursor`), 400 |
| POST | `/create-product` | **público** | 200, 400 |
| POST | `/product-feedbacks` | logado | 200, 400, 401, 404, 409 (já avaliou) |

As rotas recebem JSON no body (o `GET` recebe o input URL-encoded em `?input=`). O formato segue o tRPC: sucesso em `{"result":{"data":...}}`, erro em `{"error":{"message":...,"data":{"httpStatus":...,"fieldErrors":...}}}`.

### Cadastrar um produto

| Campo | Coluna | Regra |
|---|---|---|
| `name` | `name` | obrigatório, até 120 caracteres |
| `link` | `external_link` | obrigatório, URL http(s) |
| `image` | `image_url` | obrigatório, URL http(s) |
| `description` | `description` | opcional, até 500 caracteres |

```bash
curl -X POST localhost:3000/api/v1/create-product \
  -H "content-type: application/json" \
  -d '{"name":"Fone Aurora","link":"https://example.com/fone","image":"https://picsum.photos/seed/fone/800/600"}'
```

> Este endpoint não tem autenticação: qualquer pessoa com a URL consegue cadastrar produtos. Antes de publicar o app, proteja-o (chave, login de admin ou limite de requisições).

## Resumo por IA

- Agente Mastra em `src/server/ai/product-summary-agent.ts`, modelo `openai/gpt-4o-mini`. Devolve visão geral, pontos fortes e pontos de atenção.
- Só é gerado para produtos com 3 avaliações ou mais.
- Fica salvo em `products_ai_summaries` e é regenerado em segundo plano (`after()`) quando chega uma avaliação nova, ou quando a página do produto nota que ele está desatualizado. A página nunca espera a IA: mostra o último resumo salvo, ou nada.
- Por isso o resumo aparece a partir do próximo carregamento da página, não no mesmo instante em que a avaliação é publicada.
- Se a geração falhar, o erro aparece no terminal do servidor como `[ai-summary] produto <id>: ...` e uma nova tentativa só acontece após 5 minutos (ou com uma nova avaliação).

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build` / `npm start`: build e servidor de produção
- `npm run lint`: Biome (lint + formatação, só verifica)
- `npm run format`: Biome (aplica a formatação)

## Estrutura

```
database/migrations/        SQL versionado do Supabase (aplicar em ordem)
database/seed-products.sql  produtos de teste (opcional)
docs/                       arquitetura
specs/  plans/              requisitos e planos de cada funcionalidade
src/app/(platform)/         home e páginas de produto (com cabeçalho)
src/app/auth/               sign-up e sign-in
src/app/api/v1/[trpc]/      rota única da API tRPC
src/components/             cabeçalho, menu da conta, marca e componentes shadcn (ui/)
src/features/<feature>/     UI e schemas Zod por funcionalidade (auth, home, products, feedbacks)
src/lib/                    client tRPC + React Query, utilitários
src/server/ai/              agente Mastra de resumo
src/server/auth/            sessão (JWT em cookie) e conta logada
src/server/products/        leitura de produtos, avaliações e resumos
src/server/platform/        números da plataforma exibidos na home
src/server/trpc/            contexto, procedures e routers da API
src/server/db/              client Supabase e tipos do banco
```
