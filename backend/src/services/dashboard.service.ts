import { TransactionType } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma'

export class DashboardService {
  async getSummary(userId: string, month?: number, year?: number) {
    const now = new Date()
    const m = month ?? now.getMonth() + 1
    const y = year ?? now.getFullYear()
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0, 23, 59, 59, 999)

    const monthFilter = { userId, date: { gte: start, lte: end } }

    const [incomeAgg, expenseAgg, recentTransactions, categories] =
      await Promise.all([
        prismaClient.transaction.aggregate({
          where: { ...monthFilter, type: TransactionType.INCOME },
          _sum: { amount: true },
        }),
        prismaClient.transaction.aggregate({
          where: { ...monthFilter, type: TransactionType.EXPENSE },
          _sum: { amount: true },
        }),
        prismaClient.transaction.findMany({
          where: { userId },
          include: { category: true },
          orderBy: { date: 'desc' },
          take: 5,
        }),
        prismaClient.category.findMany({
          where: { userId },
          include: {
            transactions: {
              select: { amount: true },
            },
          },
        }),
      ])

    const monthlyIncome = Number(incomeAgg._sum.amount ?? 0)
    const monthlyExpenses = Number(expenseAgg._sum.amount ?? 0)

    const categoryBreakdown = categories
      .map((category) => {
        const { transactions, ...categoryData } = category
        const totalAmount = transactions.reduce(
          (sum, transaction) => sum + Number(transaction.amount),
          0
        )

        return {
          category: categoryData,
          itemCount: transactions.length,
          totalAmount,
        }
      })
      .sort((a, b) => {
        if (b.totalAmount !== a.totalAmount) return b.totalAmount - a.totalAmount
        return a.category.name.localeCompare(b.category.name, 'en')
      })

    return {
      monthlyIncome,
      monthlyExpenses,
      balance: monthlyIncome - monthlyExpenses,
      recentTransactions: recentTransactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
      categoryBreakdown,
    }
  }
}
