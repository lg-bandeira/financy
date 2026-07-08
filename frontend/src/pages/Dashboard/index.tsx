import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client/react"
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Wallet,
} from "lucide-react"
import { Link } from "react-router-dom"
import { CategoryTag } from "@/components/CategoryTag"
import { SummaryCard } from "@/components/SummaryCard"
import { TransactionFormDialog } from "@/components/TransactionFormDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GET_DASHBOARD_SUMMARY } from "@/lib/graphql/queries/dashboard"
import {
  formatCurrency,
  formatDate,
  getCategoryColorClasses,
  getCategoryIcon,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type { DashboardSummary } from "@/types"

export function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const now = new Date()

  const { data, loading, refetch } = useQuery<{
    getDashboardSummary: DashboardSummary
  }>(GET_DASHBOARD_SUMMARY, {
    variables: {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  })

  useEffect(() => {
    void refetch()
  }, [refetch])

  const summary = data?.getDashboardSummary

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(summary?.balance ?? 0)}
          icon={Wallet}
          iconClassName="bg-cat-purple-light"
          iconColorClassName="text-cat-purple-base"
        />
        <SummaryCard
          label="Monthly Income"
          value={formatCurrency(summary?.monthlyIncome ?? 0)}
          icon={CircleArrowUp}
          iconClassName="bg-cat-green-light"
          iconColorClassName="text-success"
        />
        <SummaryCard
          label="Monthly Expenses"
          value={formatCurrency(summary?.monthlyExpenses ?? 0)}
          icon={CircleArrowDown}
          iconClassName="bg-cat-red-light"
          iconColorClassName="text-danger"
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 px-6 pb-4 pt-6">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Recent Transactions
            </CardTitle>
            <Link
              to="/transactions"
              className="flex items-center gap-0.5 text-sm font-medium text-brand-base hover:underline"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            {summary?.recentTransactions?.length ? (
              <div className="divide-y divide-gray-100">
                {summary.recentTransactions.map((transaction) => {
                  const category = transaction.category
                  const Icon = category
                    ? getCategoryIcon(category.icon)
                    : Wallet
                  const colors = category
                    ? getCategoryColorClasses(category.color)
                    : null
                  const isIncome = transaction.type === "INCOME"

                  return (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-x-4"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:row-span-1",
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

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {transaction.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>

                      {category ? (
                        <CategoryTag
                          name={category.name}
                          color={category.color}
                          className="col-span-2 w-fit sm:col-span-1 sm:justify-self-start"
                        />
                      ) : (
                        <span className="hidden sm:block" />
                      )}

                      <div className="col-span-2 flex items-center justify-end gap-1.5 sm:col-span-1">
                        <span className="whitespace-nowrap text-sm font-semibold text-gray-800">
                          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                        </span>
                        {isIncome ? (
                          <CircleArrowUp className="h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 shrink-0 text-danger" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No transactions recorded yet.
              </p>
            )}

            <div className="mt-4 border-t border-gray-100 pt-4">
              <Button
                variant="outline"
                className="h-11 w-full gap-2 border-gray-200 bg-white font-medium text-brand-base hover:bg-gray-50 hover:text-brand-dark"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                New transaction
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 px-6 pb-4 pt-6">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Categories
            </CardTitle>
            <Link
              to="/categories"
              className="flex items-center gap-0.5 text-sm font-medium text-brand-base hover:underline"
            >
              Manage
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            {summary?.categoryBreakdown?.length ? (
              <div className="divide-y divide-gray-100">
                {summary.categoryBreakdown.map((item) => (
                  <div
                    key={item.category.id}
                    className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <CategoryTag
                        name={item.category.name}
                        color={item.category.color}
                      />
                      <span className="whitespace-nowrap text-sm text-gray-500">
                        {item.itemCount} {item.itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-gray-800">
                      {formatCurrency(item.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                No categories registered.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => void refetch()}
      />
    </div>
  )
}
