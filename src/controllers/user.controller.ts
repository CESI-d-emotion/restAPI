import { Request, Response } from 'express'
import { UserDto, UserResponse } from '../dto/user.dto'
import { UserService } from '../services/user.service'
import { User } from '../entities/user.entity'
import { encryptPassword } from '../helpers/password.helper'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  static async getUsers(
    req: Request,
    res: Response
  ): Promise<any | UserDto<UserResponse>> {
    try {
      const result = await UserService.getUsers()
      return res.status(200).json({
        data: result
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  static async signup(req: Request<{}, {}, User>, res: Response) {
    try {
      const input = req.body
      if (input.password !== input.passwordConfirmation) {
        res.status(400).json({
          error: 400,
          message: 'Passwords do not match'
        })
      }

      input.password = await encryptPassword(input.password)

      const result = await UserService.createUser(input)
      res.status(200).json({
        data: result,
        message: 'User created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during signup'
      })
    }
  }
}
