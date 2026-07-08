import { Field, InputType } from 'type-graphql'
import { TransactionType } from '@prisma/client'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string

  @Field(() => Number)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => Date)
  date!: Date

  @Field(() => String)
  categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Number, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}

@InputType()
export class ListTransactionsInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => Number, { nullable: true })
  month?: number

  @Field(() => Number, { nullable: true })
  year?: number

  @Field(() => Number, { defaultValue: 1 })
  page?: number

  @Field(() => Number, { defaultValue: 10 })
  limit?: number
}
