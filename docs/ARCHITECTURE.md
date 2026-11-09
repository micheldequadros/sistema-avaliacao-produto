# Arquitetura do Projeto

## Front-end
Vamos utilizar as seguintes bibliotecas principais:
- Typescript: Linguagem principalmente de desenvolvimento com tipagem
- Next.js: Framework para criação e gestão de interfaces 
- React.js: Biblioteca para criação e componentização de interfaces
- Biome: Validação/formatação/correção de código (lint)
- Date-FNS: Manipulação de data/hora
- Shadcn + Tailwind: componentização base (design system)
- React Hook Form + Zod: formulários e validação no cliente
- React Query: Criação e gestão de queries para ler dados da API e mutations para alterar dados.


## Back-end
Vamos utilizar as seguintes bibliotecas principais:
- Typescript: Linguagem principalmente de desenvolvimento com tipagem
- Next.js: Framework para criação APIS
- bcryptjs: Geração de salt + hash da senha
- Mastra.ai: Criação e customização de agentes internos
- tRPC: Gestão de endpoints (montado em `/api/v1`)
- Zod: Validação de dados (schemas compartilhados com o front-end)
- nanoid: Geração de IDs

## Banco de dados
Supabase: PostgreSQL
- Acesso via client `@supabase/supabase-js` (somente no servidor, com a service role key)
- Migrations SQL versionadas na pasta `database/migrations`

## Infraestrutura
Vercel: Hospedar tanto o servidor (API) quanto cliente (SPA)

## Automação
N8N: Criação de fluxos automatizados