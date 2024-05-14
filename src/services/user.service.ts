import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'
import { db } from '../helpers/db.helper'
import { User, userSignupInput } from '../entities/user.entity'
import { createToken } from '../helpers/jwt.helper'
import { decryptPassword } from '../helpers/password.helper'

export class UserService {
  private static userRepo = db.users
  private static userFollowRepo = db.userFollowAssociation

  static async getUsers() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const users = await this.userRepo.findMany({
        include: {
          userFollowAssociation: {
            select: {
              associationId: true
            }
          }
        }
      })

      cache.put('data', users, 6000)
      return users
    }
  }

  static async createUser(user: userSignupInput) {
    const result = await this.userRepo.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        region: { connect: { id: user.regionId } },
        userRole: { connect: { id: user.userRoleId ? user.userRoleId : 4 } }
      }
    })
    return createToken(result.id, result.email, 'isuser')
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
    return createToken(user.id, user.email, 'isuser')
  }

  static async deleteUserById(userId: number): Promise<void> {
    await this.userRepo.delete({
      where: { id: userId }
    })
  }

  static async getUserById(userId: number): Promise<any> {
    return this.userRepo.findUnique({
      where: { id: userId },
      include: {
        region: true,
        userRole: true,
        userFollowAssociation: {
          include: {
            association: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
  }

  static async followAction(associationId: number, userId: number) {
    const checkIfExists = await this.userFollowRepo.findFirst({
      where: {
        associationId,
        userId
      }
    })
    if (!checkIfExists) {
      // Create follow
      await this.userFollowRepo.create({
        data: {
          user: { connect: { id: userId } },
          association: { connect: { id: associationId } }
        }
      })
    } else {
      // Delete follow
      await this.userFollowRepo.delete({
        where: {
          id: checkIfExists.id
        }
      })
    }
  }

  static async updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    email: string
  ) {
    return this.userRepo.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email
      }
    })
  }
}
