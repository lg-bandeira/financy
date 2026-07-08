export type TransactionType = "INCOME" | "EXPENSE"

export type CategoryColor =
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  color: CategoryColor
  icon: string
  transactionCount?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  category?: Category | null
  createdAt?: string
  updatedAt?: string
}

export interface CategoryBreakdownItem {
  category: Category
  itemCount: number
  totalAmount: number
}

export interface DashboardSummary {
  balance: number
  monthlyExpenses: number
  monthlyIncome: number
  recentTransactions: Transaction[]
  categoryBreakdown: CategoryBreakdownItem[]
}

export interface CategoryStats {
  totalCategories: number
  totalTransactions: number
  mostUsedCategory?: Category | null
}

export interface PaginatedTransactions {
  items: Transaction[]
  total: number
  page: number
  limit: number
}

export interface ListTransactionsFilters {
  categoryId?: string
  limit?: number
  month?: number
  page?: number
  search?: string
  type?: TransactionType
  year?: number
}

export interface CreateCategoryInput {
  name: string
  description?: string
  color: CategoryColor
  icon: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  color?: CategoryColor
  icon?: string
}

export interface CreateTransactionInput {
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export interface UpdateTransactionInput {
  title?: string
  amount?: number
  type?: TransactionType
  date?: string
  categoryId?: string
}

export interface UpdateProfileInput {
  name: string
}

export interface AuthPayload {
  token: string
  refreshToken: string
  user: User
}
