import { Request, Response } from 'express'
import { UserDto, UserResponse } from '../dto/user.dto'
import { UserService } from '../services/user.service'
import { User, UserLoginInput } from '../entities/user.entity'
import { encryptPassword } from '../helpers/password.helper'
import { maxAge } from '../helpers/jwt.helper'

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
      res.cookie('jwt', result, { httpOnly: true, maxAge: maxAge * 1000 })
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

  static async login(req: Request<{}, {}, UserLoginInput>, res: Response) {
    try {
      const { email, password } = req.body
      const result = await UserService.login(email, password)
      if (!result) {
        return res.status(401).json({
          error: 401,
          message: 'Incorrect email or password'
        })
      }
      res.cookie('jwt', result, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(200).json({
        data: result,
        message: 'User login successfully'
      })
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during login'
      })
    }
  }
  
  static async deleteUserById(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const userId: number = parseInt(req.params.userId);

      //TODO Verifier que le user existe
      //TODO Si le user existe, verifier que le user connecte est le user a supprimer ou admin

      await UserService.deleteUserById(userId);

      return res.status(200).json({
        data: 'Success',
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
       return res.status(500).json({
        error: error,
         message: 'An error occured during deleteUserById'
      });
    }
  }

}
