# Plano: Sign-In (autenticação)

Spec: [specs/sign-in.md](../specs/sign-in.md). Contratos compartilhados: [00-orquestracao.md](00-orquestracao.md).

## Objetivo
A pessoa entra com email e senha em `/auth/sign-in`. Uma sessão em cookie é criada, ela vai para `/`, e o cabeçalho passa a mostrar avatar, nome e email.

## Decisões (aprovadas)
1. **Sessão stateless com JWT** (`jose`, HS256) num cookie `session`: `httpOnly`, `sameSite=lax`, `secure` em produção, `path=/`, validade de 7 dias. O payload leva só `sub` (id da conta) e `exp`. É o padrão do guia de autenticação do Next 16 e não exige tabela de sessões. A alternativa seria uma tabela `sessions` no banco, que permite revogar sessões, mas está fora do escopo.
2. **O nome e o email do cabeçalho vêm do banco**, via `getCurrentAccount()` com `React.cache` (uma consulta por request), e não do cookie. Assim os dados nunca ficam velhos e o JWT continua pequeno.
3. **Mensagem genérica no 401:** "Email ou senha inválidos." vale para email inexistente, senha errada e conta `active = false`. Quando o email não existe, ainda rodamos um `bcrypt.compare` contra um hash fictício, para o tempo de resposta não revelar quais emails existem.
4. **Parâmetro `?next=`** (pequena extensão): o sign-in aceita `?next=/products/abc` e volta para lá depois do login. O padrão continua `/`. Só aceita caminhos relativos que começam com `/` e não com `//`, para evitar open redirect. A página de feedback usa isso no bloco "entre para avaliar".
5. **Logout mínimo:** o item "Sair" no menu do avatar chama a procedure `sign-out` (mutation, `POST /api/v1/sign-out`). Ela executa `deleteSession()` e responde **200**; depois o cliente faz `router.refresh()`. Sem isso não daria para testar o estado deslogado sem apagar o cookie na mão.

## API
- Procedure tRPC `sign-in` (mutation), ou seja `POST /api/v1/sign-in` com JSON `{ email, password }`.
- Schema `signInSchema` em `src/features/auth/sign-in/schema.ts`, compartilhado entre cliente e API. O email passa por trim, lowercase e validação de formato; a senha é obrigatória, com no máximo 72 caracteres (sem regras de força: no login isso só atrapalha).
- Fluxo: validar (falha vira **400**, pelo `errorFormatter` existente) → `select id, password, active from accounts where email = ?` → `bcrypt.compare` (falha vira **401** `UNAUTHORIZED`) → `createSession(id)` → **200** `{ id }`.
- O cookie é gravado com `cookies()` de `next/headers` dentro da procedure. Isso funciona porque o tRPC roda dentro de um Route Handler. **Validar isso cedo**; se não funcionar, gravar via `resHeaders` do `fetchRequestHandler`.

## Sessão (implementa o contrato da Fase 0)
- `src/server/auth/session.ts`: `createSession`, `deleteSession` e `getSession`. `getSession` retorna `null` se o cookie estiver ausente, inválido ou expirado. A chave vem de `SESSION_SECRET` e dá erro claro se faltar.
- `src/server/auth/current-account.ts`: `getCurrentAccount()` = `getSession()` + busca de `id, first_name, last_name, email` (só contas ativas), envolvido em `cache`.

## Front-end
- **`/auth/sign-in`** (`src/app/auth/sign-in/page.tsx` + `sign-in-form.tsx`): usa o layout de auth existente (painel escuro + formulário). Mesmo padrão do `sign-up-form.tsx`: React Hook Form + zodResolver, `mode: "onTouched"`, componente `Field`, botão com estado "Entrando...".
  - Título "Entrar", subtítulo voltado a times de produto, campos Email e Senha (`autoComplete` `email` e `current-password`).
  - Erro da API: `Alert` vermelho no topo do formulário. Para 401: "Email ou senha inválidos." Para outros: mensagem genérica. Nenhum campo é marcado individualmente, para não indicar qual dos dois está errado.
  - Sucesso: `router.replace(next ?? "/")` + `router.refresh()`, para o cabeçalho buscar a conta.
  - Link "Ainda não tem conta? Criar conta" para o sign-up. No `sign-up-form.tsx`, o link inverso "Já tem conta? Entrar".
- **Cabeçalho** (`src/components/site-header.tsx`, usado por `(platform)/layout.tsx`): marca com link para `/` à esquerda e área da conta à direita, dentro de `<Suspense>` com skeleton do mesmo tamanho (exigência do `cacheComponents` por causa de `cookies()`).
  - **Deslogado:** botão "Entrar" (link para `/auth/sign-in`).
  - **Logado** (`src/components/user-menu.tsx`): avatar DiceBear (`avatarUrl(account.id)`) com nome + sobrenome e email ao lado em telas `md+`. No mobile só o avatar, e um `dropdown-menu` mostra nome e email.
- Avatar com `<img>` simples (SVG do DiceBear, tamanho fixo) e fallback de iniciais no componente `avatar` do shadcn, sem precisar de `remotePatterns`.

## Arquivos
Cria: `src/features/auth/sign-in/schema.ts`, `src/server/trpc/routers/sign-in.ts` e `sign-out.ts` (substituem os stubs), `src/server/auth/session.ts` e `current-account.ts` (substituem os stubs), `src/app/auth/sign-in/page.tsx`, `src/app/auth/sign-in/sign-in-form.tsx`, `src/components/site-header.tsx` (substitui o stub), `src/components/user-menu.tsx`.
Edita: `src/app/auth/sign-up/sign-up-form.tsx` (só o link "Entrar").
Não toca: arquivos marcados "somente orquestrador" em [00-orquestracao.md](00-orquestracao.md).

## Fora do escopo
"Esqueci a senha", redirecionar quem já está logado para fora de `/auth/*`, proteção de rotas via `proxy.ts`, rate limit.

## Verificação
- `npx tsc --noEmit` e `npx biome check` nos arquivos da feature.
- Na integração: 400 (email malformado), 401 (senha errada e email inexistente, mesma mensagem), 200 com cookie `HttpOnly` presente, navegação para `/`, cabeçalho com avatar, nome e email; deslogado, botão "Entrar".
