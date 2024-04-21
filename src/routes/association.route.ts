import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { AssociationController } from '../controllers/association.controller'
import { requireAssociation } from '../helpers/jwt.helper'

export class AssociationRouter implements IRouter {
  public path: string = '/asso'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET : Route pour récupérer toutes les associations
    this.router.get(this.path, AssociationController.getAssociation)

    // GET : Route pour récupérer une association par ID
    this.router.get(
      `${this.path}/:associationId`,
      AssociationController.getAssociationById
    )

    // GET : Route pour rechercher des associations par nom ou description
    this.router.get(
      `${this.path}/search/:keyword`,
      AssociationController.searchAssociations
    )

    // GET : Route pour trier les associations par ordre croissant
    this.router.get(
      this.path + '/associationAsc',
      AssociationController.triAssociationsByDateAsc
    )

    // GET : Route pour trier les associations par ordre décroissant
    this.router.get(
      this.path + '/associationDesc',
      AssociationController.triAssociationsByDateDesc
    )

    // DELETE : Route pour supprimer une association par ID
    this.router.delete(
      `${this.path}/:associationId`,
      requireAssociation,
      AssociationController.deleteAssociationById
    )

    // POST : Route pour s'inscrire en tant qu'association
    this.router.post(this.path + '/signup', AssociationController.signup)

    // POST : Route pour se connecter en tant qu'association
    this.router.post(this.path + '/login', AssociationController.login)

  }
}