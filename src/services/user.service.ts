import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source'
import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'

export class UserService {
  static userRepo: Repository<User> = AppDataSource.getRepository(User)

  static async getUsers() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const users = await this.userRepo.find()

      cache.put('data', users, 6000)
      return users
    }
  }
}
