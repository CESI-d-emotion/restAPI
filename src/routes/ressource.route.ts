import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { RessourceController } from '../controllers/ressource.controller'
import { requireRessource } from '../helpers/jwt.helper'

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
      `${this.path}/:ressourceId`,
      RessourceController.getRessourceById
    )

    // GET : Route pour rechercher des ressources par titre ou content
    this.router.get(
      `${this.path}/search/:keyword`,
      RessourceController.searchRessource
    )

    // GET : Route pour trier les ressources par ordre croissant
    this.router.get(
      this.path + '/ressourcesAsc',
      RessourceController.triRessourcesByDateAsc
    )

    // GET : Route pour trier les ressources par ordre décroissant
    this.router.get(
      this.path + '/ressourcesDesc',
      RessourceController.triRessourcesByDateDesc
    )

    // DELETE : Route pour supprimer une ressource par ID
    this.router.delete(
      `${this.path}/:ressourceId`,
      requireRessource,
      RessourceController.deleteRessourceById
    )
  }
}
