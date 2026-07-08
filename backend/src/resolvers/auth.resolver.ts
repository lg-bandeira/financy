import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { AuthPayload } from '../dtos/output/auth.output'
import { AuthService } from '../services/auth.service'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => AuthPayload)
  async login(@Arg('data', () => LoginInput) data: LoginInput): Promise<AuthPayload> {
    return this.authService.login(data)
  }

  @Mutation(() => AuthPayload)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<AuthPayload> {
    return this.authService.register(data)
  }
}
