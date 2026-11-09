# Orquestração: sign-in, home e feedback em paralelo

Planos por feature: [sign-in.md](sign-in.md), [home.md](home.md), [feedback.md](feedback.md).

## Por que existe este arquivo

As três specs dependem umas das outras:

- **feedback** precisa da sessão (vem do **sign-in**) e da tabela `products` (vem da **home**).
- **sign-in** e **home** pedem as duas para criar a home (`/`).
- Os três editariam os mesmos arquivos (`_app.ts`, `db/types.ts`, `init.ts`, `next.config.ts`, `package.json`).

Três agentes editando o mesmo arquivo ao mesmo tempo sobrescrevem o trabalho um do outro. Por isso existe uma **Fase 0**: eu crio os contratos compartilhados (tipos, stubs, dependências) **antes** de subir os agentes. Depois disso, cada agente só toca nos arquivos que são dele.

> Já existe o commit inicial (`67b4ca7`). Os agentes trabalham **na mesma árvore**, com divisão de arquivos por dono (tabela abaixo), e não em worktrees separadas: cada worktree precisaria do próprio `node_modules`, e o merge dos três no fim seria mais arriscado do que a divisão de arquivos. Eu commito a Fase 0 antes de subir os agentes, para que o diff de cada um fique limpo na revisão.

## Fase 0: contratos compartilhados (eu, antes dos agentes)

0. **`npm install`**: o `node_modules` não existe hoje. Sem ele não há `tsc`, `biome`, nem os guias em `node_modules/next/dist/docs/` que o AGENTS.md manda ler. Também commito as pequenas mudanças pendentes (nome no `package.json` e título do README).
1. **Dependências novas** (uma instalação só, para evitar `npm install` concorrente):
   - `npm i jose` (JWT da sessão, recomendado pelo guia de autenticação do Next)
   - `npx shadcn add avatar dropdown-menu skeleton textarea`
2. **`.env.example`**: adicionar `SESSION_SECRET` (32+ caracteres) e `ADMIN_API_KEY`. **Você precisa preencher os dois no `.env.local`.**
3. **`next.config.ts`**: remover o redirect de `/` para `/auth/sign-up`.
4. **`src/server/db/types.ts`**: adicionar os tipos de `products` e `products_feedbacks` conforme o schema aprovado nos planos.
5. **Sessão (contrato, implementado pelo sign-in)**, em `src/server/auth/session.ts`:
   ```ts
   type Session = { accountId: string };
   createSession(accountId: string): Promise<void>
   deleteSession(): Promise<void>
   getSession(): Promise<Session | null>
   ```
   e em `src/server/auth/current-account.ts`:
   ```ts
   type CurrentAccount = { id: string; firstName: string; lastName: string; email: string };
   getCurrentAccount(): Promise<CurrentAccount | null>
   ```
   Na Fase 0 são stubs que retornam `null`.
6. **tRPC**:
   - `init.ts`: contexto `{ headers: Headers; session: Session | null }` e `protectedProcedure` (lança `UNAUTHORIZED` sem sessão).
   - `api/v1/[trpc]/route.ts`: `createContext` lê `req.headers` e `getSession()`.
   - Stubs de procedures já registrados em `_app.ts`: `sign-in`, `sign-out`, `products`, `create-product`, `product-feedbacks`. Cada stub fica no arquivo do seu dono.
7. **Layout da plataforma**: `src/app/(platform)/layout.tsx` renderiza `<SiteHeader />` (`src/components/site-header.tsx`, stub) e `children`. Também crio uma `(platform)/page.tsx` mínima para `/` não dar 404.
8. **Avatar**: `src/lib/avatar.ts` com `avatarUrl(seed: string)` (DiceBear). Sign-in e feedback usam.
9. **Migrations**: nomes reservados (home `20261109000000_create_products.sql`, feedback `20261109000100_create_products_feedbacks.sql`). A ordem importa por causa da FK.

No fim da Fase 0, `tsc` e `biome` precisam passar.

## Fase 1: três agentes em paralelo

| Arquivo / área | Dono |
|---|---|
| `src/server/auth/**`, `routers/sign-in.ts`, `routers/sign-out.ts`, `src/features/auth/sign-in/**`, `src/app/auth/sign-in/**`, `src/components/site-header.tsx`, `src/components/user-menu.tsx`, link "Entrar" em `sign-up-form.tsx` | **sign-in** |
| `database/migrations/20261109000000_*`, `routers/products.ts`, `routers/create-product.ts`, `src/features/products/**` (exceto `get-product.ts`), `src/app/(platform)/page.tsx` | **home** |
| `database/migrations/20261109000100_*`, `routers/product-feedbacks.ts`, `src/features/feedbacks/**`, `src/server/products/get-product.ts`, `src/app/(platform)/products/[id]/**` | **feedback** |
| `_app.ts`, `init.ts`, `route.ts`, `db/types.ts`, `next.config.ts`, `package.json`, `globals.css`, `(platform)/layout.tsx`, `src/lib/avatar.ts`, `src/components/ui/**` | **somente eu** (se um agente precisar mudar, ele me avisa no relatório) |

Regras para cada agente:

- Ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código (AGENTS.md). Atenção a `cacheComponents: true`: `cookies()` e dados dinâmicos precisam ficar dentro de `<Suspense>`.
- Seguir o visual existente: tokens em `globals.css`, Bricolage Grotesque, direção v3 (papel `#F7F6FB`, violeta `#5A43DC`, estrela `#FFC53D` só em notas) e a skill `.agents/skills/frontend-design/SKILL.md`.
- Não rodar `next build` nem `next dev`, porque builds concorrentes disputam a pasta `.next`. Validar com `npx tsc --noEmit` e `npx biome check <seus arquivos>`.
- Não rodar `npm install`. Se faltar algo, avisar no relatório.
- O relatório final lista arquivos criados/alterados, decisões tomadas e pendências.

## Fase 2: integração (eu)

1. Revisar os diffs contra os planos e a tabela de donos.
2. `npx tsc --noEmit`, `npm run lint`, `npm run build`.
3. **Você** aplica as duas migrations no SQL Editor do Supabase (como no sign-up).
4. Cadastrar alguns produtos via `POST /api/v1/create-product`.
5. Rodar o app e testar o fluxo inteiro, com screenshots:
   sign-up → sign-in (erro 401 + sucesso) → header com avatar → home com scroll infinito → produto → feedback (deslogado: bloco de login; logado: envio).
6. Atualizar README, `docs/ARCHITECTURE.md` e `database/README.md`, e entregar um relatório final.
