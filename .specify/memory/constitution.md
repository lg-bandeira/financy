<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: None
- Added sections:
  - Referência ao Style Guide Figma em Desenvolvimento Frontend
- Removed sections: None
- New artifacts:
  - .specify/design/style-guide.md — ✅ created (cores, tipografia, ícones, componentes)
- Templates:
  - .specify/templates/plan-template.md — ✅ aligned (no changes required)
  - .specify/templates/spec-template.md — ✅ aligned (no changes required)
  - .specify/templates/tasks-template.md — ✅ aligned (no changes required)
- Follow-up TODOs: Aguardando telas do Figma (páginas e modais)
-->

# Financy Constitution

## Core Principles

### I. Monorepo com Aplicações Isoladas

O repositório Financy MUST manter `backend/` e `frontend/` como aplicações independentes,
cada uma com seu próprio `package.json`, dependências, scripts e `.env.example`. Nenhuma
aplicação MUST importar código-fonte da outra; a comunicação ocorre exclusivamente via
API GraphQL HTTP. Cada pasta MUST ser executável e implantável de forma autônoma.

**Rationale**: Isolamento reduz acoplamento, facilita deploy independente e espelha a
arquitetura de referência do projeto Mindshare.

### II. API GraphQL Code-First (NON-NEGOTIABLE)

O backend MUST expor uma API GraphQL usando TypeScript, Apollo Server e Type-GraphQL
(code-first). O schema MUST ser gerado a partir de decorators (`@ObjectType`, `@InputType`,
`@Resolver`, `@FieldResolver`) e emitido em `schema.graphql`. Mutations e queries MUST
seguir convenções de nomenclatura descritivas (`createTransaction`, `listCategories`).
CORS MUST estar habilitado apontando para a URL do frontend em desenvolvimento.

**Rationale**: GraphQL oferece contrato tipado e flexível; Type-GraphQL garante
type-safety end-to-end entre schema e código TypeScript, conforme padrão Mindshare.

### III. Arquitetura em Camadas (Resolver → Service → Prisma)

Toda funcionalidade de domínio MUST seguir o fluxo: **Resolver** (transporte GraphQL) →
**Service** (regras de negócio) → **Prisma** (persistência). Resolvers MUST NOT acessar
Prisma diretamente. A estrutura de pastas do backend MUST seguir:

- `src/resolvers/` — handlers GraphQL e field resolvers
- `src/services/` — lógica de negócio
- `src/models/` — ObjectTypes GraphQL
- `src/dtos/input/` e `src/dtos/output/` — InputTypes e OutputTypes
- `src/middlewares/` — guards (ex.: `IsAuth`)
- `src/graphql/context/` — contexto por request
- `src/graphql/decorators/` — decorators customizados (ex.: `@GqlUser`)
- `src/utils/` — utilitários transversais (JWT, hash)
- `prisma/` — schema, migrations, seed e singleton do PrismaClient

**Rationale**: Separação de responsabilidades facilita manutenção, testes e evolução
incremental do domínio financeiro.

### IV. Isolamento de Dados por Usuário (NON-NEGOTIABLE)

Todo recurso de domínio (transações e categorias) MUST pertencer a um único usuário via
`userId`. Services MUST filtrar e validar ownership em todas as operações de leitura,
atualização e exclusão. Um usuário autenticado MUST NOT acessar, modificar ou deletar
recursos de outro usuário. Autenticação MUST usar JWT Bearer token; rotas protegidas
MUST aplicar middleware `IsAuth`. Login e registro permanecem públicos.

**Rationale**: Requisito funcional central do Financy — gestão financeira pessoal com
dados estritamente isolados por conta.

### V. Stack Obrigatória e Configuração Explícita

Ambas as aplicações MUST usar TypeScript. O backend MUST usar Prisma com SQLite como
banco padrão (PostgreSQL é alternativa aceitável). Cada aplicação MUST possuir
`.env.example` documentando todas as variáveis obrigatórias:

- Backend: `JWT_SECRET`, `DATABASE_URL`
- Frontend: `VITE_BACKEND_URL`

Novas variáveis de ambiente MUST ser adicionadas ao respectivo `.env.example` no mesmo
commit que as introduz. Secrets MUST NOT ser commitados.

**Rationale**: Requisito do desafio; configuração explícita evita falhas silenciosas entre
ambientes de desenvolvimento, staging e produção.

## Stack Tecnológico e Requisitos Obrigatórios

### Backend (`backend/`)

| Tecnologia | Versão/Observação |
|------------|-------------------|
| Node.js + TypeScript (ESM) | `"type": "module"`, target ES2023 |
| Express 5 | Servidor HTTP |
| Apollo Server 5 | Motor GraphQL |
| Type-GraphQL | Schema code-first com decorators |
| Prisma | ORM, migrations e seed |
| SQLite | Banco padrão (`file:./dev.db`) |
| jsonwebtoken + bcryptjs | Autenticação JWT e hash de senha |
| tsx | Execução e hot-reload em desenvolvimento |

### Frontend (`frontend/`)

| Tecnologia | Obrigatoriedade |
|------------|-----------------|
| React + TypeScript | Obrigatório |
| Vite (sem framework meta) | Obrigatório |
| GraphQL (Apollo Client) | Obrigatório |
| TailwindCSS | Recomendado |
| Shadcn/ui | Recomendado |
| React Query | Flexível |
| React Hook Form + Zod | Flexível |
| Zustand | Recomendado (padrão Mindshare para auth state) |

### Domínio Funcional

O Financy MUST implementar gestão de finanças pessoais com as entidades e operações:

- **Usuário**: registro, login, sessão autenticada
- **Transação**: criar, listar, editar, deletar (CRUD completo)
- **Categoria**: criar, listar, editar, deletar (CRUD completo)

Todas as operações de transação e categoria MUST respeitar o isolamento por usuário
(Princípio IV).

## Padrões de Código e Estrutura de Pastas

### Backend — Padrões de Referência (Mindshare)

- **Instanciação de services**: propriedade privada no resolver (`private xService = new XService()`)
- **Autenticação**: `buildContext` extrai JWT do header `Authorization: Bearer <token>`
- **Decorator `@GqlUser`**: injeta usuário autenticado em mutations que exigem ownership
- **DTOs separados de Models**: inputs/outputs GraphQL distintos dos ObjectTypes expostos
- **Field Resolvers**: relações carregadas sob demanda (`author`, `category`, etc.)
- **Prisma singleton**: `prisma/prisma.ts` com padrão global para hot-reload
- **Migrations versionadas**: toda alteração de schema via `prisma migrate dev`
- **Seed**: dados iniciais em `prisma/seed.ts` quando aplicável

### Frontend — Padrões de Referência (Mindshare)

Estrutura de pastas MUST seguir:

```text
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis e ui/ (Shadcn)
│   ├── pages/            # Páginas por domínio (Auth, Dashboard, etc.)
│   ├── lib/
│   │   └── graphql/      # Apollo client, queries e mutations
│   ├── stores/           # Estado global (auth via Zustand)
│   └── types/            # Tipos TypeScript compartilhados
├── .env.example
└── package.json
```

- Queries e mutations GraphQL MUST ficar em arquivos separados por domínio em
  `src/lib/graphql/queries/` e `src/lib/graphql/mutations/`
- Apollo Client MUST usar `VITE_BACKEND_URL` e injetar token JWT via auth link
- Rotas protegidas MUST redirecionar usuários não autenticados para login
- Layout MUST seguir fielmente o design do Figma; tokens e componentes definidos em
  `.specify/design/style-guide.md` (Style Guide como ponto de partida)

### Convenções Gerais

- Código MUST ser escrito em TypeScript com tipagem explícita em contratos públicos
- Nomes de arquivos: `kebab-case` ou `dot.notation` por domínio (ex.: `auth.service.ts`)
- Erros de negócio MUST ser lançados nos services com mensagens claras em português
- Password hash MUST NOT ser exposto em respostas GraphQL
- `validate: false` no buildSchema é aceitável; validação de input SHOULD usar Zod
  no frontend e regras explícitas nos services no backend

## Desenvolvimento Frontend

### Páginas e Navegação

A aplicação MUST conter 6 páginas e 2 modais (Dialog) conforme design Figma:

| Rota | Comportamento |
|------|---------------|
| `/` | Login (deslogado) ou Dashboard (logado) |
| Demais páginas | Gestão de transações e categorias |

### Design System (Figma Style Guide)

O frontend MUST implementar o design system documentado em `.specify/design/style-guide.md`:

- **Cores**: brand (`#124B2B`, `#1F6F43`), grayscale, feedback e paleta de categorias
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Lucide Icons (`lucide-react`)
- **Logo**: wordmark "FINANCY" + ícone de moedas em `brand-base`
- **Componentes base**: Input, Label Button, Icon Button, Link, Pagination, Tag, Type

### Fluxo de Desenvolvimento Recomendado

1. Implementar Style Guide do Figma (ver `.specify/design/style-guide.md`)
2. Configurar Apollo Client e store de autenticação
3. Implementar login/registro
4. Implementar CRUD de categorias e transações
5. Integrar modais de formulário (Dialog) para criar/editar

### Experiência de Desenvolvimento (DX)

Bibliotecas recomendadas (TailwindCSS, Shadcn, React Hook Form, Zod, React Query) SHOULD
ser adotadas quando reduzirem complexidade sem violar requisitos obrigatórios. O
desenvolvedor MUST NOT introduzir frameworks meta sobre React (Next.js, Remix, etc.) —
apenas Vite + React.

## Governance

Esta constituição é a fonte autoritativa de decisões arquiteturais e de stack para o
projeto Financy. Ela supersede preferências individuais e convenções ad-hoc não
documentadas aqui.

### Processo de Emenda

1. Propor alteração com justificativa e impacto nos templates `.specify/templates/`
2. Incrementar `CONSTITUTION_VERSION` conforme semver:
   - **MAJOR**: remoção ou redefinição incompatível de princípio
   - **MINOR**: novo princípio ou expansão material de requisito
   - **PATCH**: clarificações e correções de redação
3. Atualizar `LAST_AMENDED_DATE` para a data da emenda
4. Propagar mudanças para `plan-template.md`, `spec-template.md` e `tasks-template.md`
5. Registrar Sync Impact Report no comentário HTML do topo do arquivo

### Compliance

- Todo plano de implementação (`/speckit-plan`) MUST passar pelo Constitution Check
  antes de iniciar desenvolvimento
- Toda feature spec MUST verificar isolamento de dados (Princípio IV) e stack obrigatória
  (Princípio V)
- Toda lista de tasks MUST usar paths `backend/` e `frontend/` conforme estrutura definida
- Violações de princípios MUST ser documentadas na seção Complexity Tracking do plano
  com justificativa explícita

### Referências

- Backend de referência: projeto Mindshare (`ftr-pos-360-mindshare/backend`)
- Frontend de referência: projeto Mindshare (`ftr-pos-360-mindshare/frontend`)
- Especificações de feature: `specs/[###-feature]/spec.md`
- Planos de implementação: `specs/[###-feature]/plan.md`
- Style Guide (Figma): `.specify/design/style-guide.md`

**Version**: 1.1.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08
