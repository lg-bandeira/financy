# Financy

Aplicação full-stack de gerenciamento de finanças pessoais.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | TypeScript, Express, Apollo Server, Type-GraphQL, Prisma, SQLite |
| Frontend | React, Vite, Apollo Client, TailwindCSS, Shadcn/ui, Zustand |

## Estrutura

```text
backend/    # API GraphQL (porta 4000)
frontend/   # SPA React (porta 5173)
specs/      # Especificação e plano de implementação
.specify/   # Constitution, design system (Figma)
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Defina JWT_SECRET no .env
npm install
npx prisma migrate dev
npm run seed   # opcional: demo@financy.com / demo12345
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Documentação

- Constitution: `.specify/memory/constitution.md`
- Design (Figma): `.specify/design/`
- Spec: `specs/001-financy-app/spec.md`
- Plano: `specs/001-financy-app/plan.md`
- Validação: `specs/001-financy-app/quickstart.md`
