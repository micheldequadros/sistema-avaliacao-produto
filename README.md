# Study

Next.js (front-end + API tRPC) com Supabase. Arquitetura em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e funcionalidades em [specs/](specs/).

## Setup

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e preencha com os dados do seu projeto Supabase.
3. Aplique as migrations de [database/migrations](database/migrations) (veja [database/README.md](database/README.md)).
4. Rode: `npm run dev` e acesse http://localhost:3000/auth/sign-up

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
