import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'
import { db } from '../helpers/db.helper'
import { Ressource } from '../entities/ressource.entity'

export class RessourceService {
  private static ressourceRepo = db.post

  /**
   * Récupère les ressources de la mémoire cache ou de la base de données
   * @returns une liste de ressources
   */
  static async getRessource() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const ressource = await this.ressourceRepo.findMany()
      cache.put('data', ressource, 6000)
      return ressource
    }
  }

  /**
   * Crée une nouvelle ressource dans la base de données
   * @param ressource les informations de la ressource à créer
   * @returns un token JWT
   */
  static async createRessource(ressource: Ressource) {
    const result = await this.ressourceRepo.create({
      data: {
        title: ressource.title,
        content: ressource.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        typePost:{connect:{ id: ressource.typePostId }},
        author: { connect: { id: ressource.associationId }}
      }
    })
    // TODO : CreateToken
  }

  /**
   * Supprime une ressource de la base de données
   * @param ressourceId l'ID de la ressource à supprimer
   */
  static async deleteRessourceById(ressourceId: number): Promise<void> {
    await this.ressourceRepo.delete({
      where: { id: ressourceId }
    })
  }

  /**
   * Récupère une ressource par son ID
   * @param ressourceId l'ID de la ressource à récupérer
   * @returns la ressource correspondante ou null si non trouvée
   */
  static async getRessourceById(ressourceId: number): Promise<any> {
    return this.ressourceRepo.findUnique({
      where: { id: ressourceId }
    })
  }

  /**
   * Recherche des ressources par non ou description
   * @param keyword le mot-clé de recherche
   * @returns une liste de ressources correspondant au mot-clé
   */
  static async searchRessources(keyword: string) {
    // Recherche les ressources dont le titre ou le content correspond au mot-clé
    const ressources = await this.ressourceRepo.findMany({
      where: {
        title:{
          contains:keyword
        },
        content:{
          contains:keyword
        }
      }
    })
    return ressources
  }

  /**
   * Trier les ressources par la date de création en ordre croissant
   * @returns une liste de ressources triées
   */
  static async triRessourcesByDateAsc(){
    // Récupérer les ressources triées par la date de création en ordre croissant
    const ressources = await this.ressourceRepo.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    return ressources
  }

  /**
   * Trier les ressouces par la date de création en ordre décroissant
   * @returns une liste de ressources triées
   */
  static async triRessourcesByDateDesc() {
    // Récupérer les ressources triées par la date de création en ordre décroissant
    const ressources = await this.ressourceRepo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return ressources
  }
}
