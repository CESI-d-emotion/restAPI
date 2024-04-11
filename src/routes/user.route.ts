import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

export class UserRouter implements IRouter {
  public path: string = '/users'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET
    this.router.get(this.path, UserController.getUsers)
    // POST
    this.router.post(this.path + '/create', UserController.signup)
  }
}
