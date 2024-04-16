import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { HealthcheckController } from '../controllers/healthcheck.controller'
import { requireUser } from '../helpers/jwt.helper'

export class HealthCheckRouter implements IRouter {
  public router: Router = Router()
  public path: string = '/healthcheck'

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET
    this.router.get(`${this.path}/public`, HealthcheckController.publicCheck)
    this.router.get(`${this.path}/private`, requireUser, HealthcheckController.privateCheck)
    this.router.get(`${this.path}/launch/the/data/into/space/to/the/moon`, HealthcheckController.ignite)
  }
}