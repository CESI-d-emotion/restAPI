import { Request, Response } from 'express'
import { UserResponse } from '../dto/user.dto'
import { UserService } from '../services/user.service'
import { User, UserLoginInput } from '../entities/user.entity'
import { encryptPassword } from '../helpers/password.helper'
import { maxAge } from '../helpers/jwt.helper'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'

export class UserController {
  static async getUsers(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<UserResponse>> {
    try {
      const result = await UserService.getUsers()
      return res.status(200).json(toResponseDTO<UserResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  static async signup(
    req: Request<{}, {}, User>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const input = req.body
      if (input.password !== input.passwordConfirmation) {
        return res.status(400).json({
          error: 400,
          message: 'Passwords do not match'
        })
      }

      input.password = await encryptPassword(input.password)

      const result = await UserService.createUser(input)
      res.cookie('jwt', result, { httpOnly: true, maxAge: maxAge * 1000 })
      return res
        .status(200)
        .json(toResponseDTO<SingleMessageDTO>('User created successfully', 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during signup'
      })
    }
  }

  static async login(
    req: Request<{}, {}, UserLoginInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
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
      res
        .status(200)
        .json(toResponseDTO<SingleMessageDTO>('User logged in!', 200))
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
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const userId: number = parseInt(req.params.userId)

      if (userId == 0) {
        return res.status(400).json({
          message: 'Id utilisateur vide'
        })
      }

      const user = await UserService.getUserById(userId)
      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        })
      }
      //TODO Si le user existe, verifier que le user connecte est le user a supprimer ou admin

      await UserService.deleteUserById(userId)

      return res
        .status(200)
        .json(toResponseDTO<SingleMessageDTO>('User has been deleted', 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during deleteUserById'
      })
    }
  }

  static async getUserById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<UserResponse>> {
    const userId: number = parseInt(req.params.userId)

    if (userId == 0) {
      return res.status(400).json({
        message: 'Id utilisateur vide'
      })
    }

    try {
      const result = await UserService.getUserById(userId)
      return res.status(200).json(toResponseDTO<UserResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }
}
