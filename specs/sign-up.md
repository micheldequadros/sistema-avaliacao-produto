# Sign-Up ( Criação de conta )

## Escopo
Front-end, Back-End, Banco de dados

## Contexto
Precisamos Implementar o fluxo para criação de contas na plataforma, as pessoas precisarão fornecer:
- Primeiro nome
- Sobrenome
- Email
- Senha
- Confirmação de senha


## Requisitos funcionais
1. Precisamos adicionar validação no formulário na camada do cliente
    1. Caso o formulário esteja válido podemos enviar a requisição para a api
2. Os campos de nome e sobrenome devem ser seprados
3. Precisamos criar uma nova conta no banco de dados na tabela de `accounts`
    1. `id`: nanoid (gerado com `nanoid` na camada de api)
    2. `first_name`: text
    3. `last_name`: text
    4. `created_at`: timestamp
    5. `updated_at`: timestamp
    6. `active`: boolean
    7. `email`: text (único — constraint `UNIQUE`)
    8. `password`: text (hashed)
    9. `salt`: text (gerado pelo bcrypt; mantido em coluna separada para fins didáticos, já que o hash do bcrypt também o contém)
4. A requisição deve ser um `POST` para `/api/v1/sign-up` (procedure tRPC `sign-up`) e receber os dados como JSON no `body`
5. Caso tudo der certo, retornar `200` ou erros de acordo com a validação
    1. `400` Má formatação de dados
    2. `409` Email já cadastrado
6. A validação deve usar o mesmo schema Zod no cliente e na API

## Requisitos não funcionais
- Segurança: Precisamos salvar as senhas de forma segura no banco de dados
    - Precisamos receber os dados do cliente de forma segura usando HTTPS (para previnir network sniff)
- UI/UX: Boa experiência de uso através de uma interface bonita, elegante, moderna
- Performance: O processo de criação de conta precisa ser rápido

## Você deve
- Criar a base do projeto com um endpoint inicial para criação de conta
- Cria a base do projeto com uma página inicial para a interface de criação de conta
- Configurar as bibliotecas base

## Você não deve
- Implementar qualquer outra funcionalidade que não esteja relacionada com sign-up ( Criação de contas )
- Não vamos realizar nenhum envio de email no momento, apenas processar a requisição, salvar no banco de dados e tornar um sucesso.

## Tecnologias (Stack)
React.js, Next.js, React-hook-form, Zod, shadcn, Tailwind, Supabase (client `@supabase/supabase-js`), tRPC

## Critérios de aceitação
- Temos uma página para criar a nova conta em `/auth/sign-up`
- A página contem um formulário com validação
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possíveis erros
    - Mostrar um alert em vermelho no formulário
    - Mostrar mensagem específica quando o email já estiver cadastrado (`409`)
- Estamos informando o sucesso de criação de conta:
    - Navegar para `/auth/sign-up/success`

## Resultado
- Pessoas conseguem criar uma nova conta na plataforma