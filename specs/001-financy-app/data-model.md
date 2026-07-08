# Data Model: Financy

**Date**: 2026-07-08

## Entity Relationship Diagram

```text
User 1──* Category
User 1──* Transaction
Category 1──* Transaction
```

## Prisma Schema (target)

```prisma
enum TransactionType {
  INCOME
  EXPENSE
}

enum CategoryColor {
  green
  blue
  purple
  pink
  red
  orange
  yellow
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  categories   Category[]
  transactions Transaction[]
}

model Category {
  id           String        @id @default(uuid())
  name         String
  description  String?
  icon         String
  color        CategoryColor
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
}

model Transaction {
  id          String          @id @default(uuid())
  title       String
  amount      Decimal         @db.Decimal(12, 2)
  type        TransactionType
  date        DateTime
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId  String
  category    Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([userId, date])
  @@index([userId, categoryId])
}
```

> `onDelete: Restrict` on `categoryId` prevents accidental cascade when category has
> transactions; service layer enforces FR-008 before delete attempt.

## Entity Details

### User

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Auto-generated |
| name | String | Required, min 1 char |
| email | String | Required, unique, valid email format |
| password | String | Required, bcrypt hash, min 8 chars plain text at registration |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**GraphQL exposure**: `password` field MUST NOT be returned in queries.

### Category

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Auto-generated |
| name | String | Required, unique per user |
| description | String? | Optional |
| icon | String | Required, Lucide icon name from predefined set |
| color | CategoryColor | Required, one of 7 Figma colors |
| userId | String | FK to User, set from authenticated context |

**Computed**: `transactionCount` via field resolver or query aggregation.

### Transaction

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Auto-generated |
| title | String | Required (description in UI) |
| amount | Decimal(12,2) | Required, > 0 |
| type | TransactionType | INCOME or EXPENSE |
| date | DateTime | Required |
| userId | String | FK to User, from auth context |
| categoryId | String | FK to Category, must belong to same user |

## Validation Rules (Service Layer)

| Rule | Entity | Error message (PT) |
|------|--------|-------------------|
| Email unique | User | E-mail já cadastrado! |
| Password min 8 | User | A senha deve ter no mínimo 8 caracteres |
| Name unique per user | Category | Categoria já existe! |
| Cannot delete in-use | Category | Categoria em uso por transações |
| Amount > 0 | Transaction | Valor deve ser maior que zero |
| Category ownership | Transaction | Categoria não encontrada |
| Resource ownership | All | Recurso não encontrado (generic for wrong userId) |

## Dashboard Aggregations

| Metric | Calculation |
|--------|-------------|
| monthlyIncome | SUM(amount) WHERE type=INCOME AND date in current month AND userId |
| monthlyExpenses | SUM(amount) WHERE type=EXPENSE AND date in current month AND userId |
| balance | monthlyIncome − monthlyExpenses |
| recentTransactions | ORDER BY date DESC, LIMIT 5 |
| categoryBreakdown | GROUP BY categoryId, COUNT(*), SUM(amount) for EXPENSE type, ORDER BY sum DESC, LIMIT 5 |

## Migration Strategy

1. `prisma migrate dev --name init` — User, Category, Transaction tables
2. Optional seed with demo data for development

## Indexes

- `Category`: unique `(userId, name)`
- `Transaction`: index `(userId, date)` for monthly filters and dashboard
- `Transaction`: index `(userId, categoryId)` for category breakdown
