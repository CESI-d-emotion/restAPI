import { Request, Response } from 'express'
import { UserResponse } from '../dto/user.dto'
import { UserService } from '../services/user.service'
import { User, UserLoginInput, userSignupInput } from '../entities/user.entity'
import { encryptPassword } from '../helpers/password.helper'
import { maxAge } from '../helpers/jwt.helper'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import { AssociationService } from '../services/association.service'
import test from 'node:test'

export class UserController {
  static async getUsers(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<UserResponse>> {
    try {
      const result = await UserService.getUsers()
      return res.status(200).json(toResponseDTO(result, 200, 'password'))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  static async signup(
    req: Request<{}, {}, userSignupInput>,
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
      res.cookie('jwt', result.token, { httpOnly: true, maxAge: maxAge * 1000 })
      return res.status(200).json(
        toResponseDTO(
          {
            token: result.token,
            identity: 'isuser',
            role: result.role,
            message: 'User created successfully'
          },
          200
        )
      )
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
      res.cookie('jwt', result.token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(200).json(
        toResponseDTO(
          {
            token: result.token,
            identity: 'isuser',
            role: result.role,
            message: 'OK'
          },
          200
        )
      )
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
      const connectedUser = res.locals.user

      const userAd = await UserService.getUserById(connectedUser.id)
      console.log('Connected: ', userAd)

      //verifier que le user connecte est le user a supprimer ou admin
      if (connectedUser.id === userId || userAd.userRoleId === 1) {
        //Verifier que le user existe
        if (userId == 0) {
          return res.status(400).json({
            message: 'Id utilisateur vide'
          })
        }

        const user = await UserService.getUserById(userId)
        console.log('user ', user)
        if (!user) {
          return res.status(404).json({
            message: 'Utilisateur non trouvé'
          })
        }

        await UserService.deleteUserById(userId)

        return res
          .status(200)
          .json(toResponseDTO<SingleMessageDTO>('User has been deleted', 200))
      } else {
        return res.status(401).json({
          message: 'non autorisé'
        })
      }
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
      return res.status(200).json(toResponseDTO<User>(result, 200, 'password'))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  static async followAction(req: Request, res: Response) {
    const assoId: number = parseInt(req.params.assoId)
    const connectedUser = res.locals.user

    try {
      // Check if asso exists
      const association = await AssociationService.getAssociationById(assoId)
      if (!association) {
        return res.status(401).json({
          error: 401,
          message: 'Association not found'
        })
      }

      // Check if user exists
      const user = await UserService.getUserById(connectedUser.id)
      if (!user) {
        return res.status(401).json({
          error: 401,
          message: 'Utilisateur non trouvé'
        })
      }
      await UserService.followAction(association.id, user.id)
      return res.status(200).json(toResponseDTO('Follow action OK', 200))
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  }

  static async whoami(req: Request, res: Response) {
    const connectedUser = res.locals.user
    if (!connectedUser) {
      return res.status(401).json({
        error: 401,
        message: 'Utilisateur whoami'
      })
    }

    try {
      const user = await UserService.getUserById(connectedUser.id)
      if (!user) {
        return res.status(404).json({
          code: 404,
          message: 'user not found'
        })
      }
      return res.status(200).json(toResponseDTO<User>(user, 200, 'password'))
    } catch (e) {
      return res.status(400).json({
        error: 400,
        message: 'Problem happened'
      })
    }
  }

  static async updateProfile(
    req: Request<
      {},
      {},
      { uid: number; firstName: string; lastName: string; email: string }
    >,
    res: Response
  ) {
    const connectedUser = res.locals.user
    if (!connectedUser) {
      return res.status(401).json(toResponseDTO('You must be connected', 401))
    }

    try {
      const { uid, firstName, lastName, email } = req.body
      const adminCheck = await UserService.getUserById(connectedUser.id)
      if (
        (!adminCheck && uid !== connectedUser.id) ||
        adminCheck.userRoleId !== 1
      ) {
        return res
          .status(401)
          .json(toResponseDTO('You do not have the rights', 401))
      }
      const user = await UserService.getUserById(uid)
      if (!user) {
        return res.status(404).json(toResponseDTO('User not found', 404))
      }
      await UserService.updateUser(user.id, firstName, lastName, email)
      return res.status(200).json(toResponseDTO('User updated', 200))
    } catch (err) {
      return res.status(500).json(toResponseDTO(err, 500))
    }
  }
}
