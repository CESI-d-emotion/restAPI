import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { RessourceController } from '../controllers/ressource.controller'
import { requireAssociation, requireRessource } from '../helpers/jwt.helper'
import { AssociationController } from '../controllers/association.controller'

export class RessourceRouter implements IRouter {
  public path: string = '/ressource'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET : Route pour récupérer toutes les ressources
    this.router.get(this.path, RessourceController.getRessource)

    // GET : Route pour récupérer une ressource par ID
    this.router.get(
      `${this.path}/searchById/:ressourceId`,
      RessourceController.getRessourceById
    )

    // GET : Route pour rechercher des ressources par titre ou content
    this.router.get(
      `${this.path}/search/:keyword`,
      RessourceController.searchRessource
    )

    // DELETE : Route pour supprimer une ressource par ID
    this.router.delete(
      `${this.path}/:ressourceId`,
      requireAssociation,
      RessourceController.deleteRessourceById
    )

    // POST : Route pour créer une ressource
    this.router.post(this.path + '/createPost',
     requireAssociation,
     RessourceController.createRessource)

  }
}
