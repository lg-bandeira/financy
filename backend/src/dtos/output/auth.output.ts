import { Field, ObjectType } from 'type-graphql'
import { UserModel } from '../../models/user.model'

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string

  @Field(() => String)
  refreshToken!: string

  @Field(() => UserModel)
  user!: UserModel
}
