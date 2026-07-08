# Research: Financy — Personal Finance Management

**Date**: 2026-07-08

## 1. Architecture Pattern

**Decision**: Monorepo with isolated `backend/` and `frontend/`, GraphQL API, layered backend
(Resolver → Service → Prisma).

**Rationale**: Matches constitution and proven Mindshare reference. Enables independent
deployment and clear separation of concerns.

**Alternatives considered**:
- Single Next.js full-stack app — rejected (constitution forbids meta-frameworks on frontend)
- REST API — rejected (GraphQL required by challenge)

## 2. Authentication

**Decision**: JWT Bearer tokens via `jsonwebtoken`; passwords hashed with `bcryptjs` (salt 10).
Public mutations: `login`, `register`. All other operations protected by `IsAuth` middleware.

**Rationale**: Same pattern as Mindshare; stateless, simple, meets FR-002/FR-003.

**Alternatives considered**:
- Session cookies — rejected (adds server-side session store complexity)
- Refresh token rotation — deferred (Mindshare generates identical tokens; v1 accepts 1-day JWT)

## 3. Data Isolation

**Decision**: Every Category and Transaction row has `userId` FK. Services MUST verify
`resource.userId === context.user` on read/update/delete. List queries always filter by
`userId`.

**Rationale**: Constitution Principle IV (non-negotiable). Prevents cross-user data leakage (SC-003).

**Alternatives considered**:
- Row-level security in PostgreSQL — N/A for SQLite v1; application-level checks sufficient

## 4. Amount Storage

**Decision**: Store amounts as `Decimal` in Prisma (`@db.Decimal(12, 2)`), exposed as `Float`
in GraphQL. Frontend displays formatted BRL (`R$ 1.234,56`).

**Rationale**: Avoids floating-point errors while keeping GraphQL simple. BRL uses 2 decimal places.

**Alternatives considered**:
- Integer cents — valid but adds conversion layer; Decimal is more readable in Prisma Studio
- String amounts — rejected (harder to aggregate for dashboard)

## 5. Transaction Type

**Decision**: Prisma enum `TransactionType { INCOME EXPENSE }`. GraphQL enum mirrors Prisma.
Dashboard: INCOME sums to "Receitas", EXPENSE sums to "Despesas". Balance = income − expenses
(current calendar month).

**Rationale**: Aligns with Figma "Entrada/Saída" labels and spec assumptions.

## 6. Category Uniqueness & Deletion

**Decision**: Unique constraint on `(userId, name)`. Delete blocked when `transactionCount > 0`
(service throws error with Portuguese message).

**Rationale**: Spec FR-008 and edge case for duplicate names.

## 7. Dashboard Aggregations

**Decision**: Dedicated `DashboardResolver` with `getDashboardSummary` query returning:
`monthlyIncome`, `monthlyExpenses`, `balance`, `recentTransactions(limit: 5)`,
`categoryBreakdown(limit: 5)`.

**Rationale**: Avoids over-fetching on frontend; single query for dashboard page load.

**Alternatives considered**:
- Client-side aggregation from full transaction list — rejected (doesn't scale, violates SC-005)

## 8. Transaction List Pagination & Filters

**Decision**: `listTransactions` query accepts: `search`, `type`, `categoryId`, `month`, `year`,
`page` (default 1), `limit` (default 10). Returns `PaginatedTransactions { items, total, page, limit }`.

**Rationale**: Matches transactions page Figma (filters + "1 a 10 | 27 resultados").

## 9. Frontend State & Data Fetching

**Decision**:
- Auth state: Zustand with `persist` (Mindshare pattern)
- Server data: Apollo Client `useQuery` / `useMutation` with cache updates after mutations
- Forms: React Hook Form + Zod validation

**Rationale**: Recommended stack in constitution; Mindshare proves Zustand + Apollo works.

**Alternatives considered**:
- React Query instead of Apollo cache — flexible per constitution but Apollo already required

## 10. UI Component Strategy

**Decision**: TailwindCSS + Shadcn/ui + Lucide icons. Design tokens from
`.specify/design/style-guide.md`. Inter font from Google Fonts.

**Rationale**: Matches Figma Style Guide and constitution recommendations.

## 11. Category Icon & Color

**Decision**: Store `icon` as String (Lucide icon name, e.g. `"Utensils"`) and `color` as
Prisma enum `CategoryColor` (7 values from Figma).

**Rationale**: Validated against design modal; frontend maps to Lucide components dynamically.

## 12. Environment Configuration

**Decision**:
- Backend `.env.example`: `JWT_SECRET=`, `DATABASE_URL="file:./dev.db"`
- Frontend `.env.example`: `VITE_BACKEND_URL=http://localhost:4000/graphql`

**Rationale**: Constitution Principle V and challenge requirements.

## 13. CORS

**Decision**: `cors({ origin: 'http://localhost:5173', credentials: true })` in development.
Production origin via env variable when deployed.

**Rationale**: Constitution and Mindshare reference.

## 14. Seed Data

**Decision**: Optional `prisma/seed.ts` creating a demo user with sample categories and
transactions for development/demo.

**Rationale**: Accelerates dashboard and list page development; Mindshare seeds admin user.
