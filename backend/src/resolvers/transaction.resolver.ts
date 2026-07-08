import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { TransactionModel } from '../models/transaction.model'
import { PaginatedTransactions } from '../dtos/output/dashboard.output'
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { TransactionService } from '../services/transaction.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Query(() => PaginatedTransactions)
  async listTransactions(
    @GqlUser() user: UserModel,
    @Arg('filters', () => ListTransactionsInput, { nullable: true })
    filters?: ListTransactionsInput
  ): Promise<PaginatedTransactions> {
    return this.transactionService.list(user.id, filters ?? {})
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string
  ): Promise<TransactionModel> {
    return this.transactionService.getById(user.id, id)
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @GqlUser() user: UserModel,
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput
  ): Promise<TransactionModel> {
    return this.transactionService.create(user.id, data)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput
  ): Promise<TransactionModel> {
    return this.transactionService.update(user.id, id, data)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return this.transactionService.delete(user.id, id)
  }
}
