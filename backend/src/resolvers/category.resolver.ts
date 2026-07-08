import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CategoryModel } from '../models/category.model'
import { CategoryStats } from '../dtos/output/dashboard.output'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CategoryService } from '../services/category.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    return this.categoryService.list(user.id)
  }

  @Query(() => CategoryStats)
  async getCategoryStats(@GqlUser() user: UserModel): Promise<CategoryStats> {
    return this.categoryService.getStats(user.id)
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @GqlUser() user: UserModel,
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput
  ): Promise<CategoryModel> {
    return this.categoryService.create(user.id, data)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput
  ): Promise<CategoryModel> {
    return this.categoryService.update(user.id, id, data)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return this.categoryService.delete(user.id, id)
  }
}
