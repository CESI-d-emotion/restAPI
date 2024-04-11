import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'
import * as cache from 'memory-cache'
import { UserDto, UserResponse } from '../dto/user.dto'

export class UserController {
  static async getUsers(
    req: Request,
    res: Response
  ): Promise<any | UserDto<UserResponse>> {
    const data = cache.get('data')
    if (data) {
      console.log('Serving from cache')
      return res.status(200).json({
        data
      })
    } else {
      console.log('Serving from db')
      const userRepo = AppDataSource.getRepository(User)
      const users = await userRepo.find()

      cache.put('data', users, 6000)
      return res.status(200).json({
        data: users
      })
    }
  }
}
