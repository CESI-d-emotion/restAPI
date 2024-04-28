import { Request, Response } from 'express'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import { RessourceResponse } from '../dto/ressource.dto'
import { dbRessource, Ressource } from '../entities/ressource.entity'
import { RessourceService } from '../services/ressource.service'

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
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse[]>> {
    try {
      // Récupère le mot-clé de la requête query
      const { keyword } = req.query

      // Vérifie si le mot clé est présent
      if (!keyword) {
        return res.status(400).json({
          error: 400,
          message: 'Keywork is required'
        })
      }

      // Recherche des ressources correspondant au mot-clé
      const ressources = await RessourceService.searchRessources(
        keyword.toString()
      )

      // const results = this.remapToResponse(ressources)

      return res
        .status(200)
        .json(toResponseDTO<dbRessource[]>(ressources, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while searching ressources'
      })
    }
  }

  // Méthode pour récupérer les ressources triées par la date de création en ordre croissant
  static async triRessourcesByDateAsc(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse[]>> {
    try {
      // Appeler le service pour récupérer les ressources triées
      const sortedRessources = await RessourceService.triRessourcesByDateAsc()

      // const results = this.remapToResponse(sortedRessources)

      // Retourner les ressources triées
      return res
        .status(200)
        .json(toResponseDTO<dbRessource[]>(sortedRessources, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching sorted ressources'
      })
    }
  }

  // Méthode pour récupérer les ressources triées par la date de création en ordre décroissant
  static async triRessourcesByDateDesc(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<RessourceResponse[]>> {
    try {
      // Appeler le service pour récupérer les ressources triées
      const sortedRessources =
        await RessourceService.triRessourcesByDateDesc()

      // const results = this.remapToResponse(sortedRessources)

      // Retourner les ressources triées
      return res
        .status(200)
        .json(toResponseDTO<dbRessource[]>(sortedRessources, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching sorted ressources'
      })
    }
  }

  // static remapToResponse(ressource:dbRessource[]):RessourceResponse[]{
  //   return ressource.map(ressource =>{
  //     return{
  //       id: ressource.id,
  //       title: ressource.title,
  //       content: ressource.content,
  //       createdAt: ressource.createdAt,
  //       updatedAt: ressource.updatedAt,
  //       associationId: ressource.associationId,
  //       typePostId: ressource.typePostId
  //     }
  //   })
  // }
}
