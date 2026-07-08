import { Field, ObjectType } from 'type-graphql'
import { TransactionModel } from '../../models/transaction.model'
import { CategoryModel } from '../../models/category.model'

@ObjectType()
export class PaginatedTransactions {
  @Field(() => [TransactionModel])
  items!: TransactionModel[]

  @Field(() => Number)
  total!: number

  @Field(() => Number)
  page!: number

  @Field(() => Number)
  limit!: number
}

@ObjectType()
export class CategoryBreakdownItem {
  @Field(() => CategoryModel)
  category!: CategoryModel

  @Field(() => Number)
  itemCount!: number

  @Field(() => Number)
  totalAmount!: number
}

@ObjectType()
export class DashboardSummary {
  @Field(() => Number)
  monthlyIncome!: number

  @Field(() => Number)
  monthlyExpenses!: number

  @Field(() => Number)
  balance!: number

  @Field(() => [TransactionModel])
  recentTransactions!: TransactionModel[]

  @Field(() => [CategoryBreakdownItem])
  categoryBreakdown!: CategoryBreakdownItem[]
}

@ObjectType()
export class CategoryStats {
  @Field(() => Number)
  totalCategories!: number

  @Field(() => Number)
  totalTransactions!: number

  @Field(() => CategoryModel, { nullable: true })
  mostUsedCategory?: CategoryModel | null
}
