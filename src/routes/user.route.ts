import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { requireUser } from '../helpers/jwt.helper'

export class UserRouter implements IRouter {
  public path: string = '/users'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET
    this.router.get(this.path, UserController.getUsers)
    this.router.delete(
      `${this.path}/:userId`,
      requireUser,
      UserController.deleteUserById
    )
    this.router.get(`${this.path}/:userId`, UserController.getUserById)
    this.router.get(
      `${this.path}/followAction/:assoId`,
      requireUser,
      UserController.followAction
    )
    // POST
    this.router.post(this.path + '/signup', UserController.signup)
    this.router.post(this.path + '/login', UserController.login)
  }
}
