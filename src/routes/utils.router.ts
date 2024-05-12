import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { UtilsController } from '../controllers/utils.controller'

export class UtilsRouter implements IRouter {
  public path: string = '/utils'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // Get
    this.router.get(`${this.path}/roles`, UtilsController.getRoles)
    this.router.get(`${this.path}/typepost`, UtilsController.getTypesPost)
    this.router.get(`${this.path}/region`, UtilsController.getRegions)
  }
}