---
description: "Task list for Financy personal finance application"
---

# Tasks: Financy — Personal Finance Management

**Input**: Design documents from `/specs/001-financy-app/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual validation via `quickstart.md` (automated tests out of scope v1)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US6)

## Path Conventions

- Backend: `backend/src/`, `backend/prisma/`
- Frontend: `frontend/src/`
- Design reference: `.specify/design/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo structure and tooling for both applications

- [x] T001 Create `backend/` directory with `package.json` (Express 5, Apollo Server 5, Type-GraphQL, Prisma, jsonwebtoken, bcryptjs, tsx)
- [x] T002 [P] Create `backend/tsconfig.json` with ESM, ES2023, experimentalDecorators, emitDecoratorMetadata
- [x] T003 [P] Create `backend/.env.example` with `JWT_SECRET=` and `DATABASE_URL="file:./dev.db"`
- [x] T004 [P] Create `backend/.gitignore` excluding `node_modules`, `.env`, `prisma/dev.db`
- [x] T005 Create `frontend/` directory with `package.json` (React 19, Vite 7, Apollo Client, React Router, TailwindCSS, Zustand, RHF, Zod, lucide-react)
- [x] T006 [P] Create `frontend/tsconfig.json` and `frontend/vite.config.ts` with `@/` path alias
- [x] T007 [P] Create `frontend/.env.example` with `VITE_BACKEND_URL=http://localhost:4000/graphql`
- [x] T008 [P] Create `frontend/.gitignore` excluding `node_modules`, `.env`, `dist`
- [x] T009 Initialize Prisma in `backend/prisma/schema.prisma` with SQLite datasource and client generator
- [x] T010 [P] Configure TailwindCSS in `frontend/tailwind.config.js` with Financy design tokens from `.specify/design/style-guide.md` (brand, gray, feedback, category colors)
- [x] T011 [P] Initialize Shadcn/ui in `frontend/` and add base components to `frontend/src/components/ui/` (Button, Input, Label, Dialog, Select, Checkbox, Avatar, Card)
- [x] T012 [P] Add Inter font and global styles in `frontend/src/index.css` per style guide

**Checkpoint**: Both apps install and start without errors (`npm install` in each)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Auth infrastructure, database User model, GraphQL bootstrap, routing shell — MUST complete before domain stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Add User model to `backend/prisma/schema.prisma` and run `prisma migrate dev --name init_user`
- [x] T014 [P] Create Prisma singleton in `backend/prisma/prisma.ts`
- [x] T015 [P] Implement `backend/src/utils/hash.ts` (bcryptjs hash and compare)
- [x] T016 [P] Implement `backend/src/utils/jwt.ts` (signJwt, verifyJwt with JWT_SECRET)
- [x] T017 [P] Create `backend/src/models/user.model.ts` Type-GraphQL ObjectType (exclude password from responses)
- [x] T018 [P] Create `backend/src/dtos/input/auth.input.ts` (RegisterInput, LoginInput)
- [x] T019 [P] Create `backend/src/dtos/output/auth.output.ts` (AuthPayload with token, refreshToken, user)
- [x] T020 Implement `backend/src/services/auth.service.ts` (register, login, generateTokens)
- [x] T021 Implement `backend/src/graphql/context/index.ts` (extract Bearer token, set context.user)
- [x] T022 [P] Implement `backend/src/middlewares/auth.middleware.ts` (IsAuth guard)
- [x] T023 [P] Implement `backend/src/graphql/decorators/user.decorator.ts` (@GqlUser parameter decorator)
- [x] T024 Implement `backend/src/resolvers/auth.resolver.ts` (login, register mutations — public)
- [x] T025 Implement `backend/src/index.ts` (Express, CORS for localhost:5173, Apollo Server, buildSchema, emit schema.graphql)
- [x] T026 [P] Create `frontend/src/types/index.ts` with User, LoginInput, RegisterInput types
- [x] T027 [P] Implement `frontend/src/lib/graphql/apollo.ts` (HttpLink with VITE_BACKEND_URL, auth link with token)
- [x] T028 [P] Create `frontend/src/lib/graphql/mutations/Login.ts` and `frontend/src/lib/graphql/mutations/Register.ts`
- [x] T029 Implement `frontend/src/stores/auth.ts` (Zustand persist: login, signup, logout, clear Apollo cache)
- [x] T030 [P] Add logo assets to `frontend/src/assets/` per style guide
- [x] T031 [P] Implement `frontend/src/components/Layout.tsx` and `frontend/src/components/Header.tsx` (logo, nav links, avatar placeholder)
- [x] T032 Implement `frontend/src/App.tsx` with React Router routes and ProtectedRoute/PublicRoute guards
- [x] T033 [P] Implement `frontend/src/pages/Auth/Login.tsx` per `.specify/design/pages/login.md`
- [x] T034 [P] Implement `frontend/src/pages/Auth/Signup.tsx` per `.specify/design/pages/signup.md`
- [x] T035 Wire `frontend/src/main.tsx` with ApolloProvider, BrowserRouter, and global CSS

**Checkpoint**: User can register, login, see protected route redirect — US1 independently testable

---

## Phase 3: User Story 2 — Category Organization (Priority: P2)

**Goal**: Users create, edit, delete, and list categories with icon and color

**Independent Test**: Create category via modal, see it in grid, edit, delete empty category; blocked delete when in use

### Implementation for User Story 2

- [x] T036 [US2] Add Category model and CategoryColor enum to `backend/prisma/schema.prisma`; run `prisma migrate dev --name add_category`
- [x] T037 [P] [US2] Create `backend/src/models/category.model.ts` with transactionCount field
- [x] T038 [P] [US2] Create `backend/src/dtos/input/category.input.ts` (CreateCategoryInput, UpdateCategoryInput)
- [x] T039 [US2] Implement `backend/src/services/category.service.ts` (CRUD, userId filter, unique name per user, block delete if transactions exist)
- [x] T040 [US2] Implement `backend/src/resolvers/category.resolver.ts` (listCategories, getCategoryStats, create, update, delete + field resolvers)
- [x] T041 [P] [US2] Register CategoryResolver in `backend/src/index.ts`
- [x] T042 [P] [US2] Create `frontend/src/lib/graphql/queries/Categories.ts` (listCategories, getCategoryStats)
- [x] T043 [P] [US2] Create `frontend/src/lib/graphql/mutations/Category.ts` (create, update, delete)
- [x] T044 [P] [US2] Implement `frontend/src/components/CategoryFormDialog.tsx` per `.specify/design/pages/category-form-modal.md` (icon picker, color picker, Zod validation)
- [x] T045 [P] [US2] Implement `frontend/src/pages/Categories/components/CategoryCard.tsx` with edit/delete actions
- [x] T046 [US2] Implement `frontend/src/pages/Categories/index.tsx` per `.specify/design/pages/categories.md` (stats cards, grid, new category button)

**Checkpoint**: Category CRUD fully functional — US2 independently testable

---

## Phase 4: User Story 3 & 5 — Transactions (Priority: P3 + P5)

**Goal**: Users record income/expenses and browse/filter/paginate all transactions

**Independent Test**: Create expense via modal, list on transactions page, filter by type, edit, delete, paginate

### Implementation for User Story 3 & 5

- [x] T047 [US3] Add Transaction model and TransactionType enum to `backend/prisma/schema.prisma`; run `prisma migrate dev --name add_transaction`
- [x] T048 [P] [US3] Create `backend/src/models/transaction.model.ts` and `backend/src/dtos/input/transaction.input.ts`
- [x] T049 [P] [US3] Create `backend/src/dtos/output/transaction.output.ts` (PaginatedTransactions type)
- [x] T050 [US3] Implement `backend/src/services/transaction.service.ts` (CRUD, userId ownership, category ownership validation, amount > 0)
- [x] T051 [US3] Implement `backend/src/resolvers/transaction.resolver.ts` (listTransactions with search/type/categoryId/month/year/page/limit, getTransaction, create, update, delete)
- [x] T052 [P] [US3] Register TransactionResolver in `backend/src/index.ts`
- [x] T053 [P] [US3] Create `frontend/src/lib/graphql/queries/Transactions.ts` (listTransactions, getTransaction)
- [x] T054 [P] [US3] Create `frontend/src/lib/graphql/mutations/Transaction.ts` (create, update, delete)
- [x] T055 [P] [US3] Implement `frontend/src/components/TransactionFormDialog.tsx` per `.specify/design/pages/transaction-form-modal.md` (expense/income toggle, BRL mask, category select)
- [x] T056 [P] [US5] Implement `frontend/src/pages/Transactions/components/TransactionFilters.tsx` (search, type, category, period selects)
- [x] T057 [P] [US5] Implement `frontend/src/pages/Transactions/components/TransactionTable.tsx` and `TransactionRow.tsx`
- [x] T058 [US5] Implement `frontend/src/pages/Transactions/index.tsx` per `.specify/design/pages/transactions.md` (table, pagination, new transaction button)

**Checkpoint**: Transaction CRUD + filters + pagination — US3 and US5 independently testable

---

## Phase 5: User Story 4 — Financial Dashboard (Priority: P4)

**Goal**: Dashboard shows balance, monthly totals, recent transactions, category breakdown

**Independent Test**: With existing transactions, dashboard cards and lists show correct calculated values for current month

### Implementation for User Story 4

- [x] T059 [US4] Create `backend/src/dtos/output/dashboard.output.ts` (DashboardSummary, CategoryBreakdownItem)
- [x] T060 [US4] Implement `backend/src/services/dashboard.service.ts` (monthlyIncome, monthlyExpenses, balance, recentTransactions limit 5, categoryBreakdown limit 5)
- [x] T061 [US4] Implement `backend/src/resolvers/dashboard.resolver.ts` (getDashboardSummary query)
- [x] T062 [P] [US4] Register DashboardResolver in `backend/src/index.ts`
- [x] T063 [P] [US4] Create `frontend/src/lib/graphql/queries/Dashboard.ts` (getDashboardSummary)
- [x] T064 [P] [US4] Implement `frontend/src/components/SummaryCard.tsx` reusable component
- [x] T065 [P] [US4] Implement `frontend/src/components/TransactionListItem.tsx` and `CategorySummaryItem.tsx`
- [x] T066 [US4] Implement `frontend/src/pages/Dashboard/index.tsx` per `.specify/design/pages/dashboard.md` (3 summary cards, recent list, category sidebar, new transaction trigger)

**Checkpoint**: Dashboard aggregates match transaction data — US4 independently testable

---

## Phase 6: User Story 6 — Profile Management (Priority: P6)

**Goal**: Users view profile, update name, sign out

**Independent Test**: Update name on profile page, see change in header; sign out redirects to login

### Implementation for User Story 6

- [x] T067 [P] [US6] Create `backend/src/dtos/input/user.input.ts` (UpdateProfileInput)
- [x] T068 [US6] Implement `backend/src/services/user.service.ts` (updateProfile for authenticated user)
- [x] T069 [US6] Implement `backend/src/resolvers/user.resolver.ts` (getProfile, updateProfile with IsAuth)
- [x] T070 [P] [US6] Register UserResolver in `backend/src/index.ts`
- [x] T071 [P] [US6] Create `frontend/src/lib/graphql/queries/Profile.ts` and `frontend/src/lib/graphql/mutations/Profile.ts`
- [x] T072 [US6] Implement `frontend/src/pages/Profile/index.tsx` per `.specify/design/pages/profile.md` (avatar, readonly email, save name, sign out)
- [x] T073 [US6] Wire avatar click in `frontend/src/components/Header.tsx` to navigate `/profile`

**Checkpoint**: Profile update and logout work — US6 independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Seed data, empty states, feedback, responsive layout, validation guide

- [x] T074 [P] Implement `backend/prisma/seed.ts` with demo user, categories, and sample transactions
- [x] T075 [P] Add empty states to `frontend/src/pages/Dashboard/index.tsx`, `Transactions/index.tsx`, `Categories/index.tsx`
- [x] T076 [P] Add toast notifications (sonner) for success/error feedback across forms
- [x] T077 [P] Add responsive breakpoints to Dashboard, Transactions, Categories grids per design docs
- [x] T078 Verify all pages match Figma specs in `.specify/design/pages/` (visual review)
- [x] T079 Run validation scenarios from `specs/001-financy-app/quickstart.md` end-to-end
- [x] T080 Update root `README.md` with setup instructions for backend and frontend

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories**
- **US2 Categories (Phase 3)**: Depends on Foundational (auth required)
- **US3/US5 Transactions (Phase 4)**: Depends on US2 (categories needed for transaction form)
- **US4 Dashboard (Phase 5)**: Depends on US3 (needs transaction data to aggregate)
- **US6 Profile (Phase 6)**: Depends on Foundational only (can parallel with US2–US5)
- **Polish (Phase 7)**: Depends on all desired user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 (Auth) | Foundational phase | — (delivered in Phase 2) |
| US2 (Categories) | Foundational | US6 (Profile) after Phase 2 |
| US3 (Transactions) | US2 | — |
| US4 (Dashboard) | US3 | — |
| US5 (Transaction list) | US3 | Delivered with US3 in Phase 4 |
| US6 (Profile) | Foundational | US2, US3 (after Phase 2) |

### Within Each Phase

- Prisma migrations before services
- Services before resolvers
- Resolvers registered before frontend GraphQL operations
- GraphQL operations before page components
- Shared components before page assembly

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch in parallel after T013:
T015: backend/src/utils/hash.ts
T016: backend/src/utils/jwt.ts
T017: backend/src/models/user.model.ts
T018: backend/src/dtos/input/auth.input.ts
T019: backend/src/dtos/output/auth.output.ts

# Launch in parallel after T025:
T026: frontend/src/types/index.ts
T027: frontend/src/lib/graphql/apollo.ts
T028: frontend/src/lib/graphql/mutations/Login.ts + Register.ts
T030: frontend/src/assets/
T033: frontend/src/pages/Auth/Login.tsx
T034: frontend/src/pages/Auth/Signup.tsx
```

---

## Parallel Example: Phase 3 (US2)

```bash
T037: backend/src/models/category.model.ts
T038: backend/src/dtos/input/category.input.ts
T042: frontend/src/lib/graphql/queries/Categories.ts
T043: frontend/src/lib/graphql/mutations/Category.ts
T044: frontend/src/components/CategoryFormDialog.tsx
T045: frontend/src/pages/Categories/components/CategoryCard.tsx
```

---

## Implementation Strategy

### MVP First (US1 only — Phase 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. **STOP and VALIDATE**: Register, login, logout, protected routes
4. Demo authentication flow

### Incremental Delivery

1. Setup + Foundational → Auth working (MVP)
2. Add US2 Categories → Test independently
3. Add US3/US5 Transactions → Test independently
4. Add US4 Dashboard → Test independently
5. Add US6 Profile → Test independently
6. Polish → Full quickstart validation

### Suggested MVP Scope

**Phases 1–2** (T001–T035): Authentication only — 35 tasks

**Full feature**: Phases 1–7 (T001–T080) — 80 tasks

---

## Notes

- Reference Mindshare patterns: `ftr-pos-360-mindshare/backend` and `frontend`
- Design specs: `.specify/design/style-guide.md` and `.specify/design/pages/`
- GraphQL contract: `specs/001-financy-app/contracts/graphql-schema.graphql`
- All category/transaction operations MUST filter by authenticated userId
- Commit after each phase checkpoint
