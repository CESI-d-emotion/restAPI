import { Request, Response } from 'express'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import { RessourceResponse } from '../dto/ressource.dto'
import {
  dbRessource,
  IFilterSearchRessourceRequest,
  Ressource,
  ressourceCreateInput
} from '../entities/ressource.entity'
import { RessourceService } from '../services/ressource.service'
import { associationRegisterInput } from '../entities/association.entity'
import { encryptPassword } from '../helpers/password.helper'
import { AssociationService } from '../services/association.service'
import { maxAge } from '../helpers/jwt.helper'
import { UserService } from '../services/user.service'
import { UserController } from './user.controller'

export class RessourceController {
  // Méthode pour récupérer toutes les ressources
  static async getRessource(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse>> {
    try {
      const result = await RessourceService.getRessource()
      return res.status(200).json(toResponseDTO<RessourceResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  // Méthode pour supprimer une ressource par ID
  static async deleteRessourceById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    const connectedUser = res.locals.user
    if (!connectedUser) {
      return res.status(400).json({
        error: 400,
        message: 'Not authorized'
      })
    }

    try {
      const ressourceId: number = parseInt(req.params.ressourceId)

      // Vérifie si l'ID de la ressource est valide
      if (isNaN(ressourceId) || ressourceId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Ressource Id'
        })
      }

      // Récupérer la ressource par ID
      const ressource = await RessourceService.getRessourceById(ressourceId)
      if (!ressource) {
        return res.status(404).json({
          error: 404,
          message: 'Ressource not found'
        })
      }

      // Check if user is admin or author
      if (
        connectedUser.entity == 'isassociation' &&
        connectedUser.id !== ressource.authorId
      ) {
        return res.status(400).json({
          error: 404,
          message: 'You do not have the rights to execute this operation'
        })
      } else if (connectedUser.entity == 'isuser') {
        const user = await UserService.getUserById(connectedUser.id)
        if (!user || user.userRoleId !== 1) {
          return res.status(400).json({
            error: 404,
            message: 'You do not have the rights to execute this operation'
          })
        }
      }

      // Supprimer la ressource
      await RessourceService.deleteRessourceById(ressourceId)
      return res
        .status(200)
        .json(
          toResponseDTO<SingleMessageDTO>('Ressource has been deleted!', 200)
        )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during deleteRessourceById'
      })
    }
  }

  // Méthode pour récupérer une association par ID
  static async getRessourceById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse>> {
    try {
      const ressourceId: number = parseInt(req.params.ressourceId)

      // Vérifier si l'ID de la ressource est valide
      if (isNaN(ressourceId) || ressourceId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Ressource Id'
        })
      }

      // Récupérer la ressource par ID
      const result = await RessourceService.getRessourceById(ressourceId)
      if (!result) {
        return res.status(400).json({
          error: 400,
          message: 'Ressource not found'
        })
      }

      return res.status(200).json(toResponseDTO<RessourceResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching the ressource'
      })
    }
  }

  // Méthode pour rechercher des ressources par titre ou content
  static async searchRessource(
    req: Request<{}, {}, IFilterSearchRessourceRequest>,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse[]>> {
    const input = req.body
    const searchWord = input.keyword ? input.keyword : ''

    try {
      // Recherche des ressources correspondant au mot-clé
      const ressources = await RessourceService.searchRessources(
        input,
        searchWord
      )

      // const results = this.remapToResponse(ressources)

      return res.status(200).json(toResponseDTO<dbRessource[]>(ressources, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while searching ressources'
      })
    }
  }

  static async createRessource(
    req: Request<{}, {}, ressourceCreateInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    const asso = res.locals.user
    if (!asso)
      return res.status(401).json({
        error: 401,
        message: 'Not authorized'
      })

    try {
      const input = req.body

      const association = await AssociationService.getAssociationById(asso.id)
      if (!association || association.email !== asso.userEmail) {
        return res.status(400).json({
          error: 400,
          message: 'Association not found'
        })
      }

      // Créer la ressource
      await RessourceService.createRessource(input, asso.id)
      return res
        .status(200)
        .json(toResponseDTO<SingleMessageDTO>('post created successfully', 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during creation of post'
      })
    }
  }
}
