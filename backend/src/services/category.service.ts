import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

export class CategoryService {
  async list(userId: string) {
    const categories = await prismaClient.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
    return Promise.all(
      categories.map(async (category) => ({
        ...category,
        transactionCount: await prismaClient.transaction.count({
          where: { categoryId: category.id, userId },
        }),
      }))
    )
  }

  async getStats(userId: string) {
    const [totalCategories, totalTransactions, mostUsed] = await Promise.all([
      prismaClient.category.count({ where: { userId } }),
      prismaClient.transaction.count({ where: { userId } }),
      prismaClient.transaction.groupBy({
        by: ['categoryId'],
        where: { userId },
        _count: { categoryId: true },
        orderBy: { _count: { categoryId: 'desc' } },
        take: 1,
      }),
    ])

    let mostUsedCategory = null
    if (mostUsed.length > 0) {
      mostUsedCategory = await prismaClient.category.findFirst({
        where: { id: mostUsed[0].categoryId, userId },
      })
    }

    return { totalCategories, totalTransactions, mostUsedCategory }
  }

  async create(userId: string, data: CreateCategoryInput) {
    const existing = await prismaClient.category.findUnique({
      where: { userId_name: { userId, name: data.name } },
    })
    if (existing) throw new Error('Category already exists!')

    return prismaClient.category.create({
      data: { ...data, userId },
    })
  }

  async update(userId: string, id: string, data: UpdateCategoryInput) {
    await this.findOwned(userId, id)
    if (data.name) {
      const duplicate = await prismaClient.category.findFirst({
        where: { userId, name: data.name, NOT: { id } },
      })
      if (duplicate) throw new Error('Category already exists!')
    }
    return prismaClient.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.findOwned(userId, id)
    const count = await prismaClient.transaction.count({
      where: { categoryId: id, userId },
    })
    if (count > 0) throw new Error('Category is in use by transactions')

    await prismaClient.category.delete({ where: { id } })
    return true
  }

  async findOwned(userId: string, id: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) throw new Error('Category not found')
    return category
  }
}
