import { Request, Response } from 'express'
import { AssociationResponse } from '../dto/association.dto'
import { AssociationService } from '../services/association.service'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import {
  Association,
  AssociationLoginInput,
  associationRegisterInput,
  dbAssociation
} from '../entities/association.entity'
import { encryptPassword } from '../helpers/password.helper'
import { maxAge } from '../helpers/jwt.helper'

export class AssociationController {
  // Méthode pour récupérer toutes les associations
  static async getAssociation(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse>> {
    try {
      const result = await AssociationService.getAssociation()
      return res
        .status(200)
        .json(toResponseDTO<AssociationResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  // Méthode pour s'inscrire en tant qu'association
  static async signup(
    req: Request<{}, {}, associationRegisterInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const input = req.body

      // Vérifier si les mots de passe correspondent
      if (input.password !== input.passwordConfirmation) {
        return res.status(400).json({
          error: 400,
          message: 'Passwords do not match'
        })
      }

      // Crypter le mot de passe
      input.password = await encryptPassword(input.password)

      // Créer l'association
      const result = await AssociationService.createAssociation(input)
      // Définir le cookie JWT
      res.cookie('jwt', result, { httpOnly: true,maxAge: maxAge * 1000  })
      return res
        .status(200)
        .json(
          toResponseDTO<SingleMessageDTO>(
            'Association created successfully',
            200
          )
        )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during signup'
      })
    }
  }

  // Méthode pour se connecter en tant qu'association
  static async login(
    req: Request<{}, {}, AssociationLoginInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const { email, password } = req.body

      // Vérifier les identifiants
      const result = await AssociationService.login(email, password)
      if (!result) {
        return res.status(401).json({
          error: 401,
          message: 'Incorrect email or password'
        })
      }

      // Définit le cookie JWT
      res.cookie('jwt', result, { httpOnly: true })
      res
        .status(200)
        .json(toResponseDTO<SingleMessageDTO>('Association logged in!', 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during login'
      })
    }
  }

  // Méthode pour supprimer une association par ID
  static async deleteAssociationById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const associationId: number = parseInt(req.params.associationId)

      // Vérifie si l'ID de l'association est valide
      if (isNaN(associationId) || associationId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Association Id'
        })
      }

      // Récupérer l'association par ID
      const association =
        await AssociationService.getAssociationById(associationId)
      if (!association) {
        return res.status(404).json({
          error: 404,
          message: 'Association not found'
        })
      }

      // TODO: User admin peut delete
      // Vérifier si l'association est connectée
      const jwtCookie = req.cookies.jwt
      if (!jwtCookie) {
        return res.status(401).json({
          error: 401,
          message: 'Association not authenticated'
        })
      }

      // Supprimer l'association
      await AssociationService.deleteAssociationById(associationId)
      return res
        .status(200)
        .json(
          toResponseDTO<SingleMessageDTO>('Association has been deleted!', 200)
        )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during deleteAssociationById'
      })
    }
  }

  // Méthode pour récupérer une association par ID
  static async getAssociationById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse>> {
    try {
      const associationId: number = parseInt(req.params.associationId)

      // Vérifier si l'ID de l'association est valide
      if (isNaN(associationId) || associationId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Association Id'
        })
      }

      // Récupérer l'association par ID
      const result = await AssociationService.getAssociationById(associationId)
      if (!result) {
        return res.status(400).json({
          error: 400,
          message: 'Association not found'
        })
      }

      return res
        .status(200)
        .json(toResponseDTO<AssociationResponse>(result, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching the association'
      })
    }
  }

  // Méthode pour rechercher des associations par nom ou description
  static async searchAssociations(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse[]>> {
    try {
      // Récupère le mot-clé de la requête query
      const { keyword } = req.params

      // Vérifie si le mot clé est présent
      if (!keyword) {
        return res.status(400).json({
          error: 400,
          message: 'Keyword is required'
        })
      }

      // Recherche des associations correspondant au mot-clé
      const associations = await AssociationService.searchAssociations(
        keyword.toString()
      )

      const results = this.remapToResponse(associations)

      return res
        .status(200)
        .json(toResponseDTO<AssociationResponse[]>(results, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occurred while searching associations'
      })
    }
  }

  // Méthode pour récupérer les associations triées par la date de création en ordre croissant
  static async triAssociationsByDateAsc(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse[]>> {
    try {
      // Appeler le service pour récupérer les associations triées
      const sortedAssociations =
        await AssociationService.triAssociationsByDateAsc()

      const results = this.remapToResponse(sortedAssociations)

      // Retourner les associations triées
      return res
        .status(200)
        .json(toResponseDTO<AssociationResponse[]>(results, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching sorted associations'
      })
    }
  }

  // Méthode pour récupérer les associations triées par la date de création en ordre décroissant
  static async triAssociationsByDateDesc(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse[]>> {
    try {
      // Appeler le service pour récupérer les associations triées
      const sortedAssociations =
        await AssociationService.triAssociationsByDateDesc()

      const results = this.remapToResponse(sortedAssociations)

      // Retourner les associations triées
      return res
        .status(200)
        .json(toResponseDTO<AssociationResponse[]>(results, 200))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching sorted associations'
      })
    }
  }

  // Helpers
  static remapToResponse(assos: dbAssociation[]): AssociationResponse[] {
    return assos.map(asso => {
      return {
        id: asso.id,
        name: asso.name,
        description: asso.description,
        email: asso.email,
        rna: asso.rna,
        updatedAt: asso.updatedAt,
        createdAt: asso.createdAt,
        regionId: asso.regionId
      }
    })
  }
}
