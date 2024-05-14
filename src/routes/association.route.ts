import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { AssociationController } from '../controllers/association.controller'
import { requireAssociation, requireUser } from '../helpers/jwt.helper'

export class AssociationRouter implements IRouter {
  public path: string = '/asso'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET : Route pour récupérer toutes les associations
    this.router.get(this.path, AssociationController.getAssociation)

    // WhoAmI asso
    this.router.get(this.path + '/whoami', requireUser, AssociationController.whoami)

    // GET : Route pour récupérer une association par ID
    this.router.get(
      `${this.path}/searchById/:associationId`,
      AssociationController.getAssociationById
    )

    // GET : Route pour rechercher des associations par nom ou description
    this.router.post(
      `${this.path}/search`,
      AssociationController.filterSearchAsso
    )

    // DELETE : Route pour supprimer une association par ID
    this.router.delete(
      `${this.path}/:associationId`,
      requireUser,
      AssociationController.deleteAssociationById
    )

    // POST : Route pour s'inscrire en tant qu'association
    this.router.post(this.path + '/signup', AssociationController.signup)

    // POST : Route pour se connecter en tant qu'association
    this.router.post(this.path + '/login', AssociationController.login)
  }
}
