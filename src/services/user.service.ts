import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'
import { db } from '../helpers/db.helper'
import { User } from '../entities/user.entity'
import { createToken } from '../helpers/jwt.helper'
import { decryptPassword } from '../helpers/password.helper'

export class UserService {
  private static userRepo = db.users

  static async getUsers() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const users = await this.userRepo.findMany()

      cache.put('data', users, 6000)
      return users
    }
  }

  static async createUser(user: User) {
    const result = await this.userRepo.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        region: { connect: { id: user.regionId } },
        userRole: { connect: { id: user.userRoleId } }
      }
    })
    return createToken(result.id, result.email)
  }

  static async login(email: string, password: string) {
    const user = await this.userRepo.findFirst({
      where: { email }
    })

    if (!user) {
      return null
    }

    const matchPass = await decryptPassword(password, user.password)
    if (!matchPass) {
      return null
    }
    return createToken(user.id, user.email)
  }

  static async deleteUserById(userId: number): Promise<void> {
    await this.userRepo.delete(userId)
  }

}
