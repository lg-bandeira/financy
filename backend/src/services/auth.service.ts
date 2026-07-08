import { prismaClient } from '../../prisma/prisma'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import { UserModel } from '../models/user.model'

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    })
    if (!existingUser) throw new Error('User not registered!')
    const compare = await comparePassword(data.password, existingUser.password)
    if (!compare) throw new Error('Invalid password!')
    return this.generateTokens(existingUser)
  }

  async register(data: RegisterInput) {
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) throw new Error('Email already registered!')

    const hash = await hashPassword(data.password)
    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    })
    return this.generateTokens(user)
  }

  generateTokens(user: UserModel) {
    const token = signJwt({ id: user.id, email: user.email }, '1d')
    const refreshToken = signJwt({ id: user.id, email: user.email }, '7d')
    return { token, refreshToken, user }
  }
}
