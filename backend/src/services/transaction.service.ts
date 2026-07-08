import { Prisma, TransactionType } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma'
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'

export class TransactionService {
  private mapTransaction(t: {
    id: string
    title: string
    amount: Prisma.Decimal
    type: TransactionType
    date: Date
    categoryId: string
    createdAt: Date
    updatedAt: Date
    category?: unknown
  }) {
    return {
      ...t,
      amount: Number(t.amount),
    }
  }

  async list(userId: string, filters: ListTransactionsInput) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 10
    const skip = (page - 1) * limit

    const where: Prisma.TransactionWhereInput = { userId }

    if (filters.search) {
      where.title = { contains: filters.search }
    }
    if (filters.type) {
      where.type = filters.type
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }
    if (filters.month && filters.year) {
      const start = new Date(filters.year, filters.month - 1, 1)
      const end = new Date(filters.year, filters.month, 0, 23, 59, 59, 999)
      where.date = { gte: start, lte: end }
    }

    const [items, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prismaClient.transaction.count({ where }),
    ])

    return {
      items: items.map((t) => this.mapTransaction(t)),
      total,
      page,
      limit,
    }
  }

  async getById(userId: string, id: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    })
    if (!transaction) throw new Error('Transação não encontrada')
    return this.mapTransaction(transaction)
  }

  async create(userId: string, data: CreateTransactionInput) {
    this.validateAmount(data.amount)
    await this.validateCategory(userId, data.categoryId)

    const transaction = await prismaClient.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        categoryId: data.categoryId,
        userId,
      },
      include: { category: true },
    })
    return this.mapTransaction(transaction)
  }

  async update(userId: string, id: string, data: UpdateTransactionInput) {
    await this.getById(userId, id)
    if (data.amount !== undefined) this.validateAmount(data.amount)
    if (data.categoryId) await this.validateCategory(userId, data.categoryId)

    const transaction = await prismaClient.transaction.update({
      where: { id },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        categoryId: data.categoryId,
      },
      include: { category: true },
    })
    return this.mapTransaction(transaction)
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id)
    await prismaClient.transaction.delete({ where: { id } })
    return true
  }

  private validateAmount(amount: number) {
    if (amount <= 0) throw new Error('Valor deve ser maior que zero')
  }

  private async validateCategory(userId: string, categoryId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Categoria não encontrada')
  }
}
