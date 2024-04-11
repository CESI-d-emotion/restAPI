import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { AssociationController } from '../controllers/association.controller'

export class AssociationRouter implements IRouter {
  public router: Router = Router()
  public path: string = '/association'

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET
    this.router.get(this.path, AssociationController.getAssociations)
    // POST
    this.router.post(
      this.path + '/create',
      AssociationController.createAssociation
    )
  }
}
