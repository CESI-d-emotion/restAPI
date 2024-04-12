import { Request, Response } from 'express'
import { UserDto, UserResponse } from '../dto/user.dto'
import { UserService } from '../services/user.service'

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
  static async deleteUserById(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const userId: number = parseInt(req.params.userId);

      await UserService.deleteUserById(userId);

      return res.status(200).json({
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
       return res.status(500).json({
        error: error.message
      });
    }
  }

}
