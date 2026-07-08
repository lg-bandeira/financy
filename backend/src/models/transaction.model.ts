import { Field, GraphQLISODateTime, Float, ID, ObjectType, registerEnumType } from 'type-graphql'
import { TransactionType } from '@prisma/client'
import { CategoryModel } from './category.model'

registerEnumType(TransactionType, { name: 'TransactionType' })

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Float)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => String)
  categoryId!: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
