import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'
import { db } from '../helpers/db.helper'
import {
  IFilterSearchRessourceRequest,
  Ressource,
  ressourceCreateInput
} from '../entities/ressource.entity'
import { createToken } from '../helpers/jwt.helper'

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
      const ressource = await this.ressourceRepo.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          },
          typePost: true
        }
      })
      cache.put('data', ressource, 6000)
      return ressource
    }
  }

  /**
   * Crée une nouvelle ressource dans la base de données
   * @param ressource les informations de la ressource à créer
   * @returns un token JWT
   */
  static async createRessource(
    ressource: ressourceCreateInput,
    authorId: number
  ) {
    const result = await this.ressourceRepo.create({
      data: {
        title: ressource.title,
        content: ressource.content,
        typePost: { connect: { id: ressource.typePostId } },
        author: { connect: { id: authorId } }
      }
    })
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
      where: { id: ressourceId },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        typePost: true
      }
    })
  }

  /**
   * Recherche des ressources par non ou description
   * @param keyword le mot-clé de recherche
   * @returns une liste de ressources correspondant au mot-clé
   */
  static async searchRessources(
    input: IFilterSearchRessourceRequest,
    searchWord: string
  ) {
    // Recherche les ressources dont le titre ou le content correspond au mot-clé
    const queryArgs = {
      where: {
        OR: [
          {
            title: {
              contains: '%' + searchWord + '%'
            },
            ...(input.authorId &&
              input.authorId !== 0 && { authorId: input.authorId }),
            ...(input.typePostId &&
              input.typePostId !== 0 && { typePostId: input.typePostId })
          },
          {
            content: {
              contains: '%' + searchWord + '%'
            },
            ...(input.authorId &&
              input.authorId !== 0 && { authorId: input.authorId }),
            ...(input.typePostId &&
              input.typePostId !== 0 && { typePostId: input.typePostId })
          }
        ]
      },
      orderBy: [
        {
          createdAt: input.sort
        }
      ]
    }

    console.log(queryArgs)

    const ressources = await this.ressourceRepo.findMany(queryArgs)
    return ressources
  }
}
