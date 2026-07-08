# Financy

Full-stack personal finance management application.

## Stack

| Layer | Technologies |
|-------|--------------|
| Backend | TypeScript, Express, Apollo Server, Type-GraphQL, Prisma, SQLite |
| Frontend | React, Vite, Apollo Client, TailwindCSS, Shadcn/ui, Zustand |

## Structure

```text
backend/    # GraphQL API (port 4000)
frontend/   # React SPA (port 5173)
specs/      # Specification and implementation plan
.specify/   # Constitution, design system (Figma)
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Set JWT_SECRET in .env
npm install
npx prisma migrate dev
npm run seed   # optional: creates demo account (see below)
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo account

After running `npm run seed` in the backend, you can sign in with:

| Field | Value |
|-------|-------|
| Email | `demo@financy.com` |
| Password | `demo12345` |

The seed creates a demo user with sample categories (Food, Salary, Transport) and transactions so you can explore the dashboard, transactions, and categories pages without manual setup.

## Documentation

- Constitution: `.specify/memory/constitution.md`
- Design (Figma): `.specify/design/`
- Spec: `specs/001-financy-app/spec.md`
- Plan: `specs/001-financy-app/plan.md`
- Validation: `specs/001-financy-app/quickstart.md`
