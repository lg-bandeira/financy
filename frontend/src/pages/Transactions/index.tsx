import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { CategoryTag } from "@/components/CategoryTag"
import { TransactionFormDialog } from "@/components/TransactionFormDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/category"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transaction"
import {
  formatCurrency,
  formatDate,
  getCategoryColorClasses,
  getCategoryIcon,
  getMonthYearLabel,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type {
  Category,
  ListTransactionsFilters,
  PaginatedTransactions,
  Transaction,
  TransactionType,
} from "@/types"

const PAGE_SIZE = 10

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 2) return [1, 2, 3]
  if (current >= total - 1) return [total - 2, total - 1, total]
  return [current - 1, current, current + 1]
}

export function TransactionsPage() {
  const now = new Date()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)

  const filters: ListTransactionsFilters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      month,
      year,
      search: search || undefined,
      type: typeFilter === "ALL" ? undefined : typeFilter,
      categoryId: categoryFilter === "ALL" ? undefined : categoryFilter,
    }),
    [page, month, year, search, typeFilter, categoryFilter]
  )

  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(
    LIST_CATEGORIES
  )

  const { data, loading, refetch } = useQuery<{
    listTransactions: PaginatedTransactions
  }>(LIST_TRANSACTIONS, {
    variables: { filters },
  })

  useEffect(() => {
    void refetch()
  }, [refetch])

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION)

  const transactions = data?.listTransactions
  const categories = categoriesData?.listCategories ?? []
  const total = transactions?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)
  const visiblePages = getVisiblePages(page, totalPages)

  const periodOptions = useMemo(() => {
    const options: { month: number; year: number; label: string }[] = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      options.push({
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        label: getMonthYearLabel(d.getMonth() + 1, d.getFullYear()),
      })
    }
    return options
  }, [now])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTransaction({ variables: { id: deleteTarget.id } })
      toast.success("Transaction deleted successfully!")
      setDeleteTarget(null)
      void refetch()
    } catch {
      toast.error("Could not delete the transaction.")
    }
  }

  const openCreate = () => {
    setEditingTransaction(null)
    setFormOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your financial transactions
          </p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New transaction
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by description"
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500">Type</Label>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value as TransactionType | "ALL")
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500">Period</Label>
              <Select
                value={`${month}-${year}`}
                onValueChange={(value) => {
                  const [m, y] = value.split("-").map(Number)
                  setMonth(m)
                  setYear(y)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem
                      key={`${option.month}-${option.year}`}
                      value={`${option.month}-${option.year}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4 text-right">Amount</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions?.items?.length ? (
                  transactions.items.map((transaction) => {
                    const category = transaction.category
                    const Icon = category
                      ? getCategoryIcon(category.icon)
                      : Tag
                    const colors = category
                      ? getCategoryColorClasses(category.color)
                      : null
                    const isIncome = transaction.type === "INCOME"

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                colors?.iconBg ?? "bg-gray-100"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-4 w-4",
                                  colors?.iconText ?? "text-gray-600"
                                )}
                              />
                            </div>
                            <span className="font-medium text-gray-800">
                              {transaction.title}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 pr-4 text-gray-600">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-4 pr-4">
                          {category ? (
                            <CategoryTag
                              name={category.name}
                              color={category.color}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 text-sm font-medium",
                              isIncome ? "text-success" : "text-danger"
                            )}
                          >
                            {isIncome ? (
                              <CircleArrowUp className="h-4 w-4" />
                            ) : (
                              <CircleArrowDown className="h-4 w-4" />
                            )}
                            {isIncome ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap py-4 pr-4 text-right font-semibold",
                            isIncome ? "text-success" : "text-danger"
                          )}
                        >
                          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-gray-200 bg-white hover:bg-gray-50"
                              onClick={() => setDeleteTarget(transaction)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-danger" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-gray-200 bg-white hover:bg-gray-50"
                              onClick={() => openEdit(transaction)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {start} to {end} | {total} results
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-gray-200 bg-white"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {visiblePages.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    pageNum !== page && "border-gray-200 bg-white"
                  )}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-gray-200 bg-white"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTransaction}
        onSuccess={() => void refetch()}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
