import { PrismaClient, CategoryColor, TransactionType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'demo@financy.com'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Seed already executed')
    return
  }

  const password = await bcrypt.hash('demo12345', 10)
  const user = await prisma.user.create({
    data: {
      name: 'Demo Account',
      email,
      password,
    },
  })

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food',
        description: 'Restaurants, delivery and meals',
        icon: 'Utensils',
        color: CategoryColor.blue,
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Salary',
        description: 'Monthly income',
        icon: 'Briefcase',
        color: CategoryColor.green,
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transport',
        description: 'Gas and transportation',
        icon: 'Car',
        color: CategoryColor.purple,
        userId: user.id,
      },
    }),
  ])

  const now = new Date()
  await prisma.transaction.createMany({
    data: [
      {
        title: 'Salary Payment',
        amount: 4250,
        type: TransactionType.INCOME,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        userId: user.id,
        categoryId: categories[1].id,
      },
      {
        title: 'Restaurant lunch',
        amount: 45.8,
        type: TransactionType.EXPENSE,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        userId: user.id,
        categoryId: categories[0].id,
      },
      {
        title: 'Uber to work',
        amount: 28.5,
        type: TransactionType.EXPENSE,
        date: new Date(now.getFullYear(), now.getMonth(), 7),
        userId: user.id,
        categoryId: categories[2].id,
      },
    ],
  })

  console.log('Seed completed: demo@financy.com / demo12345')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
