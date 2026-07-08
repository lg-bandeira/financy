# Implementation Plan: Financy — Personal Finance Management

**Branch**: `001-financy-app` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-financy-app/spec.md`

## Summary

Build a full-stack personal finance application (Financy) with isolated `backend/` and
`frontend/` applications. The backend exposes a GraphQL API (Type-GraphQL + Apollo Server +
Prisma + SQLite) for authentication, category CRUD, transaction CRUD, dashboard aggregates,
and user profile. The frontend is a React + Vite SPA using Apollo Client, implementing 7
pages and 2 modals per Figma design. All financial data is scoped to the authenticated user.

**Reference implementation**: Mindshare (`ftr-pos-360-mindshare/backend` and `frontend`).

## Technical Context

**Language/Version**: TypeScript ES2023 (backend ESM, frontend ESM)

**Primary Dependencies**:
- Backend: Express 5, Apollo Server 5, Type-GraphQL, Prisma 6, jsonwebtoken, bcryptjs, tsx
- Frontend: React 19, Vite 7, Apollo Client 4, React Router 7, TailwindCSS, Shadcn/ui,
  Lucide React, Zustand, React Hook Form, Zod

**Storage**: SQLite via Prisma (`file:./dev.db`); PostgreSQL acceptable alternative

**Testing**: Manual validation via `quickstart.md` scenarios; automated tests out of scope v1

**Target Platform**: Node.js 20+ (backend), modern browsers (frontend)

**Project Type**: Web application (monorepo: `backend/` + `frontend/`)

**Performance Goals**: Transaction search/filter < 2s for up to 1,000 records per user (SC-005)

**Constraints**:
- User data isolation on every query/mutation (constitution Principle IV)
- CORS enabled for frontend origin
- `.env.example` required in both apps
- UI must match Figma design system (`.specify/design/`)

**Scale/Scope**: Single-user personal finance; 7 pages, 2 modals, 4 entities, ~25 GraphQL operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` (Financy v1.1.0):

- [x] **Monorepo isolado**: `backend/` and `frontend/` with no cross-imports
- [x] **GraphQL code-first**: Type-GraphQL resolvers; schema emitted to `backend/schema.graphql`
- [x] **Camadas**: Resolver → Service → Prisma
- [x] **Isolamento por usuário**: all domain operations filter by `userId`
- [x] **Stack obrigatória**: TypeScript, GraphQL, Prisma, SQLite; React, Vite, GraphQL
- [x] **Env vars**: `JWT_SECRET`, `DATABASE_URL` (backend); `VITE_BACKEND_URL` (frontend)
- [x] **CORS**: backend allows `http://localhost:5173` in development
- [x] **Frontend paths**: `src/lib/graphql/queries|mutations/`; Zustand auth store

**Post-design re-check**: All gates pass. No constitution violations. Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-financy-app/
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — Prisma schema design
├── quickstart.md        # Phase 1 — validation scenarios
├── contracts/           # Phase 1 — GraphQL API contract
│   └── graphql-schema.graphql
├── spec.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── prisma.ts
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── resolvers/
│   │   ├── auth.resolver.ts
│   │   ├── user.resolver.ts
│   │   ├── category.resolver.ts
│   │   ├── transaction.resolver.ts
│   │   └── dashboard.resolver.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── category.service.ts
│   │   ├── transaction.service.ts
│   │   └── dashboard.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── category.model.ts
│   │   └── transaction.model.ts
│   ├── dtos/
│   │   ├── input/
│   │   └── output/
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── graphql/
│   │   ├── context/
│   │   └── decorators/
│   └── utils/
│       ├── jwt.ts
│       └── hash.ts
├── schema.graphql
├── .env.example
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   ├── ui/              # Shadcn
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── TransactionFormDialog.tsx
│   │   └── CategoryFormDialog.tsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Categories/
│   │   └── Profile/
│   ├── lib/
│   │   ├── graphql/
│   │   │   ├── apollo.ts
│   │   │   ├── queries/
│   │   │   └── mutations/
│   │   └── utils.ts
│   ├── stores/
│   │   └── auth.ts
│   └── types/
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

**Structure Decision**: Option 2 (web application) per constitution. Backend follows Mindshare
layered architecture; frontend follows Mindshare folder conventions with Financy-specific pages
from `.specify/design/pages/`.

## Complexity Tracking

> No violations. All design choices align with constitution.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Implementation Phases (for /speckit-tasks)

| Phase | Scope | User Stories |
|-------|-------|--------------|
| 1 — Setup | Monorepo scaffold, Prisma, Tailwind, Shadcn, Apollo | — |
| 2 — Foundation | Auth (JWT), context, middleware, Layout, Header | US1 |
| 3 — Categories | Category CRUD + modal + page | US2 |
| 4 — Transactions | Transaction CRUD + modal + page with filters | US3, US5 |
| 5 — Dashboard | Summary queries, recent list, category breakdown | US4 |
| 6 — Profile | Profile page, update name, logout | US6 |
| 7 — Polish | Empty states, toasts, responsive, Figma fidelity | SC-006 |
