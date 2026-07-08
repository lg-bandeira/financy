# Quickstart: Financy Validation Guide

**Date**: 2026-07-08

End-to-end validation scenarios for the Financy feature. Run after implementation phases
complete. See [data-model.md](./data-model.md) and [contracts/graphql-schema.graphql](./contracts/graphql-schema.graphql) for details.

## Prerequisites

- Node.js 20+
- Backend and frontend dependencies installed
- Environment files configured from `.env.example`

```bash
# Backend
cd backend
cp .env.example .env
# Set JWT_SECRET=your-secret
npm install
npx prisma migrate dev
npm run seed        # optional demo data
npm run dev         # http://localhost:4000/graphql

# Frontend (separate terminal)
cd frontend
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:4000/graphql
npm install
npm run dev         # http://localhost:5173
```

## Scenario 1: Registration & Login (US1)

1. Open `http://localhost:5173/login`
2. Click "Criar conta"
3. Register: name, email, password (8+ chars)
4. **Expected**: Redirect to dashboard, avatar visible in header
5. Sign out from profile page
6. Sign in with same credentials
7. **Expected**: Dashboard loads; protected routes inaccessible when logged out

## Scenario 2: Category CRUD (US2)

1. Navigate to `/categories`
2. Click "+ Nova categoria"
3. Fill: title "Alimentação", description, select `Utensils` icon, blue color → Salvar
4. **Expected**: Card appears in grid with correct tag color and "0 itens"
5. Edit category → change description → Salvar
6. **Expected**: Updated description visible
7. Create a second category, then delete it (no transactions)
8. **Expected**: Card removed

## Scenario 3: Transaction CRUD (US3)

1. Ensure at least one category exists
2. From dashboard, click "+ Nova transação"
3. Select Despesa, fill description, date, R$ 45,80, category → Salvar
4. **Expected**: Transaction appears in dashboard recent list
5. Navigate to `/transactions`
6. **Expected**: Transaction in table with correct type, amount, category tag
7. Edit transaction → change amount → Salvar
8. **Expected**: Updated amount in table and dashboard
9. Delete transaction
10. **Expected**: Removed from all views

## Scenario 4: Dashboard Summary (US4)

1. Create mix of INCOME and EXPENSE transactions in current month
2. Open `/` (dashboard)
3. **Expected**:
   - Saldo Total = receitas − despesas do mês
   - Receitas do Mês = sum of INCOME
   - Despesas do Mês = sum of EXPENSE
   - Up to 5 recent transactions listed
   - Category breakdown shows top expense categories

## Scenario 5: Transaction Filters (US5)

1. Create 15+ transactions across types/categories/months
2. Open `/transactions`
3. Search by description keyword
4. **Expected**: Only matching rows shown
5. Filter by type "Entrada"
6. **Expected**: Only INCOME transactions
7. Filter by category and period
8. **Expected**: Combined filters apply correctly
9. Navigate pagination
10. **Expected**: Range text updates (e.g., "11 a 20 | 27 resultados")

## Scenario 6: Profile (US6)

1. Click avatar → `/profile`
2. **Expected**: Name and email displayed; email field disabled
3. Change name → Salvar
4. **Expected**: Header avatar initials update
5. Click "Sair da conta"
6. **Expected**: Redirect to login

## Scenario 7: Data Isolation (SC-003)

1. Register User A, create category + transaction
2. Register User B in incognito window
3. **Expected**: User B sees empty data; cannot access User A resources
4. (Optional) Attempt GraphQL query with User A's resource IDs using User B's token
5. **Expected**: Error or empty result — no cross-user data

## Scenario 8: Category Delete Protection (FR-008)

1. Create category with linked transaction
2. Attempt to delete category
3. **Expected**: Error message; category remains

## Scenario 9: Visual Fidelity (SC-006)

Compare each page/modal against `.specify/design/pages/`:
- Login, Signup, Dashboard, Transactions, Categories, Profile
- Transaction form modal, Category form modal

**Expected**: Layout, colors (brand `#1F6F43`), typography (Inter), and components match Figma.

## GraphQL Playground Checks

With valid JWT in Authorization header:

```graphql
query { getDashboardSummary { monthlyIncome monthlyExpenses balance } }
query { listCategories { id name color icon transactionCount } }
query { listTransactions(page: 1, limit: 10) { total items { title amount type } } }
```

**Expected**: All return data scoped to authenticated user only.
