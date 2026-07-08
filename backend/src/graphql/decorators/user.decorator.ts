import { createParameterDecorator, ResolverData } from 'type-graphql'
import { GraphqlContext } from '../context'
import { UserModel } from '../../models/user.model'
import { prismaClient } from '../../../prisma/prisma'

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<UserModel> => {
      if (!context?.user) throw new Error('User not authenticated!')
      const user = await prismaClient.user.findUnique({
        where: { id: context.user },
      })
      if (!user) throw new Error('User not found')
      return user
    }
  )
}
