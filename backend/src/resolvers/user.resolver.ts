import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UserModel } from '../models/user.model'
import { UpdateProfileInput } from '../dtos/input/user.input'
import { UserService } from '../services/user.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private userService = new UserService()

  @Query(() => UserModel)
  async getProfile(@GqlUser() user: UserModel): Promise<UserModel> {
    return this.userService.getProfile(user.id)
  }

  @Mutation(() => UserModel)
  async updateProfile(
    @GqlUser() user: UserModel,
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput
  ): Promise<UserModel> {
    return this.userService.updateProfile(user.id, data)
  }
}
