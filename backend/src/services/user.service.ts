import { prismaClient } from '../../prisma/prisma'
import { UpdateProfileInput } from '../dtos/input/user.input'

export class UserService {
  async getProfile(userId: string) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    return user
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    if (!data.name?.trim()) throw new Error('Name is required')
    return prismaClient.user.update({
      where: { id: userId },
      data: { name: data.name },
    })
  }
}
